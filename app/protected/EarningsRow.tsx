"use client";
import { createClient } from "@/lib/supabase/client";  // Client Cmponent
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteRowButton from "./DeleteRowButton";
import { calculateEarningsData } from "./EarningsCalculation";

/**
 * EarningsRow
 *
 * Displays one earnings entry inside the earnings table.
 * The row can switch between normal mode and editing mode.
 *
 * Features:
 * - Shows saved earning data.
 * - Allows the user to edit date, source, income, and mileage.
 * - Recalculates gross profit, self-employment tax, and net profit.
 * - Updates the selected row in Supabase.
 * - Allows canceling edits and restoring the original values.
 * - Refreshes the page after saving changes.
 *
 * @param entry The earnings record to display and edit.
 * @returns A table ROW for one earnings entry.
 */
export default function EarningsRow(
    {
        entry
    }: {
        entry: {
            id: number;
            date: string;
            source: string;
            income: number;
            mileage: number;
            gross_profit?: number;
            se_tax?: number;
            net_profit?: number;
        }
    }
) {
    /// ========================================================================
    /// ========================= Use States ===================================
    /// ========================================================================

    const [isEditing, setIsEditing] = useState(false);     // trigger switch
    const [new_date, setNewDate] = useState(entry.date);
    const [new_source, setNewSource] = useState(entry.source);
    const [new_income, setNewIncome] = useState(String(entry.income));
    const [new_mileage, setNewMileage] = useState(String(entry.mileage));

    const router = useRouter();

    /// ========================================================================
    /// ========================= HELPER FUNCTIONS =============================
    /// ========================================================================

    /**
     * Enters editing mode for the selected row.
     */
    function handleEdit() {
        setIsEditing(true);     // enter editing mode
    }

    /**
     * Cancels editing, restores the original entry values,
     * and exits editing mode.
     */
    function handleCancel() {
        // keep all the original values
        setNewDate(entry.date);
        setNewSource(entry.source);
        setNewIncome(String(entry.income));
        setNewMileage(String(entry.mileage));

        // get out of the editing mode
        setIsEditing(false);
    }

    /**
     * Saves the edited earnings entry to Supabase.
     * The function recalculates profit and tax values before updating the row.
     */
    async function handleSave() {
        // connect to supabase
        const supabase = createClient();

        const calculated_data = calculateEarningsData(parseFloat(new_income), parseFloat(new_mileage));

        // find the target_id and update that row
        const { error } = await supabase.from("earnings").update(
            {
                date: new_date,
                source: new_source,
                income: new_income,
                mileage: new_mileage,
                gross_profit: calculated_data.gross_profit,
                se_tax: calculated_data.se_tax,
                net_profit: calculated_data.net_profit
            }
        ).eq("id", entry.id);

        // if error, show msg
        if (error) {
            console.log(error);

            // else, the editing is done. get out
        } else {
            router.refresh();
            setIsEditing(false);
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

    // if we are not in editing mode, show Edit and Delete buttons
    if (!isEditing) {
        content = <tr>
            {/* Display all the saved input data */}
            <td className="p-2">{entry.date}</td>
            <td className="p-2">{entry.source}</td>
            <td className="p-2 text-right">${entry.income.toFixed(2)}</td>
            <td className="p-2 text-right">{entry.mileage.toFixed(2)}</td>

            {/* Display the Edit and Delete Buttons */}
            <td className="p-2">
                <div>
                    <button type="button" onClick={handleEdit}>Edit</button>

                    <span> | </span>

                    <DeleteRowButton delete_id={entry.id} />
                </div>
            </td>

            {/* Display all the calculated data */}
            <td className="p-2 text-right">${entry.gross_profit?.toFixed(2)}</td>
            <td className="p-2 text-right">${entry.se_tax?.toFixed(2)}</td>
            <td className="p-2 text-right">${entry.net_profit?.toFixed(2)}</td>
        </tr>

        // else, let user input new data, and show Save and Cancel buttons
    } else {
        content = <tr>

            {/* Date */}
            <td className="p-2">
                <input type="date" value={new_date}
                    onChange={(event) => setNewDate(event.target.value)} />
            </td>

            {/* Source */}
            <td className="p-2">
                <select value={new_source} onChange={(event) => setNewSource(event.target.value)}>
                    <option value="AmznFlex">AmznFlex</option>
                    <option value="DoorDash">DoorDash</option>
                    <option value="UberEats">UberEats</option>
                </select>
            </td>

            {/* Income */}
            <td className="p-2">
                <input type="number" value={new_income}
                    onChange={(event) => setNewIncome(event.target.value)} />
            </td>

            {/* Mileage */}
            <td className="p-2">
                <input type="number" value={new_mileage}
                    onChange={(event) => setNewMileage(event.target.value)} />
            </td>

            <td className="p-2">
                {/* Save button */}
                <button type="button" onClick={handleSave}>Save</button>

                <span> | </span>

                {/* Cancel button */}
                <button type="button" onClick={handleCancel}>Cancel</button>
            </td>

        </tr>
    }

    return content;
}