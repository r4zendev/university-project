// import { clerkClient } from "@clerk/nextjs";
// import { render } from "@react-email/components";
// import sendgrid from "@sendgrid/mail";
// import { type NextRequest } from "next/server";
// import { is, object, string } from "valibot";

// CALL IT LIKE THIS:
// // if (!subject || !body) {
// //   return toast({
// //     title: "Please enter your email",
// //     variant: "destructive",
// //   });
// // }

// // const res = await fetch("/api/send-newsletter", {
// //   method: "POST",
// //   body: JSON.stringify({
// //     subject: "Hello there",
// //     body: "Get a newsletter :)",
// //   }),
// // });

// // if (res.status >= 400) {
// //   return toast({
// //     title: "Oh no!",
// //     description:
// //       "There was an error sending the newsletter. Please try again later.",
// //     variant: "destructive",
// //   });
// // }

// // if (res.status === 200) {
// //   return toast({
// //     title: "Newsletter sent!",
// //     variant: "success",
// //   });
// // }

// export const sendEmailSchema = object({
//   subject: string(),
//   body: string(),
// });

// sendgrid.setApiKey(ENV.sendgrid.apiKey);

// export async function POST(req: NextRequest) {
//   try {
//     const reqBody = await req.json();

//     if (!is(sendEmailSchema, reqBody)) {
//       return new Response("No subject or body", { status: 400 });
//     }

//     const { subject, body } = reqBody;
//     let page = 0;

//     while (true) {
//       page += 1;

//       const users = await clerkClient.users.getUserList({
//         limit: 100,
//         offset: (page - 1) * 100,
//       });

//       if (users.length === 0) {
//         break;
//       }

//       await Promise.allSettled(
//         users.map(async (user) => {
//           if (!user.privateMetadata.newsletter || !user.primaryEmailAddressId) {
//             return Promise.resolve();
//           }

//           return sendgrid.send({
//             from: req.headers.get("host") ?? "jewellery.dev",
//             to: user.emailAddresses[0].emailAddress,
//             subject,
//             html: render(EmailTemplate({ content: body })),
//           });
//         })
//       );
//     }

//     return new Response("Email sent", { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response((err as Error).message, { status: 500 });
//   }
// }
