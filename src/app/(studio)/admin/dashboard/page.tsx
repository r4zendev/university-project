import { getEmails } from "~/lib/sanity/queries";
import { SendEmail } from "./_components/send-email";

export default async function AdminDashboard() {
  const emailOptions = await getEmails();

  return (
    <div className="text-secondary-foreground">
      <h2 className="font-semibold">Send newsletter</h2>
      <SendEmail options={emailOptions} />
    </div>
  );
}
