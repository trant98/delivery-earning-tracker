"use client";   // Client Component
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";  // Client Cmponent
import { useRouter } from "next/navigation";    // to refresh page after submit

export default function EarningForm() {
    // [value, setValue] ~~ [variable, function to update variable]
    const [in_date, setDate] = useState("");           // date
    const [in_source, setSource] = useState("AmznFlex");  // default to AmznFlex
    const [in_income, setIncome] = useState("");       // float
    const [in_mileage, setMileage] = useState("");     // float

    // submit message to show result of submit action
    const [submit_msg, setSubmitMsg] = useState("");
    const router = useRouter();  // to refresh page after submit

    async function handleSubmit(event: React.SubmitEvent) {

        // prevent the page from refresh and let React control the submit
        event.preventDefault();

        // connect to Supabase
        const supabase = createClient();

        // get logged-in user
        const { data: { user } } = await supabase.auth.getUser();
        if (user === null) {
            setSubmitMsg("You must be logged in to submit an earning entry");
            return;
        }

        // wait and insert: date, source, income, mileage
        const { error } = await supabase.from("earnings").insert(
            {
                user_id: user.id,
                date: in_date,
                source: in_source,
                income: parseFloat(in_income),
                mileage: parseFloat(in_mileage)
            }
        );

        // if error, show error msg
        if (error) {
            setSubmitMsg(error.message);

            // else, show success msg
        } else {
            setSubmitMsg("[Your entry has been added]");
            router.refresh();  // refresh page to show new entry in earnings table
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex gap-2">
                {/* When an input changes, React gives you an event. The typed value lives in
                * event.target.value
                */}

                {/* Date */}
                <input type="date" value={in_date} onChange={(event) => setDate(event.target.value)} />

                {/* Source: Amz, Uber, etc */}
                <select value={in_source} onChange={(event) => setSource(event.target.value)}>
                    <option value="AmznFlex">AmznFlex</option>
                    <option value="DoorDash">DoorDash</option>
                    <option value="UberEats">UberEats</option>
                </select>

                {/* Income */}
                <input type="number" placeholder="Income" value={in_income} onChange={(event) => setIncome(event.target.value)} />

                {/* Mileage Driven */}
                <input type="number" placeholder="Mileage" value={in_mileage} onChange={(event) => setMileage(event.target.value)} />

                {/* Submit button */}
                <button type="submit">Submit</button>
            </div>

            <div className="p-2 text-center">
                {/* justify-* controls vertical positioning
                items-* controls horizontal positioning */}

                {/* Display the submit result */}
                {submit_msg}
            </div>

        </form>
    );
}
