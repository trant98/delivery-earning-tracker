"use client";   // Client Component
import { useState } from "react";

function handleSubmit() {

}

export default function EarningForm() {
    // [value, setValue] ~~ [variable, function to update variable]
    const [date, setDate] = useState("");
    const [source, setSource] = useState("");
    const [income, setIncome] = useState("");
    const [mileage, setMileage] = useState("");

    return (
        <form onSubmit={handleSubmit}>
            {/* When an input changes, React gives you an event. The typed value lives in
              * event.target.value
              */}

            {/* Date */}
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />

            {/* Source: Amz, Uber, etc */}
            <select value={source} onChange={(event) => setSource(event.target.value)}>
                <option value="AmznFlex">AmznFlex</option>
                <option value="DoorDash">DoorDash</option>
                <option value="UberEats">UberEats</option>
            </select>

            {/* Income */}
            <input type="number" value={income} onChange={(event) => setIncome(event.target.value)} />

            {/* Mileage Driven */}
            <input type="number" value={mileage} onChange={(event) => setMileage(event.target.value)} />

            {/* Submit button */}
            <button type="submit">Submit</button>

        </form>
    );
}
