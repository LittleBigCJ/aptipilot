// app/page.tsx
export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to AptiPilot</h1>
      <p className="text-lg text-gray-700">
        Practice pilot aptitude & ATPL subjects with flexible question banks and instant feedback.
      </p>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Go to <a className="text-blue-600 underline" href="/quiz">Quiz</a> to start a test</li>
        <li>Add CSV banks in <code>public/tests</code></li>
      </ul>
    </section>
  );
}
