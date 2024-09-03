"use client";

import type { App } from "@/app/api/[[...route]]/route";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { treaty } from "@elysiajs/eden";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { signInSchema } from "@/lib/schema";
import { authenticate } from "@/lib/action";
import { useState } from "react";

export const { api } = treaty<App>("localhost:3000");

export default function Register() {
  const [globalError, setGlobalError] = useState("");

  const signInUser = async (values: z.infer<typeof signInSchema>) => {
    const result = await authenticate(values);

    if (result?.error) {
      return Promise.reject(new Error("Invalid credentials"));
    }
  };

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signInUser,
    onError: (err) => {
      setGlobalError(err.message);
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    const parsedData = await signInSchema.parseAsync(values);
    mutate(parsedData);
  };

  return (
    <div>
      <div className="text-center">
        <h1 className="font-bold text-3xl mb-4">Sign In</h1>
      </div>

      <div className="mx-auto max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="usernameOrEmail"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Username Or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Jim" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p
              className={`${
                globalError ? "block" : "invisible"
              } h-4 mt-2 text-red-500`}
            >
              {globalError}
            </p>

            <Button type="submit" disabled={isPending} className="mt-4 w-full">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
