"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Ticket, Send, User, Mail, MessageSquare, Clock, CheckCircle, X, Smile, InfoIcon } from "lucide-react"
import { submitHelpSupport } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Help() {
  const { toast } = useToast()
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  // State for controlling the visibility of the feedback banner
  const [showFeedbackBanner, setShowFeedbackBanner] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const userRaw = localStorage.getItem("user")
      if (!userRaw) {
        toast({ title: "Not logged in", description: "Please log in to submit a ticket.", variant: "destructive" })
        setIsSubmitting(false)
        return
      }
      const user = JSON.parse(userRaw) as { id: string; email: string; fullName: string }

      await submitHelpSupport({
        fullName: user.fullName,
        email: user.email,
        userId: user.id,
        subject,
        category,
        description,
      })

      toast({
        title: "Ticket Submitted",
        description: "Your support ticket has been submitted successfully.",
      })
      setSuccessOpen(true)
      setSubject("")
      setCategory("")
      setDescription("")
    } catch (err) {
      toast({ title: "Submission failed", description: "Please try again later.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if all required fields are filled
  const isFormValid = subject.trim() !== "" && category.trim() !== "" && description.trim() !== "";

  // Mock data for existing tickets
  const tickets = [
    {
      id: "TKT-001",
      subject: "API Key Not Working",
      status: "Open",
      date: "2023-06-15",
      priority: "High"
    },
    {
      id: "TKT-002",
      subject: "Extension Installation Issue",
      status: "In Progress",
      date: "2023-06-10",
      priority: "Medium"
    },
    {
      id: "TKT-003",
      subject: "Billing Inquiry",
      status: "Resolved",
      date: "2023-06-05",
      priority: "Low"
    }
  ]

  return (
    <div className="flex-1 bg-background relative overflow-auto scrollbar-hide">
      <div className="px-8 xl:px-12 pt-10 pb-4">
        <p className="text-4xl font-semibold text-white">Help & Support</p>
      </div>

      {showFeedbackBanner && (
        <div className="mx-8 xl:mx-12 mb-6 mt-4 relative bg-indigo-900 rounded-none p-4">
          <button 
            onClick={() => setShowFeedbackBanner(false)}
            className="absolute top-2 right-2 text-white hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-white/80 mr-25">
            <InfoIcon className="h-4 w-4 mr-2 text-white inline relative font-medium bottom-0.5" />We're always happy to receive your feedback and are here to support you with any questions or concerns you may have. Your thoughts truly matter to us and help us continually improve and serve you better.
          </p>
        </div>
      )}

      <div className="px-8 xl:px-12 pb-20 mt-15">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <Card className="bg-black/40 border-white/10 rounded-3xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Ticket className="h-5 w-5" />
                    Submit a Support Ticket
                  </CardTitle>
                  <div className="text-xs text-white/70">Typical response time: <span className="text-white font-semibold">within 24 hours</span></div>
                </div>
                <CardDescription className="text-white/70">
                  Fill out the form below to get help from our support team
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 ">
                  <div className="space-y-4">
                    <Label htmlFor="subject" className="text-white">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Briefly describe your issue"
                      required
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="category" className="text-white">Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="bg-black/30 border border-white/10 text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="api">Access Code</SelectItem>
                        <SelectItem value="extension">Extension Problem</SelectItem>
                        <SelectItem value="account">Account Management</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide detailed information about your issue"
                      rows={6}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full mt-10 h-12 rounded-full bg-white text-black font-semibold hover:bg-white/90" 
                    disabled={isSubmitting || !isFormValid}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Ticket Raised Successfully</DialogTitle>
            <DialogDescription className="text-white/80">Our support team will reach out to you soon.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="rounded-full" onClick={() => setSuccessOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}