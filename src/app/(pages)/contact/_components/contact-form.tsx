"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { contactAdministration } from "~/actions/contact-us";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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

const ZodContactForm = z.object({
  name: z.string().min(3, "Please enter a valid name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string(),
  subject: z.string().min(3, "Please enter a valid subject"),
  message: z.string().min(20, "Please enter a valid message"),
  terms: z.boolean().refine((v) => v, "Please accept the terms and conditions"),
  consent: z.boolean().refine((v) => v, "Please accept the consent"),
});

export const ContactForm = ({
  name,
  email,
  phone,
}: {
  name?: string;
  email?: string;
  phone?: string;
}) => {
  const form = useForm({
    defaultValues: {
      name: name?.trim() ? name : "",
      email: email ?? "",
      phone: phone ?? "",
      subject: "",
      message: "",
      terms: false,
      consent: false,
    },
    resolver: zodResolver(ZodContactForm),
  });
  const { toast } = useToast();

  const onSubmit: SubmitHandler<z.infer<typeof ZodContactForm>> = async (data) => {
    await contactAdministration({ ...data, host: window.location.host });

    toast({
      title: "Success!",
      description: "Your message has been sent successfully.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Contact Us</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please fill out the form below and we&apos;ll get back to you as soon as
          possible.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Subject</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Message</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter your message" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    {...field}
                    value={undefined}
                    checked={!!field.value}
                    onCheckedChange={(state) =>
                      state !== "indeterminate" && field.onChange(state)
                    }
                  />
                </FormControl>
                <FormLabel required>
                  By sending this form you accept to our Terms and Conditions.
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    {...field}
                    value={undefined}
                    checked={!!field.value}
                    onCheckedChange={(state) =>
                      state !== "indeterminate" && field.onChange(state)
                    }
                  />
                </FormControl>
                <FormLabel required className="gap-0">
                  I agree to send my personal data for processing
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By submitting this form, you agree to our data privacy policy. Your
              information will be used in accordance with our privacy policy.
            </p>
          </div>

          <Button
            isLoading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
