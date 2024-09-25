"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSession } from "next-auth/react";

import { api } from "@/server/treaty";

import { editUserSchema } from "@/lib/schema";
import { revalidatePage } from "@/lib/revalidatePath";

import { FileUpload } from "@/components/file-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type EditProfileDialog = {
  user: {
    id: string;
    name: string;
    bio: string | null;
    imageUrl: string;
    bannerUrl: string;
  };
};

export const EditProfileDialog: React.FC<EditProfileDialog> = ({ user }) => {
  const { update } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio || "",
      bannerUrl: user.bannerUrl,
      imageUrl: user.imageUrl,
    },
  });

  const editUser = async (values: z.infer<typeof editUserSchema>) => {
    const { data, error } = await api.users.edit.put(values);

    if (error) throw error;

    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: editUser,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: async () => {
      setIsOpen(false);
      await update({ user: { image_url: form.getValues("imageUrl") } });
      revalidatePage();
    },
  });

  const onSubmit = async (values: z.infer<typeof editUserSchema>) => {
    const parsedData = await editUserSchema.parseAsync(values);
    mutate(parsedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your user display info</DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image (optional)</FormLabel>
                    <FormControl className="flex justify-center">
                      <FileUpload
                        size="icon"
                        endpoint="userImage"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image (optional)</FormLabel>
                    <FormControl>
                      <FileUpload
                        size="small"
                        endpoint="userBannerImage"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end w-full">
                <Button type="submit" className="ml-auto" disabled={isPending}>
                  Confirm
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
