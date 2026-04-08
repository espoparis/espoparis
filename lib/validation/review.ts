import { z } from "zod";

export const reviewSchema = z.object({
  locale: z.string().min(2),
  courseId: z.string().uuid(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
});
