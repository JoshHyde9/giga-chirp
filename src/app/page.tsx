import { SignIn } from "@/components/sign-in";

export default function Home() {
  return (
    <div>
      <div className="text-center">
        <h1 className="font-bold text-3xl mb-4">Sign In</h1>
      </div>

      <SignIn />
    </div>
  );
}
