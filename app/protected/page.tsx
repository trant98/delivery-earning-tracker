import { InfoIcon } from "lucide-react";
import { Suspense } from "react";
import EarningForm from "./EarningForm";
import EarningsTable from "./EarningsTable";

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">

      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Add New Entry</h2>
        <EarningForm />
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Earnings Table</h2>
        <Suspense>
          <EarningsTable />
        </Suspense>
      </div>

    </div>
  );
}
