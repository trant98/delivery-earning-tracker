import { createClient } from "@/lib/supabase/server";  // Server Cmponent
import EarningsRow from "./EarningsRow";

/**
 * EarningsTable
 *
 * Retrieves earnings records from Supabase
 * and displays them in a table.
 *
 * @returns A table of earnings records, an empty-state message,
 * or an error message.
 */
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
        content = <p>No earnings yet. Please add your first entry.</p>

        // else show table of earnings
    } else {
        // table
        // ├─ thead
        // │   └─ tr
        // │       └─ th
        // └─ tbody
        //     └─ tr
        //         └─ td
        content =
            <table>
                {/* Column Headers */}
                <thead>
                    <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Source</th>
                        <th className="p-2">Income</th>
                        <th className="p-2">Mileage</th>
                        <th className="p-2">Actions</th>
                        <th className="p-2">Gross Profit</th>
                        <th className="p-2">SE Tax</th>
                        <th className="p-2">Net Profit</th>
                    </tr>
                </thead>

                {/* Row's Data */}
                <tbody>
                    {earnings.map((entry) => {
                        return <EarningsRow key={entry.id} entry={entry} />
                    })}
                </tbody>
            </table>
    }

    return content;
}
