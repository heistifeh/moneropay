"use client";

import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <main className="">{children}</main>
       <Toaster/>
      </body>
    </html>
  );
}
