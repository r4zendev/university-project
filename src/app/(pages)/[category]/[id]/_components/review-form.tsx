"use client";

import { useUser } from "@clerk/nextjs";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Star } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type Input as Infer } from "valibot";

import { createReview } from "~/actions/review";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { useDisclosure } from "~/lib/hooks/use-disclosure";
import { cn } from "~/lib/utils";
import { ReviewFormSchema } from "~/lib/utils/form-validators/review";

export const ReviewForm = ({ id }: { id: string }) => {
  const { user, isSignedIn } = useUser();
  const form = useForm<Infer<typeof ReviewFormSchema>>({
    resolver: valibotResolver(ReviewFormSchema),
    defaultValues: {
      content: "",
      email: "",
      rating: 0,
      title: "",
    },
    // progressive
  });
  const { toast } = useToast();
  const { isOpen, onClose, onToggle } = useDisclosure();

  useEffect(() => {
    if (isSignedIn) {
      form.setValue("username", user?.firstName ?? "");
      form.setValue("email", user?.primaryEmailAddress?.emailAddress ?? "");
    }
  }, [user, isSignedIn, form]);

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<Infer<typeof ReviewFormSchema>> = async (data, e) => {
    e?.preventDefault();

    try {
      await createReview({ id, username: user?.username ?? undefined, ...data });
      toast({
        title: "Review has been submitted!",
        variant: "success",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    }

    return Promise.resolve();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>
        <Button className="text-md" variant="secondary">
          Write a review
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form
            // action={(formData) => {
            //   console.log(formData);
            // }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex items-center justify-between gap-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter a title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Your rating</FormLabel>
                    <FormControl>
                      <ul className="my-1 flex list-none gap-1 p-0">
                        <input hidden {...field} />
                        <div className="flex flex-row-reverse justify-center p-10">
                          {Array.from(Array(5)).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "peer h-6 w-6 cursor-pointer hover:fill-yellow-500 hover:text-yellow-500 peer-hover:fill-yellow-500 peer-hover:text-yellow-500",
                                field.value >= 5 - i &&
                                  "fill-yellow-500 text-yellow-500"
                              )}
                              onClick={() => form.setValue("rating", 5 - i)}
                            />
                          ))}
                        </div>
                      </ul>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your email" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Review</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Write your review here..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                isLoading={isSubmitting}
              >
                Submit review
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
