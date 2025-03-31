import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Switch } from "@/components/ui/switch"

interface HousingFieldsProps {
  control: Control<any>
}

const propertyTypes = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land" },
  { value: "other", label: "Other" },
]

const leaseTerms = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "short_term", label: "Short Term" },
]

const commonAmenities = [
  { value: "parking", label: "Parking" },
  { value: "elevator", label: "Elevator" },
  { value: "gym", label: "Gym" },
  { value: "pool", label: "Pool" },
  { value: "laundry", label: "Laundry" },
  { value: "dishwasher", label: "Dishwasher" },
  { value: "ac", label: "Air Conditioning" },
  { value: "heating", label: "Heating" },
  { value: "furnished", label: "Furnished" },
  { value: "pets_allowed", label: "Pets Allowed" },
  { value: "wheelchair_accessible", label: "Wheelchair Accessible" },
  { value: "security", label: "Security System" },
  { value: "storage", label: "Storage" },
  { value: "balcony", label: "Balcony" },
  { value: "garage", label: "Garage" },
]

export default function HousingFields({ control }: HousingFieldsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={control}
        name="property_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bedrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bedrooms</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                placeholder="e.g., 3"
                value={field.value || ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bathrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bathrooms</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                step={0.5}
                placeholder="e.g., 2"
                value={field.value || ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="square_feet"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Square Feet</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                placeholder="e.g., 1500"
                value={field.value || ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="furnished"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Furnished</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="available_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Available Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ""}
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="lease_term"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lease Term</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select lease term" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {leaseTerms.map((term) => (
                  <SelectItem key={term.value} value={term.value}>
                    {term.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="col-span-2">
        <FormField
          control={control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <FormControl>
                <MultiSelect
                  options={commonAmenities}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Select amenities"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
} 