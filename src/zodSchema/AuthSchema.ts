import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  mobileNo: z.string().min(3, "Mobile number is Required").regex(/^\d+$/, "Mobile number must contain only digits"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password is not match"),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
}) 

