// Live Google reviews via the Places API (New). Needs GOOGLE_PLACES_API_KEY and
// GOOGLE_PLACE_ID in .env.local; without them the site falls back to its saved reviews.
// Google returns at most 5 reviews per place; only 4-star and above are passed on.
const MIN_RATING = 4;

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  const links = placeId ? {
    url: `https://search.google.com/local/reviews?placeid=${placeId}`,
    writeUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
  } : {};
  if (!key || !placeId) return Response.json({ source: 'unconfigured', reviews: [], ...links });

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return Response.json({ source: 'error', status: res.status, reviews: [], ...links });

    const data = await res.json();
    const reviews = (data.reviews || [])
      .filter((r) => (r.rating || 0) >= MIN_RATING && (r.text?.text || r.originalText?.text))
      .map((r, i) => ({
        id: `g-${i}`,
        name: r.authorAttribution?.displayName || 'Google user',
        rating: r.rating,
        text: r.text?.text || r.originalText?.text,
        when: r.relativePublishTimeDescription || '',
      }));

    return Response.json({
      source: 'google',
      rating: data.rating,
      total: data.userRatingCount,
      ...links,
      reviews,
    });
  } catch {
    return Response.json({ source: 'error', reviews: [], ...links });
  }
}
