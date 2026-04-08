import { z } from "zod";

export const contactInquirySchema = z.object({
  locale: z.string().min(2),
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  reason: z.enum(["general", "admissions", "partnerships", "visit"]),
  subject: z.string().trim().min(4, "Please add a short subject."),
  message: z.string().trim().min(20, "Please share a little more detail."),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
