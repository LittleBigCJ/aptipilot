import { Suspense } from "react";
import Callback from "./Callback";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md p-6">
          <h1 className="mb-4 text-2xl font-bold">Signing you in…</h1>
          <p className="text-gray-700">Please wait while we verify your email.</p>
        </main>
      }
    >
      <Callback />
    </Suspense>
  );
}
