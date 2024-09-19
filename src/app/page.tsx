import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { Button } from "@/components/ui/button";
import { Cherry } from "lucide-react";

export default async function Home() {
  const session = await auth();

  if (session) {
    return redirect("/home");
  }

  return (
    <div className="flex justify-center items-center gap-x-44 min-h-screen">
      <div>
        <Cherry className="size-96" />
      </div>
      <div>
        <div className="my-6">
          <h1 className="text-6xl font-bold leading-loose tracking-wide">
            Jorkin it now
          </h1>
          <h2 className="font-bold text-2xl">Join today.</h2>
        </div>

        <div className="max-w-xs">
          <Button asChild className="w-full">
            <Link href="/register">Create account</Link>
          </Button>
          <p className="text-xs mt-0.5">
            By signing up, you agree to the Terms of Service and Privacy Policy,
            including Cookie Use.
          </p>
          <div className="flex justify-center items-center my-2">
            <div className="flex-1 mx-1">
              <div className="bg-neutral-400 h-px"></div>
            </div>
            <span>or</span>
            <div className="flex-1 mx-1">
              <div className="bg-neutral-400 h-px"></div>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
