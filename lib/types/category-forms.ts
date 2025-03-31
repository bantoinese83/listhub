import { z } from "zod"

// Base schema that all category forms will extend
const baseSchema = z.object({
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

// Vehicle-specific schema
const vehicleSchema = baseSchema.extend({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0).optional(),
  condition: z.enum(["new", "like_new", "good", "fair", "poor"]),
  transmission: z.enum(["automatic", "manual", "cvt", "other"]),
  fuel_type: z.enum(["gasoline", "diesel", "electric", "hybrid", "other"]),
  color: z.string().optional(),
  vin: z.string().optional(),
})

// Housing-specific schema
const housingSchema = baseSchema.extend({
  property_type: z.enum(["house", "apartment", "condo", "townhouse", "land", "other"]),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  square_feet: z.number().min(0).optional(),
  furnished: z.boolean().optional(),
  available_date: z.date().optional(),
  lease_term: z.enum(["monthly", "yearly", "short_term"]).optional(),
  amenities: z.array(z.string()).optional(),
})

// Job-specific schema
const jobSchema = baseSchema.extend({
  employment_type: z.enum(["full_time", "part_time", "contract", "temporary", "internship"]),
  experience_level: z.enum(["entry", "mid", "senior", "lead", "executive"]),
  salary_range: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  remote_work: z.boolean().optional(),
  required_skills: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
})

// Service-specific schema
const serviceSchema = baseSchema.extend({
  service_type: z.string().min(1, "Service type is required"),
  availability: z.object({
    days: z.array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])),
    hours: z.object({
      start: z.string(),
      end: z.string(),
    }),
  }),
  service_area: z.array(z.string()).optional(),
  pricing_type: z.enum(["fixed", "hourly", "custom"]),
  experience_years: z.number().min(0).optional(),
  certifications: z.array(z.string()).optional(),
})

// Map of category slugs to their specific schemas
export const categorySchemas: Record<string, z.ZodType<any>> = {
  // Vehicles
  "cars-trucks": vehicleSchema,
  "motorcycles": vehicleSchema,
  "boats": vehicleSchema,
  "rvs-campers": vehicleSchema,
  "powersports": vehicleSchema,
  "trailers": vehicleSchema,
  "aviation": vehicleSchema,

  // Housing
  "apartments-housing-for-rent": housingSchema,
  "rooms-shared-living": housingSchema,
  "sublets-temporary-housing": housingSchema,
  "vacation-rentals": housingSchema,
  "real-estate-for-sale": housingSchema,

  // Jobs
  "full-time-part-time": jobSchema,
  "short-term-gigs": jobSchema,
  "seeking-work": jobSchema,

  // Services
  "automotive-repair-services": serviceSchema,
  "cycle-repair-services": serviceSchema,
  "marine-services": serviceSchema,
  "skilled-trades": serviceSchema,
  "household-services": serviceSchema,
  "moving-labor": serviceSchema,
  "farm-garden-services": serviceSchema,
  "beauty-services": serviceSchema,
  "health-wellness": serviceSchema,
  "lessons-tutoring": serviceSchema,
  "pet-services": serviceSchema,
  "childcare": serviceSchema,
  "computer-tech-support": serviceSchema,
  "creative-services": serviceSchema,
  "event-services": serviceSchema,
  "financial-services": serviceSchema,
  "legal-services": serviceSchema,
  "real-estate-services": serviceSchema,
  "small-business-advertising": serviceSchema,
  "writing-editing-translation": serviceSchema,
  "travel-vacation-services": serviceSchema,
}

// Helper function to get the appropriate schema for a category
export function getCategorySchema(categorySlug: string) {
  return categorySchemas[categorySlug] || baseSchema
}

// Helper function to get default values for a category
export function getCategoryDefaultValues(categorySlug: string) {
  const schema = getCategorySchema(categorySlug)
  const baseDefaults = {
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
  }

  // Add category-specific default values
  if (categorySlug.includes("services")) {
    return {
      ...baseDefaults,
      service_type: "",
      availability: {
        days: [],
        hours: {
          start: "",
          end: "",
        },
      },
      service_area: [],
      pricing_type: "fixed",
      experience_years: 0,
      certifications: [],
    }
  }

  if (categorySlug.includes("vehicles")) {
    return {
      ...baseDefaults,
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: 0,
      condition: "good",
      transmission: "automatic",
      fuel_type: "gasoline",
      color: "",
      vin: "",
    }
  }

  if (categorySlug.includes("housing") || categorySlug.includes("rentals")) {
    return {
      ...baseDefaults,
      property_type: "house",
      bedrooms: 0,
      bathrooms: 0,
      square_feet: 0,
      furnished: false,
      available_date: new Date(),
      lease_term: "monthly",
      amenities: [],
    }
  }

  if (categorySlug.includes("jobs") || categorySlug.includes("gigs")) {
    return {
      ...baseDefaults,
      employment_type: "full_time",
      experience_level: "entry",
      salary_range: {
        min: 0,
        max: 0,
      },
      remote_work: false,
      required_skills: [],
      benefits: [],
    }
  }

  return baseDefaults
} 