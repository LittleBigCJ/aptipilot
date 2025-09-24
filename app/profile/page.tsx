// app/profile/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/profile");
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Your profile</h1>
      <pre className="rounded-md border bg-gray-50 p-4 text-sm">
        {JSON.stringify(
          { id: user.id, email: user.email, aud: user.aud },
          null,
          2
        )}
      </pre>
    </div>
  );
}
