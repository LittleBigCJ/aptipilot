// app/quiz/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/quiz");
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Quiz</h1>
      {/* ... your quiz content ... */}
    </div>
  );
}
