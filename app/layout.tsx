import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASTSTR Burn Tracker",
  description:
    "Live buyback-and-burn dashboard for $ASTSTR — tracking $ASTEROID Shiba burns in real time.",
  openGraph: {
    title: "ASTSTR Burn Tracker",
    description:
      "Real-time dashboard for the $ASTSTR buyback-and-burn of $ASTEROID Shiba.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="stars antialiased">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
