# OG Social Image — Action Required

The `<meta property="og:image">` tag in `index.html` references:

```
https://bidiischools.co.ke/og-image.png
```

**You must create `public/og-image.png`** — a 1200 × 630 px branded image — and commit it before deploying. Until it exists, social previews on WhatsApp, Twitter/X, LinkedIn, and Facebook will show a broken image placeholder, which damages trust for any brand-search click.

## Spec

| Property | Value |
|---|---|
| File name | `public/og-image.png` |
| Dimensions | 1200 × 630 px |
| Format | PNG (WebP also fine — rename the meta tag) |
| Content | Bidii Schools logo + tagline "School management, made simple." on brand background (#1a2d5a navy or equivalent) |
| Text readable at | Thumbnail size (approx 400 × 210 px) |

## Quick option

Export the `logo.png` from Figma/Canva at 1200×630 with the navy background and the tagline. Any simple branded card is better than a missing image.

## Verification

Once uploaded, check the preview at:
- https://cards-dev.twitter.com/validator
- https://developers.facebook.com/tools/debug/
- https://www.linkedin.com/post-inspector/
