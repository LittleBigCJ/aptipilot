"use client";

import React, { useEffect, useMemo, useState } from "react";

/* ========================= Types ========================= */

type RawRow = {
  id: string;
  topic: string;
  difficulty: string;
  stem: string;
  correct: string;
  distractor1: string;
  distractor2: string;
  distractor3: string;
  explanation: string;
};

type Question = RawRow & { options: string[] };

/* ========================= Config =========================
   Next.js (client) can't list folder contents at runtime,
   so keep this list in sync with files in /public/tests.
============================================================ */

const CSV_FILES = [
  "Air_Law.csv",
  "Human_Performance.csv",
  "Meteorology.csv",
  "Aircraft_General_Knowledge_Airframe_Systems_Powerplant.csv",
  "Aircraft_General_Knowledge_Instrumentation.csv",
  "Mass_and_Balance.csv",
  "Performance.csv",
  "Flight_Planning_and_Monitoring.csv",
  "General_Navigation.csv",
  "Radio_Navigation.csv",
  "Operational_Procedures.csv",
  "Principles_of_Flight.csv",
  "VFR_Communications.csv",
  "IFR_Communications.csv",
];

/* ========================= Utils ========================= */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function loadCSV(file: string): Promise<RawRow[]> {
  const res = await fetch(`/tests/${file}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${file}`);
  const text = await res.text();

  const lines = text.trim().split(/\r?\n/);
  const header = lines.shift();
  if (!header) return [];

  // parse CSV with quoted fields
  const cols = header.split(",").map((c) => c.trim());
  const idx = (name: string) => cols.indexOf(name);

  const rows: RawRow[] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = line
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map((c) => c.replace(/^"+|"+$/g, "").trim());

    rows.push({
      id: cells[idx("id")],
      topic: cells[idx("topic")],
      difficulty: cells[idx("difficulty")],
      stem: cells[idx("stem")],
      correct: cells[idx("correct")],
      distractor1: cells[idx("distractor1")],
      distractor2: cells[idx("distractor2")],
      distractor3: cells[idx("distractor3")],
      explanation: cells[idx("explanation")],
    });
  }
  return rows;
}

/* ========================= Page ========================= */

