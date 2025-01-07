import "@/app/_styles/globals.css";

import Navigation from "./_components/Navigation";

export const metadata = {
  title: "Ticketing App",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-primary-950 text-primary-100 
        min-h-screen flex flex-col"
      >
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
