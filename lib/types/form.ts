import { z } from "zod"

// Form validation schema
export const formSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  description: z
    .string()
    .min(20, {
      message: "Description must be at least 20 characters.",
    })
    .max(2000, {
      message: "Description must not exceed 2000 characters.",
    }),
  price: z
    .union([z.number(), z.null()])
    .optional()
    .default(null),
  category_id: z.string({
    required_error: "Please select a category.",
  }),
  location: z.object({
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    state: z.string(),
  }, {
    required_error: "Please select a location.",
  }),
  contact_info: z.string().min(5, {
    message: "Contact information is required.",
  }),
  tags: z.array(z.string()).optional(),
})

export type FormValues = z.infer<typeof formSchema>

// Default values for the form
export const defaultValues = {
  title: "",
  description: "",
  price: null,
  category_id: "",
  location: {
    name: "",
    latitude: 0,
    longitude: 0,
    state: "",
  },
  contact_info: "",
  tags: [],
} as const satisfies Partial<FormValues> 