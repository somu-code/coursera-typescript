import z, { number } from "zod";

export const signupSchema = z.object({
  email: z
    .string()
    .email("This is not a valid email.")
    .includes("@")
    .min(3, "Email must be at least 3 characters long.")
    .max(254, "Email must be no longer than 254 characters."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(254, "Title must be no longer than 254 characters long."),
  description: z.string(),
  published: z.boolean(),
  imageUrl: z.string(),
  price: z.number(),
});

export const courseSchemaWithAdminId = createCourseSchema.extend({
  adminId: z.number().min(1),
});

export const courseFromDBScheam = courseSchemaWithAdminId.extend({
  id: number().min(1),
});

export const purchaseCourseSchema = z.object({
  courseId: z.number().min(1, "CourseId can't be less than 1"),
});

export const courseIdSchema = z.object({
  courseId: z.number().min(1, "CourseId can't be less than 1"),
});
