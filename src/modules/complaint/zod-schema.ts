import z from "zod";

export type CreateComplaint = z.infer<typeof createComplaint>;
export const createComplaint = z.object({
  imageUrl: z.string().nullable(),
  title: z
    .string()
    .min(1, "Harap masukan judul")
    .max(60, "Maksimal 60 karakter"),
  content: z
    .string()
    .min(1, "Harap masukan konten aduan")
    .max(500, "Maksimal 500 karakter"),
  location: z
    .string()
    .min(1, "Harap masukan lokasi aduan")
    .max(100, "Maksimal 100 karakter"),
});
