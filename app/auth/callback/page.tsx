// app/auth/callback/page.tsx
import { Suspense } from "react";
import Callback from "./Callback";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md p-6">Checking sign-in…</main>}>
      <Callback />
    </Suspense>
  );
}