export default function Page() {
  const [subject, setSubject] = useState<string>("");
  const [bank, setBank] = useState<RawRow[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );

  const [desiredCount, setDesiredCount] = useState<number>(10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState<boolean>(false);

  const subjectLabel = subject ? subject.replace(".csv", "") : "—";

  /* ---------- load selected subject CSV ---------- */
  async function startTest() {
    if (!subject) return;
    try {
      setStatus("loading");
      const rows = await loadCSV(subject);
      setBank(rows);

      const sampleSize = Math.min(
        Math.max(1, Math.floor(desiredCount)),
        rows.length
      );
      const pickedRaw = shuffle(rows).slice(0, sampleSize);

      const qs: Question[] = pickedRaw.map((r) => ({
        ...r,
        options: shuffle([r.correct, r.distractor1, r.distractor2, r.distractor3]),
      }));

      setQuestions(qs);
      setIndex(0);
      setAnswers({});
      setDone(false);
      setStatus("ready");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  function selectAnswer(qid: string, option: string) {
    setAnswers((a) => ({ ...a, [qid]: option }));
    setTimeout(() => {
      if (index + 1 < questions.length) setIndex(index + 1);
      else setDone(true);
    }, 200);
  }

  const score = useMemo(() => {
    if (!questions.length) return 0;
    let s = 0;
    for (const q of questions) if (answers[q.id] === q.correct) s++;
    return s;
  }, [answers, questions]);

  /* ========================= UI ========================= */

  // Setup screen
  if (!questions.length) {
    const available = bank?.length ?? 0;

    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-2xl font-bold">AptiPilot — ATPL Quiz</h1>

        <section className="space-y-4 rounded-2xl bg-white p-5 shadow">
          <div>
            <label className="mb-1 block text-sm font-medium">Select Subject</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setBank(null);
                setStatus("idle");
              }}
            >
              <option value="">-- Choose a CSV from /public/tests --</option>
              {CSV_FILES.map((f) => (
                <option key={f} value={f}>
                  {f.replace(".csv", "")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Number of Questions
            </label>
            <input
              type="number"
              min={1}
              max={bank ? Math.max(1, bank.length) : 200}
              className="w-full rounded border px-3 py-2"
              value={desiredCount}
              onChange={(e) =>
                setDesiredCount(
                  Math.max(1, Math.floor(Number(e.target.value || 1)))
                )
              }
            />
            <p className="mt-1 text-xs text-gray-500">
              {status === "ready" && bank
                ? `Bank loaded: ${bank.length} items`
                : subject
                ? "Subject selected — will load on Start"
                : "Pick a subject first"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startTest}
              disabled={!subject || status === "loading"}
              className="rounded-xl bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
            >
              {status === "loading" ? "Loading..." : "Start Test"}
            </button>
            {subject && (
              <span className="text-sm text-gray-600">
                Subject: <span className="font-medium">{subjectLabel}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Put CSV files in <code>/public/tests</code> (header must be:{" "}
            <code>
              id,topic,difficulty,stem,correct,distractor1,distractor2,distractor3,explanation
            </code>
            ).
          </p>
        </section>
      </main>
    );
  }

  // Results page
  if (done) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="mb-3 text-2xl font-bold">{subjectLabel} — Results</h1>
        <p className="mb-6 text-lg">
          Score:{" "}
          <span className="font-semibold">
            {score}/{questions.length}
          </span>{" "}
          ({Math.round((score / questions.length) * 100)}%)
        </p>

        <div className="space-y-4">
          {questions.map((q, i) => {
            const picked = answers[q.id];
            const isCorrect = picked === q.correct;
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4 ${
                  isCorrect ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50"
                }`}
              >
                <div className="mb-2 text-sm text-gray-600">
                  Q{i + 1}. {q.topic} · {q.difficulty}
                </div>
                <div className="mb-3 font-medium">{q.stem}</div>

                <div className="mb-2">
                  <span className="font-semibold">Your answer: </span>
                  <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                    {picked ?? "—"}
                  </span>
                </div>
                {!isCorrect && (
                  <div className="mb-2">
                    <span className="font-semibold">Correct answer: </span>
                    <span className="text-green-700">{q.correct}</span>
                  </div>
                )}

                {q.explanation && (
                  <div className="mt-2 text-sm text-gray-700">
                    <span className="font-semibold">Explanation: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              setQuestions([]);
              setAnswers({});
              setDone(false);
              setIndex(0);
            }}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            Back to Menu
          </button>
          <button
            onClick={() => {
              // restart same subject with same desiredCount
              setQuestions([]);
              setDone(false);
              setIndex(0);
              startTest();
            }}
            className="rounded-xl border border-blue-600 px-4 py-2 text-blue-700"
          >
            Retake (new random set)
          </button>
        </div>
      </main>
    );
  }

  // Question view
  const q = questions[index];

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-2 text-sm text-gray-600">
        {subjectLabel} · Question {index + 1} of {questions.length}
      </div>
      <h1 className="mb-4 text-lg font-semibold">{q.stem}</h1>

      <div className="space-y-2">
        {q.options.map((opt) => {
          const chosen = answers[q.id];
          const isSelected = chosen === opt;
          const isRight = opt === q.correct;

          let classes =
            "w-full text-left px-4 py-3 rounded-xl border transition bg-white hover:bg-gray-50";
          if (chosen) {
            if (isSelected && isRight) classes = "w-full text-left px-4 py-3 rounded-xl border bg-green-50 border-green-600";
            else if (isSelected && !isRight)
              classes = "w-full text-left px-4 py-3 rounded-xl border bg-red-50 border-red-600";
          }

          return (
            <button
              key={opt}
              onClick={() => selectAnswer(q.id, opt)}
              className={classes}
              disabled={!!chosen}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
        <span>
          Topic: <span className="font-medium">{q.topic}</span> · Difficulty:{" "}
          <span className="font-medium">{q.difficulty}</span>
        </span>
        <span>
          {index + 1}/{questions.length}
        </span>
      </div>
    </main>
  );
}
