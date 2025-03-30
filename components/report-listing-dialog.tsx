"use client"

import type React from "react"

import { useState } from "react"
import { Flag, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { reportListing, ReportReason } from "@/lib/verification/reporting-service"

interface ReportListingDialogProps {
  listingId: string
  userId: string
  listingTitle: string
  trigger?: React.ReactNode
}

export default function ReportListingDialog({ listingId, userId, listingTitle, trigger }: ReportListingDialogProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason>(ReportReason.SCAM)
  const [details, setDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: "Please select a reason",
        description: "You must select a reason for reporting this listing",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await reportListing(listingId, userId, reason, details)

      if (result.success) {
        toast({
          title: "Report submitted",
          description: "Thank you for helping keep our platform safe",
        })
        setIsOpen(false)
        setReason(ReportReason.SCAM)
        setDetails("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit report",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error reporting listing:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Flag className="mr-2 h-4 w-4" />
            Report Listing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Listing</DialogTitle>
          <DialogDescription>
            Report this listing if you believe it violates our policies or is fraudulent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Listing</Label>
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">{listingTitle}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for reporting</Label>
            <RadioGroup value={reason} onValueChange={(value) => setReason(value as ReportReason)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.SCAM} id="scam" />
                <Label htmlFor="scam">Scam or fraudulent listing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.PROHIBITED_ITEM} id="prohibited" />
                <Label htmlFor="prohibited">Prohibited item or service</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.MISLEADING} id="misleading" />
                <Label htmlFor="misleading">Misleading information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.OFFENSIVE} id="offensive" />
                <Label htmlFor="offensive">Offensive content</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.DUPLICATE} id="duplicate" />
                <Label htmlFor="duplicate">Duplicate listing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.OTHER} id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Additional details</Label>
            <Textarea
              id="details"
              placeholder="Please provide any additional information that might help us investigate"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/50 p-3 text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
            <div className="text-sm">
              <p>
                False reports may result in account restrictions. Please only report listings that violate our policies.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

