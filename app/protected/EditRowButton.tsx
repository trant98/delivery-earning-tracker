"use client";
import { createClient } from "@/lib/supabase/client";  // Client Cmponent
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditRowButton(
    {
        target_id,
        date,
        source,
        income,
        mileage
    }: {
        target_id: number;
        date: string;
        source: string;
        income: number;
        mileage: number;
    }
) {
    /// ========================================================================
    /// ========================= Use States ===================================
    /// ========================================================================

    const [isEditing, setIsEditing] = useState(false);     // trigger switch
    const [new_date, setNewDate] = useState(date);
    const [new_source, setNewSource] = useState(source);
    const [new_income, setNewIncome] = useState(income);
    const [new_mileage, setNewMileage] = useState(mileage);

    const router = useRouter();

    /// ========================================================================
    /// ========================= HELPER FUNCTIONS =============================
    /// ========================================================================

    function handleEdit() {
        setIsEditing(true);     // enter editing mode
    }

    function handleCancel() {
        // keep all the original values
        setNewDate(date);
        setNewSource(source);
        setNewIncome(income);
        setNewMileage(mileage);

        // get out of the editing mode
        setIsEditing(false);
    }

    async function handleSave() {
        // connect to supabase
        const supabase = createClient();

        // find the target_id and update that row
        const { error } = await supabase.from("earnings").update(
            {
                date: new_date,
                source: new_source,
                income: new_income,
                mileage: new_mileage
            }
        ).eq("id", target_id);

        // if error, show msg
        if (error) {
            console.log(error);

            // else, the editing is done. get out
        } else {
            setIsEditing(false);
            router.refresh();
        }
    }

    /// ========================================================================
    /// ========================= MAIN Actions =================================
    /// ========================================================================

    /**
     * normal state:    date, source, ..., [edit], [delete]
     * triggered state: date, source, ..., [save], [cancel]
     * so:
     * 1. content could be [edit]
     * 2. content could be [save] and [cancel]
     */
    let content;    // return var

    // if we are not in editing mode, show Edit button
    if (!isEditing) {
        content = <button type="button" onClick={handleEdit}>Edit</button>

        // else, let user input new data, and show Save and Cancel buttons
    } else {
        content = <div>

            {/* Date */}
            <input type="date" value={new_date}
                onChange={(event) => setNewDate(event.target.value)} />

            {/* Source */}
            <select value={new_source} onChange={(event) => setNewSource(event.target.value)}>
                <option value="AmznFlex">AmznFlex</option>
                <option value="DoorDash">DoorDash</option>
                <option value="UberEats">UberEats</option>
            </select>

            {/* Income */}
            <input type="number" value={new_income}
                onChange={(event) => setNewIncome(parseFloat(event.target.value))} />

            {/* Mileage */}
            <input type="number" value={new_mileage}
                onChange={(event) => setNewMileage(parseFloat(event.target.value))} />

            {/* Save button */}
            <button type="button" onClick={handleSave}>Save</button>

            {/* Cancel button */}
            <button type="button" onClick={handleCancel}>Cancel</button>

        </div>
    }

    return content;
}