"use client";   // Client Component
import { createClient } from "@/lib/supabase/client";  // Client Cmponent
import { useRouter } from "next/navigation";    // to refresh page after delete

export default function DeleteRowButton({ delete_id }: { delete_id: number }) {
    const router = useRouter();  // to refresh page after delete

    async function handleDelete() {
        // connect to Supabase client
        const supabase = createClient();

        // delete from earnings table where the id matches the desired delete_id
        const { error } = await supabase.from("earnings").delete().eq("id", delete_id);

        // if error, show error message
        if (error) {
            console.log(error);

            // else, show success message
        } else {
            router.refresh();   // refresh router
        }
    }

    return (<button type="button" onClick={handleDelete}>Delete</button>);
}