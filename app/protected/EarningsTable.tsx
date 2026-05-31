import { createClient } from "@/lib/supabase/server";  // Server Cmponent
import DeleteRowButton from "./DeleteRowButton";
import EditRowButton from "./EditRowButton";

export default async function EarningsTable() {
    let content;  // return var

    // connect to supabase => wait to get a supabase object
    const supabase = await createClient();

    // go to "earnings" table from the supabase object
    // and select all the columns
    const { data: earnings, error } = await supabase.from("earnings").select("*");

    // if error, show error
    if (error) {
        content = <p>Error: Cannot load earnings</p>

        // else if empty, show "no earnings yet"
    } else if (earnings.length === 0) {
        content = <p>No earnings yet. Please add your first entry</p>

        // else show table of earnings
    } else {
        content = earnings.map((entry) => {
            return <div key={entry.id}>

                {/* Display all the data */}
                {entry.date}
                {entry.source}
                {entry.income}
                {entry.mileage}

                {/* Display the Edit Button */}
                <EditRowButton
                    target_id={entry.id}
                    date={entry.date}
                    source={entry.source}
                    income={entry.income}
                    mileage={entry.mileage}
                />

                {/* Display the Delete button */}
                <DeleteRowButton delete_id={entry.id} />
            </div>;
        })
    }

    return content;
}
