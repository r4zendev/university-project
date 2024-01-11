import { currentUser } from "@clerk/nextjs";

import { ContactForm } from "./_components/contact-form";

export default async function ContactUs() {
  const user = await currentUser();

  return (
    <div className="py-2 lg:container">
      <ContactForm
        name={(user?.firstName ?? "") + " " + (user?.lastName ?? "")}
        email={user?.emailAddresses.at(0)?.emailAddress ?? ""}
        phone={user?.phoneNumbers.at(0)?.phoneNumber ?? ""}
      />
    </div>
  );
}
