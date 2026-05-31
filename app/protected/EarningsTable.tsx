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
                    </tr>
                </thead>

                {/* Row's Data */}
                <tbody>
                    {earnings.map((entry) => {
                        return <tr key={entry.id}>

                            {/* Display all the data */}
                            <td className="p-2">{entry.date}</td>
                            <td className="p-2">{entry.source}</td>
                            <td className="p-2">{entry.income}</td>
                            <td className="p-2">{entry.mileage}</td>

                            {/* Display the Edit Button */}
                            <td className="p-2">
                                <div>
                                    <EditRowButton
                                        target_id={entry.id}
                                        date={entry.date}
                                        source={entry.source}
                                        income={entry.income}
                                        mileage={entry.mileage}
                                    />

                                    <span> | </span>

                                    <DeleteRowButton delete_id={entry.id} />
                                </div>
                            </td>
                        </tr>;
                    })}
                </tbody>
            </table>
    }

    return content;
}
