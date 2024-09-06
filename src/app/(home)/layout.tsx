/* eslint-disable react/no-unescaped-entities */
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <main className="flex">
      <Navbar />
      {children}
      <div className="min-h-screen h-full border-l max-w-sm w-full px-6">
        <div className="flex flex-col items-center mt-2">
          <div className="relative flex items-center w-full">
            <Input placeholder="Search" className="pl-10 pr-4" />
            <Search className="absolute pl-2 stroke-muted-foreground" />
          </div>
        </div>

        <div className="border rounded-lg my-2 p-2">
          <h2 className="font-bold text-xl">What's happening</h2>
        </div>

        {session && (
          <div className="border rounded-lg my-2 p-2">
            <h2 className="font-bold text-xl">Who to follow</h2>
          </div>
        )}
      </div>
    </main>
  );
}
