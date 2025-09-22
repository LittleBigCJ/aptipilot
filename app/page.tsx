"use client";

import React, { useEffect, useMemo, useState } from "react";

// --- Quick Start Notes ---
// 1) Drop this file into a Next.js app (app/page.tsx) or any React app.
// 2) Make sure Tailwind is set up. (Vercel Next.js + Tailwind template works out of the box.)
// 3) Replace SAMPLE_BANK below with your real CSV/JSON. A simple CSV importer is included.
// 4) Deploy to Vercel. You now have a cross‑device MCQ site.

// ---- Types ----
type Item = {
  id: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  stem: string;
  correct: string;
  distractor1: string;
  distractor2: string;
  distractor3: string;
  explanation?: string;
};

// ---- Sample questions (replace with your CSV/JSON) ----
const SAMPLE_BANK: Item[] = [
  {
    id: "MET-0001",
    topic: "Atmosphere & ISA",
    difficulty: "Easy",
    stem: "What is the sea-level standard pressure in the International Standard Atmosphere (ISA)?",
    correct: "1013.25 hPa",
    distractor1: "1000.0 hPa",
    distractor2: "29.92 hPa",
    distractor3: "1013.25 mbars",
    explanation:
      "ISA sea-level pressure is 1013.25 hPa (equivalent to 29.92 inHg).",
  },
  {
    id: "MET-0002",
    topic: "Atmosphere & ISA",
    difficulty: "Easy",
    stem: "What is the ISA sea-level temperature?",
    correct: "+15°C",
    distractor1: "0°C",
    distractor2: "+20°C",
    distractor3: "+10°C",
    explanation: "ISA sea-level temperature is +15°C.",
  },
  {
    id: "MET-0015",
    topic: "Fronts",
    difficulty: "Easy",
    stem: "A warm front typically produces which sequence of clouds (approaching the front)?",
    correct: "Cirrus → Cirrostratus → Altostratus → Nimbostratus",
    distractor1: "Cumulonimbus then clear skies",
    distractor2: "Stratocumulus only",
    distractor3: "Towering cumulus then cirrus",
    explanation:
      "Classic warm-front progression with increasing cloud thickness leading to Ns.",
  },
];

// ---- Utility: shuffle answers & sample questions ----
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sampleByTopic(
  bank: Item[],
  topic: string | "All",
  count: number,
  difficulty: "All" | Item["difficulty"]
) {
  let filtered = bank;
  if (topic !== "All") filtered = filtered.filter((q) => q.topic === topic);
  if (difficulty !== "All") filtered = filtered.filter((q) => q.difficulty === difficulty);
  const picked = shuffle(filtered).slice(0, Math.min(count, filtered.length));
  return picked.map((q) => ({
    ...q,
    options: shuffle([q.correct, q.distractor1, q.distractor2, q.distractor3]),
  }));
}

// ---- Minimal CSV importer (client-only) ----
function parseCsv(text: string): Item[] {
  // Very small CSV parser; expects header matching our schema.
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift();
  if (!header) return [];
  const cols = header.split(",").map((h) => h.trim());
  const idx = (name: string) => cols.indexOf(name);
  const required = [
    "id",
    "topic",
    "difficulty",
    "stem",
    "correct",
    "distractor1",
    "distractor2",
    "distractor3",
  ];
  for (const r of required) if (idx(r) === -1) throw new Error(`CSV missing column: ${r}`);

  const out: Item[] = [];
  for (const line of lines) {
    const cells = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/); // split on commas not inside quotes
    const get = (name: string) => (cells[idx(name)] ?? "").replace(/^\"|\"$/g, "").trim();
    out.push({
      id: get("id"),
      topic: get("topic"),
      difficulty: get("difficulty") as Item["difficulty"],
      stem: get("stem"),
      correct: get("correct"),
      distractor1: get("distractor1"),
      distractor2: get("distractor2"),
      distractor3: get("distractor3"),
      explanation: idx("explanation") !== -1 ? get("explanation") : undefined,
    });
  }
  return out;
}

// ---- Local storage helpers ----
const LS_KEY = "aptipilot-progress-v1";

type Progress = {
  topic: string;
  difficulty: string;
  total: number;
  correct: number;
  startedAt: string;
  finishedAt?: string;
};

