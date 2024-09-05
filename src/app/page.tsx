import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
   <div>
      <h1>Yeet</h1>
   </div>
  );
}
