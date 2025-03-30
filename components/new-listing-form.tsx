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
import { supabase } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import ImageUploadZone from "@/components/image-upload-zone"
import TagInput from "@/components/tag-input"
import LocationField from "@/components/form-fields/location-field"
import type { Category, Location } from "@/lib/supabase/schema"
import { formSchema, type FormValues, defaultValues } from "@/lib/types/form"
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useFormPersistence("new-listing-form", form)

  const onSubmit = async (data: FormValues) => {
    if (images.length === 0) {
      setUploadError("Please upload at least one image")
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      const supabase = createClient()
      
      // First, create or get the location
      const { data: location, error: locationError } = await supabase
        .from("locations")
        .upsert({
          name: data.location.name,
          state: data.location.state,
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        })
        .select()
        .single()

      if (locationError) throw locationError

      // Create the listing
      const { data: listing, error: listingError } = await supabase
        .from("listings")
        .insert({
          title: data.title,
          description: data.description,
          price: data.price,
          category_id: data.category_id,
          user_id: userId,
          location_id: location.id,
          contact_info: data.contact_info,
          status: "active",
          tags: data.tags,
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
        description: "Listing created successfully!",
      })
      form.reset()
      router.push(`/listings/${listing.id}`)
      router.refresh()
    } catch (error: any) {
      console.error("Error creating listing:", error)
      setUploadError(error.message || "There was an error creating your listing")
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
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
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price (leave empty if not applicable)"
                          {...field}
                          value={value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value
                            onChange(val === "" ? null : Number(val))
                          }}
                        />
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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

                <LocationField control={form.control} setValue={form.setValue} disabled={isSubmitting} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Images</h3>
                  <p className="text-sm text-muted-foreground">Upload images of your item</p>
                </div>

                <ImageUploadZone
                  onFilesSelected={setImages}
                  maxFiles={5}
                  disabled={isSubmitting}
                  progress={uploadProgress}
                  error={uploadError}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Tags</h3>
                  <p className="text-sm text-muted-foreground">Add relevant tags to help buyers find your listing</p>
                </div>

                <TagInput
                  value={tags}
                  onChange={setTags}
                  maxTags={5}
                  placeholder="Type a tag and press Enter"
                  disabled={isSubmitting}
                />
              </div>
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
        </form>
      </Form>
    </motion.div>
  )
}

