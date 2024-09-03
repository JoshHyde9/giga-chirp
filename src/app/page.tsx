import { auth } from "@/auth";
import { SignOut } from "@/components/signout-button";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <div className="text-center">
        <h1 className="font-bold text-3xl mb-4">Hello World!</h1>
      </div>
      <pre>{JSON.stringify(session, null, 2)}</pre>

      {session && <SignOut />}
    </div>
  );
}
