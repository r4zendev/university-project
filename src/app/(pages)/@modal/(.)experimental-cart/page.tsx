"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogClose, DialogContent } from "~/components/ui/dialog";

export default function Profile() {
  const router = useRouter();

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogClose />
      <DialogContent>
        <p>Items</p>
      </DialogContent>
    </Dialog>
  );
}
