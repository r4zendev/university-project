"use server";

import { clerkClient } from "@clerk/nextjs";

export const subscribeToNewsLetter = async (email: string) => {
  const users = await clerkClient.users.getUserList({ emailAddress: [email] });

  if (users.length === 0) {
    try {
      const user = await clerkClient.users.createUser({
        emailAddress: [email],
        skipPasswordRequirement: true,
        firstName: "Newsletter",
        lastName: "Subscriber",
        privateMetadata: {
          newsletter: true,
        },
      });

      console.log(user);

      return { message: "OK" as const };
    } catch (err) {
      console.dir(err, { depth: 100 });
    }
  }

  const result = await Promise.allSettled(
    users.map(async (user) => {
      if (user.privateMetadata.newsletter) {
        return { message: "ALREADY_SUBBED" as const };
      }

      await clerkClient.users.updateUser(user.id, {
        privateMetadata: {
          newsletter: true,
        },
      });

      return { message: "OK" as const };
    })
  );

  const isAlreadySubbed = result.some((subResult) => {
    console.log(subResult);
    return (
      subResult.status === "fulfilled" && subResult.value.message === "ALREADY_SUBBED"
    );
  });

  if (isAlreadySubbed) {
    return { message: "ALREADY_SUBBED" as const };
  }

  return { message: "OK" as const };
};
