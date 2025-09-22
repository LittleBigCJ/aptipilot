// app/about/page.tsx
export default function AboutPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">About AptiPilot</h1>
      <p>
        AptiPilot is a practice platform for pilot aptitude and ATPL subjects.
        Add or update question banks in <code>public/tests</code> and the quiz
        page will automatically pick them up.
      </p>
    </section>
  );
}
