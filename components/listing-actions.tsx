"use client"

import { useState } from "react"
import { MoreHorizontal, Heart, Flag, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ListingActionsProps {
  listingId: string
}

export default function ListingActions({ listingId }: ListingActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite)

    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "This listing has been removed from your favorites."
        : "This listing has been added to your favorites.",
    })
  }

  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for reporting this listing.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would send this to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our platform safe. We'll review this listing.",
      })

      setIsReportDialogOpen(false)
      setReportReason("")
    } catch (error) {
      console.error("Error reporting listing:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="icon" onClick={toggleFavorite} className={isFavorite ? "text-red-500" : ""}>
        <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500" : ""}`} />
        <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={toggleFavorite} className="cursor-pointer">
            <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            <span>{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
          </DropdownMenuItem>

          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                <Flag className="mr-2 h-4 w-4" />
                <span>Report listing</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report this listing</DialogTitle>
                <DialogDescription>
                  Please tell us why you're reporting this listing. Your report will be reviewed by our team.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="Please describe why you're reporting this listing..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="min-h-32"
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReport} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-destructive cursor-pointer">
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

