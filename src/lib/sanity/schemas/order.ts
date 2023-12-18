import { defineField, defineType } from "sanity";

export const orderSchema = defineType({
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    defineField({
      name: "content",
      title: "Order content",
      type: "markdown",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.email().required(),
    }),
    defineField({
      name: "address",
      title: "Shipping Address",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountPaid",
      title: "Amount paid",
      type: "number",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["pending", "shipped", "delivered", "cancelled"] },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
