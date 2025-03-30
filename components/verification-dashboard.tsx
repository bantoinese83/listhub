"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Phone, Shield, CheckCircle, Clock, AlertTriangle, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  requestEmailVerification,
  requestPhoneVerification,
  verifyEmail,
  verifyPhone,
  submitIDVerification,
  VerificationLevel,
  VerificationStatus,
} from "@/lib/verification/verification-service"
import { isValidEmail, isValidPhoneNumber } from "@/lib/verification/utils"
import VerificationBadge from "./verification-badge"

interface VerificationDashboardProps {
  user: any
  verificationStatus: any
}

export default function VerificationDashboard({ user, verificationStatus }: VerificationDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Email verification state
  const [email, setEmail] = useState(user?.email || "")
  const [emailCode, setEmailCode] = useState("")
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false)
  const [isEmailVerifying, setIsEmailVerifying] = useState(false)

  // Phone verification state
  const [phone, setPhone] = useState(user?.phone_number || "")
  const [phoneCode, setPhoneCode] = useState("")
  const [isPhoneCodeSent, setIsPhoneCodeSent] = useState(false)
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false)

  // ID verification state
  const [idType, setIdType] = useState("passport")
  const [idNumber, setIdNumber] = useState("")
  const [idImage, setIdImage] = useState<File | null>(null)
  const [isIdSubmitting, setIsIdSubmitting] = useState(false)

  // Handle email verification request
  const handleEmailVerificationRequest = async () => {
    if (!isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsEmailVerifying(true)

    try {
      const result = await requestEmailVerification(user.id, email)

      if (result.success) {
        setIsEmailCodeSent(true)
        toast({
          title: "Verification code sent",
          description: "Please check your email for the verification code",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send verification code",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting email verification:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsEmailVerifying(false)
    }
  }

  // Handle email verification
  const handleEmailVerification = async () => {
    if (!emailCode) {
      toast({
        title: "Verification code required",
        description: "Please enter the verification code sent to your email",
        variant: "destructive",
      })
      return
    }

    setIsEmailVerifying(true)

    try {
      const result = await verifyEmail(user.id, emailCode)

      if (result.success) {
        toast({
          title: "Email verified",
          description: "Your email has been successfully verified",
        })
        router.refresh()
      } else {
        toast({
          title: "Verification failed",
          description: result.error || "Invalid or expired verification code",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error verifying email:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsEmailVerifying(false)
    }
  }

  // Handle phone verification request
  const handlePhoneVerificationRequest = async () => {
    if (!isValidPhoneNumber(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setIsPhoneVerifying(true)

    try {
      const result = await requestPhoneVerification(user.id, phone)

      if (result.success) {
        setIsPhoneCodeSent(true)
        toast({
          title: "Verification code sent",
          description: "Please check your phone for the verification code",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send verification code",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting phone verification:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsPhoneVerifying(false)
    }
  }

  // Handle phone verification
  const handlePhoneVerification = async () => {
    if (!phoneCode) {
      toast({
        title: "Verification code required",
        description: "Please enter the verification code sent to your phone",
        variant: "destructive",
      })
      return
    }

    setIsPhoneVerifying(true)

    try {
      const result = await verifyPhone(user.id, phoneCode)

      if (result.success) {
        toast({
          title: "Phone verified",
          description: "Your phone number has been successfully verified",
        })
        router.refresh()
      } else {
        toast({
          title: "Verification failed",
          description: result.error || "Invalid or expired verification code",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error verifying phone:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsPhoneVerifying(false)
    }
  }

  // Handle ID verification submission
  const handleIdVerificationSubmit = async () => {
    if (!idType || !idNumber || !idImage) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and upload an ID image",
        variant: "destructive",
      })
      return
    }

    setIsIdSubmitting(true)

    try {
      // In a real app, you would upload the image to storage first
      // and then pass the URL to the submitIDVerification function
      const imageUrl = URL.createObjectURL(idImage) // This is just a placeholder

      const result = await submitIDVerification(user.id, idType, idNumber, imageUrl)

      if (result.success) {
        toast({
          title: "ID verification submitted",
          description: "Your ID verification has been submitted for review",
        })
        router.refresh()
      } else {
        toast({
          title: "Submission failed",
          description: result.error || "Failed to submit ID verification",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting ID verification:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsIdSubmitting(false)
    }
  }

  // Handle ID image selection
  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdImage(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Current Verification Level:</h2>
          <VerificationBadge level={verificationStatus.verificationLevel || VerificationLevel.NONE} size="lg" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Why verify your account?</AlertTitle>
        <AlertDescription>
          Verified accounts build trust with other users, get priority in search results, and can post listings without
          manual review. Higher verification levels unlock more features.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="email">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex items-center gap-2" disabled={!verificationStatus.details.email}>
            <Phone className="h-4 w-4" />
            Phone
          </TabsTrigger>
          <TabsTrigger value="id" className="flex items-center gap-2" disabled={!verificationStatus.details.phone}>
            <Shield className="h-4 w-4" />
            ID Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Verification</CardTitle>
              <CardDescription>Verify your email address to confirm your identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationStatus.details.email ? (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Your email has been verified</span>
                </div>
              ) : isEmailCodeSent ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>A verification code has been sent to {email}</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-code">Verification Code</Label>
                    <Input
                      id="email-code"
                      placeholder="Enter the 6-digit code"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="your.email@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              {verificationStatus.details.email ? (
                <Button variant="outline" disabled>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verified
                </Button>
              ) : isEmailCodeSent ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEmailCodeSent(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleEmailVerification} disabled={isEmailVerifying}>
                    {isEmailVerifying ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify Code
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button onClick={handleEmailVerificationRequest} disabled={isEmailVerifying}>
                  {isEmailVerifying ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="phone" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Phone Verification</CardTitle>
              <CardDescription>Verify your phone number for additional security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationStatus.details.phone ? (
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Your phone number has been verified</span>
                </div>
              ) : isPhoneCodeSent ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>A verification code has been sent to {phone}</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-code">Verification Code</Label>
                    <Input
                      id="phone-code"
                      placeholder="Enter the 6-digit code"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your phone number with country code (e.g., +1 for US)
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {verificationStatus.details.phone ? (
                <Button variant="outline" disabled>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verified
                </Button>
              ) : isPhoneCodeSent ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsPhoneCodeSent(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handlePhoneVerification} disabled={isPhoneVerifying}>
                    {isPhoneVerifying ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify Code
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button onClick={handlePhoneVerificationRequest} disabled={isPhoneVerifying}>
                  {isPhoneVerifying ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="id" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ID Verification</CardTitle>
              <CardDescription>Verify your identity with a government-issued ID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationStatus.details.id ? (
                <div className="space-y-4">
                  <div
                    className={`flex items-center gap-2 p-4 rounded-md ${
                      verificationStatus.details.id.status === VerificationStatus.VERIFIED
                        ? "bg-green-50 dark:bg-green-900/20"
                        : verificationStatus.details.id.status === VerificationStatus.REJECTED
                          ? "bg-red-50 dark:bg-red-900/20"
                          : "bg-yellow-50 dark:bg-yellow-900/20"
                    }`}
                  >
                    {verificationStatus.details.id.status === VerificationStatus.VERIFIED ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : verificationStatus.details.id.status === VerificationStatus.REJECTED ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <span>
                      {verificationStatus.details.id.status === VerificationStatus.VERIFIED
                        ? "Your ID has been verified"
                        : verificationStatus.details.id.status === VerificationStatus.REJECTED
                          ? "Your ID verification was rejected"
                          : "Your ID verification is pending review"}
                    </span>
                  </div>

                  {verificationStatus.details.id.status === VerificationStatus.REJECTED && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Verification Rejected</AlertTitle>
                      <AlertDescription>
                        Your ID verification was rejected. Please submit a new verification request.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id-type">ID Type</Label>
                    <select
                      id="id-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                    >
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="national_id">National ID</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id-number">ID Number</Label>
                    <Input
                      id="id-number"
                      placeholder="Enter your ID number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id-image">ID Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="id-image"
                        type="file"
                        accept="image/*"
                        onChange={handleIdImageChange}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("id-image")?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {idImage ? "Change Image" : "Upload ID Image"}
                      </Button>
                      {idImage && (
                        <Button variant="outline" size="icon" onClick={() => setIdImage(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {idImage && <p className="text-sm text-muted-foreground">Selected: {idImage.name}</p>}
                    <p className="text-xs text-muted-foreground">
                      Upload a clear photo of your ID. Make sure all information is visible.
                    </p>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Privacy Notice</AlertTitle>
                    <AlertDescription>
                      Your ID information is encrypted and only used for verification purposes. We do not share this
                      information with third parties.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {verificationStatus.details.id ? (
                verificationStatus.details.id.status === VerificationStatus.VERIFIED ? (
                  <Button variant="outline" disabled>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verified
                  </Button>
                ) : verificationStatus.details.id.status === VerificationStatus.REJECTED ? (
                  <Button onClick={() => router.refresh()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit New Verification
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    <Clock className="mr-2 h-4 w-4" />
                    Pending Review
                  </Button>
                )
              ) : (
                <Button onClick={handleIdVerificationSubmit} disabled={isIdSubmitting || !idImage}>
                  {isIdSubmitting ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Submit for Verification
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

