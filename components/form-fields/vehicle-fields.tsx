import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VehicleFieldsProps {
  control: Control<any>
}

const conditions = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
]

const transmissions = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "cvt", label: "CVT" },
  { value: "other", label: "Other" },
]

const fuelTypes = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
  { value: "other", label: "Other" },
]

export default function VehicleFields({ control }: VehicleFieldsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={control}
        name="make"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Make</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Toyota, Honda" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Camry, Civic" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1900}
                max={new Date().getFullYear() + 1}
                placeholder="e.g., 2020"
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
        name="mileage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mileage</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                placeholder="e.g., 50000"
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
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Condition</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
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
        name="transmission"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transmission</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {transmissions.map((transmission) => (
                  <SelectItem key={transmission.value} value={transmission.value}>
                    {transmission.label}
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
        name="fuel_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fuel Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {fuelTypes.map((fuel) => (
                  <SelectItem key={fuel.value} value={fuel.value}>
                    {fuel.label}
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
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Silver, Black" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="vin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>VIN (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Vehicle Identification Number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 