function loadProgress(): Progress[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveProgress(p: Progress[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(p));
}

// ---- Main Component ----
export default function AptiPilotMCQ() {
  const [bank, setBank] = useState<Item[]>(SAMPLE_BANK);
  const [topic, setTopic] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<"All" | Item["difficulty"]>("All");
  const [count, setCount] = useState<number>(10);
  const [quiz, setQuiz] = useState<(Item & { options: string[] })[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplain, setShowExplain] = useState(false);
  const [history, setHistory] = useState<Progress[]>([]);

  useEffect(() => {
    setHistory(loadProgress());
  }, []);

  const topics = useMemo(() => {
    const s = new Set<string>(bank.map((q) => q.topic));
    return ["All", ...Array.from(s).sort()];
  }, [bank]);

  const difficulties = ["All", "Easy", "Medium", "Hard"] as const;

  const startQuiz = () => {
    const picked = sampleByTopic(bank, topic as any, count, difficulty);
    setQuiz(picked);
    setIdx(0);
    setAnswers({});
    setShowExplain(false);
    const prog: Progress = {
      topic,
      difficulty,
      total: picked.length,
      correct: 0,
      startedAt: new Date().toISOString(),
    };
    const newHist = [prog, ...history];
    setHistory(newHist);
    saveProgress(newHist);
  };

  const current = quiz?.[idx];
  const done = quiz && idx >= quiz.length;

  const score = useMemo(() => {
    if (!quiz) return 0;
    let c = 0;
    for (const q of quiz) if (answers[q.id] === q.correct) c++;
    return c;
  }, [answers, quiz]);

  useEffect(() => {
    if (!quiz) return;
    if (idx >= quiz.length) {
      const updated = [...history];
      updated[0] = {
        ...updated[0],
        correct: score,
        finishedAt: new Date().toISOString(),
      };
      setHistory(updated);
      saveProgress(updated);
    }
  }, [idx, quiz, score]);

  const importCsv = async (file: File) => {
    const text = await file.text();
    try {
      const parsed = parseCsv(text);
      if (parsed.length === 0) throw new Error("CSV contained no rows");
      setBank(parsed);
      setTopic("All");
      setDifficulty("All");
      alert(`Imported ${parsed.length} items.`);
    } catch (e: any) {
      alert(`Failed to import CSV: ${e?.message || e}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">AptiPilot — MCQ Test</h1>
          <label className="text-sm cursor-pointer px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50">
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importCsv(f);
            }} />
          </label>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {!quiz && (
          <section className="bg-white rounded-2xl shadow p-5 space-y-4">
            <h2 className="text-lg font-semibold">Configure a Test</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Topic</label>
                <select className="w-full border rounded-lg px-3 py-2" value={topic} onChange={(e) => setTopic(e.target.value)}>
                  {topics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select className="w-full border rounded-lg px-3 py-2" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Question Count</label>
                <input type="number" min={1} max={100} className="w-full border rounded-lg px-3 py-2" value={count} onChange={(e) => setCount(parseInt(e.target.value || "10", 10))} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Bank size: {bank.length} items</p>
              <button onClick={startQuiz} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Start Test</button>
            </div>
          </section>
        )}

        {quiz && !done && current && (
          <section className="mt-6 bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Question {idx + 1} of {quiz.length}</span>
              <button className="text-sm text-blue-600 hover:underline" onClick={() => setShowExplain((v) => !v)}>
                {showExplain ? "Hide explanation" : "Show explanation"}
              </button>
            </div>
            <h3 className="text-lg font-medium mb-4">{current.stem}</h3>
            <div className="space-y-2">
              {current.options.map((opt) => {
                const chosen = answers[current.id];
                const isChosen = chosen === opt;
                const isCorrect = opt === current.correct;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      setAnswers({ ...answers, [current.id]: opt });
                      setTimeout(() => setIdx((i) => i + 1), 300);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                      chosen
                        ? isCorrect
                          ? "bg-green-50 border-green-600"
                          : "bg-red-50 border-red-600"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {showExplain && (
              <p className="mt-4 text-sm text-gray-700"><span className="font-semibold">Why:</span> {current.explanation || ""}</p>
            )}
          </section>
        )}

        {done && quiz && (
          <section className="mt-6 bg-white rounded-2xl shadow p-5">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            <p className="mb-4">You scored <span className="font-semibold">{score}/{quiz.length}</span> ({Math.round((score/quiz.length)*100)}%).</p>
            <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={() => setQuiz(null)}>Finish</button>
          </section>
        )}

        {history.length > 0 && (
          <section className="mt-6 bg-white rounded-2xl shadow p-5">
            <h3 className="text-lg font-semibold mb-3">Your Recent Sessions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Started</th>
                    <th className="py-2 pr-4">Topic</th>
                    <th className="py-2 pr-4">Difficulty</th>
                    <th className="py-2 pr-4">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-2 pr-4">{new Date(h.startedAt).toLocaleString()}</td>
                      <td className="py-2 pr-4">{h.topic}</td>
                      <td className="py-2 pr-4">{h.difficulty}</td>
                      <td className="py-2 pr-4">{h.finishedAt ? `${h.correct}/${h.total}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mt-10 text-xs text-gray-500">
          <p>Tip: import the CSV you downloaded earlier to replace the sample items. Answers are shuffled per attempt.</p>
        </section>
      </main>
    </div>
  );
}
