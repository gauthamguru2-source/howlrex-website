# HowlRex — Insta360 Search Visibility Project

## Goal
Help Google discover the HowlRex wave-riding video and its dedicated watch page for relevant searches such as **Insta360 wave riding**, **Insta360 action camera footage**, and **360 camera water sports**.

**Important:** No website change can guarantee first place for the broad query “Insta360”. It is a highly competitive product/brand term, and Google decides ranking from many signals. This project improves technical discovery and creates a useful watch page; it does not manipulate rankings.

## Assets
- Original YouTube video: https://www.youtube.com/watch?v=QQ-wm0-KYTI
- Dedicated watch page: https://howlrex-website.vercel.app/insta360-wave-riding.html
- Main HowlRex website: https://howlrex-website.vercel.app/
- Video sitemap: https://howlrex-website.vercel.app/video-sitemap.xml

## Technical changes in this project
- Advertise both the regular sitemap and video sitemap in `robots.txt`.
- Keep only canonical, real page URLs in `sitemap.xml`; fragment URLs such as `/#cinema` are sections of the homepage, not separate pages.
- Keep a dedicated video watch page with an embedded YouTube player, unique title/description, stable thumbnail, Open Graph metadata, and `VideoObject` structured data.
- Keep an internal link to the watch page from the homepage's Cinema section.

## Required launch / indexing checklist
1. Merge this branch only after reviewing the diff.
2. Confirm Vercel successfully deploys the merged commit.
3. Open the watch page in a browser and verify the player works on desktop and mobile.
4. In Google Search Console, verify ownership of `https://howlrex-website.vercel.app/`.
5. Submit `https://howlrex-website.vercel.app/sitemap.xml` and `https://howlrex-website.vercel.app/video-sitemap.xml`.
6. Use URL Inspection on the watch page. If it is eligible, request indexing; this is a request, not a guarantee.
7. Check the Video indexing report and Performance report over time. Fix any reported crawl, thumbnail, or structured-data errors.
8. In YouTube Studio, update the video's title, first two description lines, thumbnail, and relevant chapters only if they accurately describe the footage. Keep the brand/model spelling accurate. Do not add unrelated tags or claim an official Insta360 endorsement.
9. Share the video page through HowlRex's own social profiles and relevant creator communities where promotion is welcome. Seek genuine viewers, watch time, and relevant editorial links; never buy links or views.

## Suggested YouTube metadata (edit only if accurate)
**Title:** Insta360 Wave Riding 🌊 | 360° Action Camera POV | HowlRex

**Description opening:**
Wave-riding action captured with an Insta360 camera — an immersive water-sports perspective from HowlRex. Watch the full video and subscribe for more action, lifestyle, and cinematic creator content.

Watch: https://www.youtube.com/watch?v=QQ-wm0-KYTI
More from HowlRex: https://www.youtube.com/@HowlRex

**Relevant hashtags:** #Insta360 #WaveRiding #ActionCamera

Use “360°” only if the footage genuinely shows a 360-degree camera perspective. Do not name a specific Insta360 model unless confirmed.

## What success looks like
- The watch page is crawlable and indexed.
- Search Console reports whether Google indexed the embedded video.
- The target video earns impressions for relevant long-tail searches and viewers who engage with it.
- Ranking changes are measured over time; first place for the broad “Insta360” query is not promised.
