import { signOut } from "@/auth";

import { Button } from "../ui/button";

export const SignOut = ({username}: {username: string}) => {
    return (
        <form action={async () => {
            "use server"
            await signOut();
        }}>
            <Button type="submit" className="w-full font-semibold">Sign out @{username}</Button>
        </form>
    )
}