// app/set-password/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";
import { updatePasswordAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function SetPasswordPage() {
  const supabase = await createSupabaseServer(); // ← await the async factory
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/set-password");
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-4 text-2xl font-semibold">Set a new password</h1>
      <form action={updatePasswordAction} className="space-y-3">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm">
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            minLength={8}
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md border px-4 py-2 text-sm"
        >
          Save password
        </button>
      </form>
      <p className="mt-3 text-xs text-gray-500">
        Tip: minimum 8 characters. You’ll be redirected to your profile after a
        successful change.
      </p>
    </div>
  );
}
