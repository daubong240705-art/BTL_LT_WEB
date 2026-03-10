import z from "zod";

//schema
export const movieSchema = z
    .object({
        title: z
            .string()
            .min(1, "Tiêu đề không được để trống")
            .max(255, "Tiêu đề quá dài"),

        slug: z
            .string()
            .min(1, "Slug không được để trống")
            .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu -"),

        description: z
            .string()
            .min(1, "Mô tả không được để trống"),

        type: z.enum(["SINGLE", "SERIES"], {
            message: "Type không hợp lệ",
        }),

        status: z.enum(["ONGOING", "COMPLETED"], {
            message: "Status không hợp lệ",
        }),

        posterUrl: z
            .string()
            .url("Poster phải là URL hợp lệ")
            .optional()
            .or(z.literal("")),

        thumbUrl: z
            .string()
            .url("Thumbnail phải là URL hợp lệ")
            .optional()
            .or(z.literal("")),

        publishYear: z.coerce
            .number<number>()
            .int("Năm phải là số nguyên")
            .min(1900, "Năm không hợp lệ")
            .max(new Date().getFullYear(), "Năm không hợp lệ"),

        categoryIds: z
            .array(z.number().int().positive())
            .min(1, "Phải chọn ít nhất 1 thể loại"),
    })



export const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Tên không được để trống")
        .max(255, "Tên quá dài"),

    slug: z
        .string()
        .min(1, "Slug không được để trống")
        .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu -"),
})




export const userSchema = z
    .object({
        fullName: z.string().min(2, "Tên tối thiểu 2 ký tự"),
        username: z.string().min(3, "Username tối thiểu 3 ký tự"),
        email: z.string().email("Email không hợp lệ"),
        role: z.enum(["ADMIN", "USER"]),

        password: z
            .string()
            .min(6, "Mật khẩu tối thiểu 6 ký tự")
            .optional()
            .or(z.literal("")),

        confirmPassword: z
            .string()
            .optional()
            .or(z.literal("")),
    })
    .superRefine((data, ctx) => {
        if (data.password && data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Mật khẩu không khớp",
            });
        }
    });


export const episodeSchema = z.object({
    name: z.string().min(1, "Tieu de khong duoc de trong").max(255, "Tieu de qua dai"),
    slug: z
        .string()
        .min(1, "Slug khong duoc de trong")
        .regex(/^[a-z0-9-]+$/, "Slug chi gom chu thuong, so va dau -"),
    videoUrl: z.string(),
    episodeOrder: z.coerce.number<number>().int("Thu tu phai la so nguyen").min(1, "Thu tu phai >= 1"),
    movieId: z.number().optional()
});

export type MovieFormValues = z.infer<typeof movieSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type UserFormValues = z.infer<typeof userSchema>;
export type EpisodeFormValues = z.infer<typeof episodeSchema>;


//payload

export type MoviePayload = {
    title: string;
    slug: string;
    description: string;
    type: MovieType;
    status: MovieStatus;
    posterUrl?: string;
    thumbUrl?: string;
    publishYear: number;
    categoryIds: number[];
};

export type EpisodePayload = {
    movieId?: number;
    name: string;
    slug: string;
    videoUrl: string;
    episodeOrder: number;
};


export type CategoryPayload = {
    name: string;
    slug: string;
};


export type UserPayload = {
    fullName: string;
    username: string;
    email: string;
    role: Role;
    password?: string;
    avatarUrl?: string;
};

export type UserSubmitValues = UserPayload & { confirmPassword?: string };