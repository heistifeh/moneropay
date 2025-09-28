"use client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
