import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import "~/styles/globals.css";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    return redirect("/login");
  }

  return { children };
}
