// Generate a random verification code
export function generateVerificationCode(length: number): string {
  const characters = "0123456789"
  let code = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    code += characters[randomIndex]
  }

  return code
}

// Validate phone number format
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Basic validation - can be enhanced with country-specific rules
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phoneNumber)
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Calculate trust score based on user activity and verifications
export function calculateTrustScore(
  verificationLevel: string,
  accountAge: number, // in days
  listingsCount: number,
  positiveRatings: number,
  negativeRatings: number,
  reportCount: number,
): number {
  // Base score based on verification level
  let score = 0

  switch (verificationLevel) {
    case "none":
      score = 10
      break
    case "email":
      score = 30
      break
    case "phone":
      score = 50
      break
    case "id":
      score = 70
      break
    case "trusted":
      score = 90
      break
    default:
      score = 0
  }

  // Account age bonus (max 10 points)
  const ageBonus = Math.min(accountAge / 30, 10)

  // Listings bonus (max 10 points)
  const listingsBonus = Math.min(listingsCount, 10)

  // Ratings impact
  const totalRatings = positiveRatings + negativeRatings
  const ratingsImpact = totalRatings > 0 ? (positiveRatings / totalRatings) * 20 - 10 : 0

  // Report penalty (max -30 points)
  const reportPenalty = Math.min(reportCount * 5, 30)

  // Calculate final score (capped between 0 and 100)
  const finalScore = Math.max(0, Math.min(100, score + ageBonus + listingsBonus + ratingsImpact - reportPenalty))

  return Math.round(finalScore)
}

// Determine badge type based on trust score
export function getTrustBadgeType(trustScore: number): string {
  if (trustScore >= 90) return "platinum"
  if (trustScore >= 75) return "gold"
  if (trustScore >= 50) return "silver"
  if (trustScore >= 30) return "bronze"
  return "none"
}

