import { createClient } from "@/lib/supabase/server";  // Server Cmponent
import { InfoIcon } from "lucide-react";
import { Suspense } from "react";
import EarningForm from "./EarningForm";
import DeleteRowButton from "./DeleteRowButton";

async function EarningsTable() {
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
    content = <pre>{JSON.stringify(earnings, null, 2)}</pre>
  }

  return content;
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">

      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>

      <EarningForm />

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Earnings Table</h2>
        <Suspense>
          <EarningsTable />
        </Suspense>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        {/* <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          <Suspense>
            <UserDetails />
          </Suspense>
        </pre> */}
      </div>

      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        {/* <FetchDataSteps /> */}
      </div>

    </div>
  );
}
