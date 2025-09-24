// app/layout.tsx
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "AptiPilot",
  description: "Pilot aptitude tests",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Server-rendered Nav so auth state is correct on first paint */}
        <NavBar />
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
