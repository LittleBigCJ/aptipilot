// app/quiz/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";
import QuizClient from "./QuizClient";

export default async function Page() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in?message=" + encodeURIComponent("Please sign in to take the quiz."));
  }

  // User is authenticated; render the client quiz UI
  return <QuizClient />;
}
