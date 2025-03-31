import { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Switch } from "@/components/ui/switch"

interface JobFieldsProps {
  control: Control<any>
}

const employmentTypes = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "internship", label: "Internship" },
]

const experienceLevels = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
]

const commonSkills = [
  { value: "communication", label: "Communication" },
  { value: "leadership", label: "Leadership" },
  { value: "problem_solving", label: "Problem Solving" },
  { value: "teamwork", label: "Teamwork" },
  { value: "project_management", label: "Project Management" },
  { value: "technical", label: "Technical Skills" },
  { value: "analytical", label: "Analytical" },
  { value: "creative", label: "Creative" },
  { value: "customer_service", label: "Customer Service" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "legal", label: "Legal" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
]

const commonBenefits = [
  { value: "health_insurance", label: "Health Insurance" },
  { value: "dental_insurance", label: "Dental Insurance" },
  { value: "vision_insurance", label: "Vision Insurance" },
  { value: "life_insurance", label: "Life Insurance" },
  { value: "401k", label: "401(k)" },
  { value: "paid_vacation", label: "Paid Vacation" },
  { value: "paid_sick_leave", label: "Paid Sick Leave" },
  { value: "flexible_hours", label: "Flexible Hours" },
  { value: "remote_work", label: "Remote Work" },
  { value: "professional_development", label: "Professional Development" },
  { value: "gym_membership", label: "Gym Membership" },
  { value: "commuter_benefits", label: "Commuter Benefits" },
  { value: "employee_discounts", label: "Employee Discounts" },
  { value: "bonus", label: "Bonus" },
  { value: "stock_options", label: "Stock Options" },
]

export default function JobFields({ control }: JobFieldsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={control}
        name="employment_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employment Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {employmentTypes.map((type) => (
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
        name="experience_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience Level</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
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
          name="salary_range.min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Salary</FormLabel>
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
      </div>

      <div className="col-span-2">
        <FormField
          control={control}
          name="salary_range.max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Salary</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g., 100000"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="remote_work"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Remote Work Available</FormLabel>
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

      <div className="col-span-2">
        <FormField
          control={control}
          name="required_skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Skills</FormLabel>
              <FormControl>
                <MultiSelect
                  options={commonSkills}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Select required skills"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-2">
        <FormField
          control={control}
          name="benefits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefits</FormLabel>
              <FormControl>
                <MultiSelect
                  options={commonBenefits}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Select benefits"
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