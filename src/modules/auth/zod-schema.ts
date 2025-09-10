import { z } from "zod";

export type SignInSchema = z.infer<typeof signInSchema>;
export const signInSchema = z.object({
  email: z.email("Alamat email tidak valid"),
  password: z.string().min(1, "Harap masukan password anda"),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
export const signUpSchema = z.object({
  email: z.email("Alamat email tidak valid"),
  password: z
    .string()
    .min(1, "Harap masukan password anda")
    .min(6, "Minimal 6 karakter")
    .regex(/[a-z]/, "Passwordd harus mengandung huruf kecil")
    .regex(/[A-Z]/, "Passwordd harus mengandung huruf besar")
    .regex(/[0-9]/, "Passwordd harus mengandung angka")
    .regex(/[^a-zA-Z0-9]/, "Passwordd harus mengandung simbol"),
  name: z
    .string()
    .min(1, "Harap masukan nama anda")
    .max(50, "Maksimal 50 karakter"),
  address: z
    .string()
    .min(1, "Harap masukan alamat anda")
    .max(150, "Maksimal 150 karakter"),
});
