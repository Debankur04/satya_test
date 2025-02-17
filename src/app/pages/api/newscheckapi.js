import * as cheerio from "cheerio"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      url: "",
      title: "",
      claims: [],
      overallRating: "",
      error: "Method not allowed"
    })
  }

  try {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({
        url: "",
        title: "",
        claims: [],
        overallRating: "",
        error: "URL is required"
      })
    }

    // 1. Fetch the webpage content to get the title
    const pageResponse = await fetch(url)
    const pageHtml = await pageResponse.text()
    const $ = cheerio.load(pageHtml)
    const pageTitle =
      $("title").text() ||
      $("h1")
        .first()
        .text() ||
      ""

    // 2. Call Google Fact Check API
    const GOOGLE_FACT_CHECK_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_FACT_CHECK_API_KEY
    const factCheckUrl = `https://factchecktools.googleapis.com/v1alpha1/claims:search?key=${GOOGLE_FACT_CHECK_API_KEY}&query=${encodeURIComponent(
      pageTitle
    )}`

    const factCheckResponse = await fetch(factCheckUrl)
    const factCheckData = await factCheckResponse.json()

    // 3. Process the claims
    const claims =
      factCheckData.claims?.map(claim => ({
        publisher: claim.claimReview[0].publisher.name,
        rating: claim.claimReview[0].textualRating,
        title: claim.text,
        reviewUrl: claim.claimReview[0].url
      })) || []

    // 4. Determine overall rating
    const overallRating = determineOverallRating(claims)

    return res.status(200).json({
      url,
      title: pageTitle,
      claims,
      overallRating
    })
  } catch (error) {
    console.error("Fact check error:", error)
    return res.status(500).json({
      url: "",
      title: "",
      claims: [],
      overallRating: "",
      error: "Failed to check facts"
    })
  }
}

function determineOverallRating(claims) {
  if (claims.length === 0) return "Unknown"

  const ratingCounts = {
    true: 0,
    false: 0,
    mixed: 0,
    unknown: 0
  }

  claims.forEach(claim => {
    const rating = claim.rating.toLowerCase()
    if (rating.includes("true") || rating.includes("correct")) {
      ratingCounts.true++
    } else if (rating.includes("false") || rating.includes("fake")) {
      ratingCounts.false++
    } else if (rating.includes("mixed") || rating.includes("partial")) {
      ratingCounts.mixed++
    } else {
      ratingCounts.unknown++
    }
  })

  // Find the most common rating
  const maxCount = Math.max(...Object.values(ratingCounts))
  const dominantRating = Object.entries(ratingCounts).find(
    ([_, count]) => count === maxCount
  )?.[0]

  switch (dominantRating) {
    case "true":
      return "True"
    case "false":
      return "False"
    case "mixed":
      return "Mixed"
    default:
      return "Unknown"
  }
}
