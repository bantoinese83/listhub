"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import ImageUploadZone from "@/components/image-upload-zone"
import TagInput from "@/components/tag-input"
import type { Category, Location } from "@/lib/supabase/schema"

// Form validation schema
const formSchema = z.object({
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
    .string()
    .optional()
    .transform((val) => (val === "" ? null : Number(val))),
  category_id: z.string({
    required_error: "Please select a category.",
  }),
  location_id: z.string({
    required_error: "Please select a location.",
  }),
  contact_info: z.string().min(5, {
    message: "Contact information is required.",
  }),
  tags: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

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

  // Add state for subcategories
  const [subcategories, setSubcategories] = useState<Category[]>([])
  const [selectedParentCategory, setSelectedParentCategory] = useState<string>("")

  // Add useEffect to fetch subcategories when parent category changes
  useEffect(() => {
    if (selectedParentCategory) {
      const fetchSubcategories = async () => {
        const filtered = categories.filter((cat) => cat.parent_id === selectedParentCategory)
        setSubcategories(filtered)
      }

      fetchSubcategories()
    } else {
      setSubcategories([])
    }
  }, [selectedParentCategory, categories])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category_id: "",
      location_id: "",
      contact_info: "",
      tags: [],
    },
  })

  const onSubmit = async (values: FormValues) => {
    if (images.length === 0) {
      setUploadError("Please upload at least one image")
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      // Create the listing
      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert({
          title: values.title,
          description: values.description,
          price: values.price,
          category_id: values.category_id,
          user_id: userId,
          location_id: values.location_id,
          contact_info: values.contact_info,
          status: "active",
          tags: tags, // Add tags to the listing
        })
        .select()
        .single()

      if (listingError) throw listingError

      // Upload images with progress tracking
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileExt = file.name.split(".").pop()
        const fileName = `${listing.id}/${i}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `listings/${fileName}`

        const { error: uploadError } = await supabase.storage.from("listing-images").upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: publicURL } = supabase.storage.from("listing-images").getPublicUrl(filePath)

        // Save image reference in database
        const { error: imageError } = await supabase.from("listing_images").insert({
          listing_id: listing.id,
          url: publicURL.publicUrl,
          position: i,
        })

        if (imageError) throw imageError

        // Update progress
        setUploadProgress(Math.round(((i + 1) / images.length) * 100))
      }

      toast({
        title: "Success",
        description: "Your listing has been created",
      })

      router.push(`/listings/${listing.id}`)
      router.refresh()
    } catch (error: any) {
      console.error("Error creating listing:", error)
      setUploadError(error.message || "There was an error creating your listing")
      toast({
        title: "Error",
        description: "There was an error creating your listing",
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a descriptive title" {...field} />
                    </FormControl>
                    <FormDescription>Make your title clear and attention-grabbing</FormDescription>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your item or service in detail"
                        className="min-h-32 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Include condition, features, and any other relevant details</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter price (leave empty if not applicable)" {...field} />
                      </FormControl>
                      <FormDescription>Enter a fair price or leave empty for "Contact for price"</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_info"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number or email for interested buyers" {...field} />
                      </FormControl>
                      <FormDescription>How should potential buyers contact you?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedParentCategory(value)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories
                            .filter((category) => !category.parent_id)
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the main category for your listing</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subcategory_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedParentCategory || subcategories.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedParentCategory
                                  ? "Select a category first"
                                  : subcategories.length === 0
                                    ? "No subcategories available"
                                    : "Select a subcategory"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose a more specific subcategory if applicable</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <TagInput
                  value={tags}
                  onChange={setTags}
                  placeholder="Add tags (press Enter after each tag)"
                  disabled={isSubmitting}
                  maxTags={10}
                />
                <FormDescription>
                  Add relevant tags to help buyers find your listing (e.g., brand, size, condition)
                </FormDescription>
              </FormItem>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <FormLabel>Images</FormLabel>
                <div className="mt-2">
                  <ImageUploadZone
                    images={images}
                    setImages={setImages}
                    disabled={isSubmitting}
                    error={uploadError}
                    onError={setUploadError}
                  />

                  {isSubmitting && uploadProgress > 0 && (
                    <div className="w-full mt-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Uploading images...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-32">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}

