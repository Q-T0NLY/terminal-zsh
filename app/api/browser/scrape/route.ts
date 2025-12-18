import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AIOrchestrator/1.0)",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: response.status })
    }

    const html = await response.text()

    // Basic parsing (in production, use cheerio or similar)
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)

    // Extract text content (simplified)
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    return NextResponse.json({
      url,
      title: titleMatch ? titleMatch[1] : "No title found",
      description: descriptionMatch ? descriptionMatch[1] : "No description found",
      text: textContent.substring(0, 5000), // Limit text content
      scrapedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Scraping error:", error)
    return NextResponse.json({ error: "Failed to scrape URL" }, { status: 500 })
  }
}
