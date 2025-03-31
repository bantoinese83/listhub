import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"

interface ServiceFieldsProps {
  control: Control<any>
}

const pricingTypes = [
  { value: "fixed", label: "Fixed Price" },
  { value: "hourly", label: "Hourly Rate" },
  { value: "custom", label: "Custom Pricing" },
]

const daysOfWeek = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
]

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return { value: `${hour}:00`, label: `${hour}:00` }
})

const commonCertifications = [
  { value: "licensed", label: "Licensed" },
  { value: "certified", label: "Certified" },
  { value: "bonded", label: "Bonded" },
  { value: "insured", label: "Insured" },
  { value: "background_check", label: "Background Check" },
  { value: "first_aid", label: "First Aid Certified" },
  { value: "cpr", label: "CPR Certified" },
  { value: "osha", label: "OSHA Certified" },
]

export default function ServiceFields({ control }: ServiceFieldsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={control}
        name="service_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Type</FormLabel>
            <FormControl>
              <Input placeholder="e.g., House Cleaning, Dog Walking" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="pricing_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pricing Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {pricingTypes.map((type) => (
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

      <div className="col-span-2">
        <FormField
          control={control}
          name="availability.days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Days</FormLabel>
              <FormControl>
                <MultiSelect
                  options={daysOfWeek}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Select available days"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="availability.hours.start"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Time</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
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
        name="availability.hours.end"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Time</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
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
        name="service_area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Area (Cities/Regions)</FormLabel>
            <FormControl>
              <MultiSelect
                options={[]} // This should be populated with actual service areas
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Enter service areas"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="experience_years"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Years of Experience</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                placeholder="e.g., 5"
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
        name="certifications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certifications & Qualifications</FormLabel>
            <FormControl>
              <MultiSelect
                options={commonCertifications}
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Select certifications"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 