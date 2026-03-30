import "./globals.css";

export const metadata = {
  title: "AI Pokédex",
  description: "An AI-powered Pokédex with chat functionality",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
