"use client";

import { useState } from "react";

import { sendNewsletter } from "~/actions/send-emails";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";
import { type Email } from "~/lib/sanity/types";

export const SendEmail = ({ options }: { options: Email[] }) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedId} onValueChange={setSelectedId}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Templates</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option._id} value={option._id}>
                {option.subject}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        onClick={async () => {
          const selectedTemplate = options.find((option) => option._id === selectedId);
          if (!selectedTemplate) return;

          try {
            await sendNewsletter({
              ...selectedTemplate,
              host: window.location.host,
            });
          } catch (err) {
            if ((err as Error).message.includes("domain is not verified")) {
              toast({
                title: "Error",
                description: "Please verify your domain in Resend settings",
                variant: "destructive",
              });
              return;
            }

            toast({
              title: "Error",
              description: (err as Error).message,
              variant: "destructive",
            });
          }
        }}
      >
        Send newsletter
      </Button>
    </div>
  );
};
