"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import ImageUploadZone from "@/components/image-upload-zone"
import TagInput from "@/components/tag-input"
import LocationField from "@/components/form-fields/location-field"
import VehicleFields from "@/components/form-fields/vehicle-fields"
import HousingFields from "@/components/form-fields/housing-fields"
import JobFields from "@/components/form-fields/job-fields"
import ServiceFields from "@/components/form-fields/service-fields"
import type { Category, Location } from "@/lib/supabase/schema"
import { getCategorySchema, getCategoryDefaultValues } from "@/lib/types/category-forms"
import { useFormPersistence } from "@/lib/hooks/use-form-persistence"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface NewListingFormProps {
  categories: Category[]
  locations: Location[]
  userId: string
}

export default function NewListingForm({ categories, locations, userId }: NewListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Get the selected category's slug
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("")

  // Get the appropriate schema and default values based on the selected category
  const schema = getCategorySchema(selectedCategorySlug)
  const defaultValues = getCategoryDefaultValues(selectedCategorySlug)

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      tags: [],
    },
  })

  // Persist form data
  useFormPersistence(form, "new-listing-form")

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    setSelectedCategorySlug(category.slug)
    const newDefaultValues = getCategoryDefaultValues(category.slug)
    
    // Reset form with new default values while preserving category_id and tags
    form.reset({
      ...newDefaultValues,
      category_id: categoryId,
      tags: form.getValues("tags") || [],
    })
  }

  // Render category-specific fields
  const renderCategoryFields = () => {
    if (!selectedCategorySlug) return null

    if (selectedCategorySlug.includes("vehicles")) {
      return (
        <Card>
          <CardContent className="pt-6">
            <VehicleFields control={form.control} />
          </CardContent>
        </Card>
      )
    }

    if (selectedCategorySlug.includes("housing") || selectedCategorySlug.includes("rentals")) {
      return (
        <Card>
          <CardContent className="pt-6">
            <HousingFields control={form.control} />
          </CardContent>
        </Card>
      )
    }

    if (selectedCategorySlug.includes("jobs") || selectedCategorySlug.includes("gigs")) {
      return (
        <Card>
          <CardContent className="pt-6">
            <JobFields control={form.control} />
          </CardContent>
        </Card>
      )
    }

    if (selectedCategorySlug.includes("services")) {
      return (
        <Card>
          <CardContent className="pt-6">
            <ServiceFields control={form.control} />
          </CardContent>
        </Card>
      )
    }

    return null
  }

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)

      // 1. Create the base listing
      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert({
          title: data.title,
          description: data.description,
          price: data.price,
          category_id: data.category_id,
          user_id: userId,
          location_id: data.location.id,
          contact_info: data.contact_info,
          status: "pending",
          views: 0,
          is_featured: false,
          tags: data.tags || [],
        })
        .select()
        .single()

      if (listingError) throw listingError

      // 2. Create listing details based on category
      const listingDetails: any = {
        listing_id: listing.id,
      }

      // Add category-specific fields
      if (selectedCategorySlug?.includes("vehicles")) {
        listingDetails.make = data.make
        listingDetails.model = data.model
        listingDetails.year = data.year
        listingDetails.mileage = data.mileage
        listingDetails.condition = data.condition
        listingDetails.transmission = data.transmission
        listingDetails.fuel_type = data.fuel_type
        listingDetails.color = data.color
        listingDetails.vin = data.vin
      } else if (selectedCategorySlug?.includes("housing") || selectedCategorySlug?.includes("rentals")) {
        listingDetails.property_type = data.property_type
        listingDetails.bedrooms = data.bedrooms
        listingDetails.bathrooms = data.bathrooms
        listingDetails.square_feet = data.square_feet
        listingDetails.furnished = data.furnished
        listingDetails.available_date = data.available_date
        listingDetails.lease_term = data.lease_term
        listingDetails.amenities = data.amenities
      } else if (selectedCategorySlug?.includes("jobs") || selectedCategorySlug?.includes("gigs")) {
        listingDetails.employment_type = data.employment_type
        listingDetails.experience_level = data.experience_level
        listingDetails.salary_range = data.salary_range
        listingDetails.remote_work = data.remote_work
        listingDetails.required_skills = data.required_skills
        listingDetails.benefits = data.benefits
      } else if (selectedCategorySlug?.includes("services")) {
        listingDetails.service_type = data.service_type
        listingDetails.availability = data.availability
        listingDetails.service_area = data.service_area
        listingDetails.pricing_type = data.pricing_type
        listingDetails.experience_years = data.experience_years
        listingDetails.certifications = data.certifications
      }

      const { error: detailsError } = await supabase
        .from("listing_details")
        .insert(listingDetails)

      if (detailsError) throw detailsError

      // 3. Upload images if any
      if (data.images?.length > 0) {
        const imagePromises = data.images.map(async (file: File, index: number) => {
          const fileExt = file.name.split(".").pop()
          const fileName = `${listing.id}/${index}.${fileExt}`
          const filePath = `listings/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from("listings")
            .upload(filePath, file)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from("listings")
            .getPublicUrl(filePath)

          return {
            listing_id: listing.id,
            url: publicUrl,
            position: index,
          }
        })

        const images = await Promise.all(imagePromises)

        const { error: imageError } = await supabase
          .from("listing_images")
          .insert(images)

        if (imageError) throw imageError
      }

      // 4. Create or update tags
      if (data.tags?.length > 0) {
        const tagPromises = data.tags.map(async (tagName: string) => {
          const slug = tagName.toLowerCase().replace(/\s+/g, "-")
          
          // Check if tag exists
          const { data: existingTag } = await supabase
            .from("tags")
            .select()
            .eq("slug", slug)
            .single()

          if (!existingTag) {
            // Create new tag
            const { data: newTag, error: tagError } = await supabase
              .from("tags")
              .insert({
                name: tagName,
                slug,
              })
              .select()
              .single()

            if (tagError) throw tagError
            return newTag
          }

          return existingTag
        })

        await Promise.all(tagPromises)
      }

      toast({
        title: "Success!",
        description: "Your listing has been created successfully.",
      })

      // Clear form data from localStorage
      localStorage.removeItem("new-listing-form")

      // Redirect to the listing page
      router.push(`/listings/${listing.id}`)
    } catch (error) {
      console.error("Error creating listing:", error)
      toast({
        title: "Error",
        description: "There was an error creating your listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleCategoryChange(value)
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the category for your listing</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {selectedCategorySlug && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a descriptive title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Make your title clear and specific to attract potential buyers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide detailed information about your listing"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include key details, features, and any relevant information.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            placeholder="Enter price"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the price in your local currency.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <LocationField control={form.control} setValue={form.setValue} disabled={isSubmitting} />
                  </div>
                </CardContent>
              </Card>

              {renderCategoryFields()}

              <Card>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                          <ImageUploadZone
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload up to 10 images. The first image will be your main listing photo.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Add relevant tags to help buyers find your listing.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="contact_info"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Information</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your preferred contact method and details"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Specify how buyers can contact you (phone, email, etc.).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating listing...
                    </>
                  ) : (
                    "Create listing"
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </motion.div>
  )
}

