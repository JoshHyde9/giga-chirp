"use server";

import { revalidatePath } from "next/cache";


export const revalidatePage = () => {
    revalidatePath("/(home)/[username]/status/[postId]", "page");
}