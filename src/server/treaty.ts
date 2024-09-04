import { App } from "@/app/api/[[...route]]/route";
import { treaty } from "@elysiajs/eden";

export const { api } = treaty<App>("localhost:3000");