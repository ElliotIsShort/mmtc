# MMTC Website - Technical Reference

> **AI Agents: Update this document when you make architectural changes or discover new gotchas.**

## What This Is

A static Next.js site with Firebase backend for Melyncrythan Musical Theatre Company. Public pages for visitors, admin CMS at `/admin` for staff to manage shows, blog posts, and contact form submissions.

## Key Design Decisions

- **Static export** (`output: 'export'` in next.config.js) - No SSR, all data fetched client-side. Required for GitHub Pages hosting.
- **No image uploads** - All images use URL inputs. Could add Firebase Storage later.
- **Blog content is HTML** - No rich text editor, content stored as raw HTML strings.
- **Single spotlight show** - Only one show can have `isSpotlight: true`. The `setSpotlightShow()` function in `firestore.ts` clears others before setting the new one.

## Firestore Collections

| Collection | Purpose | Public Access |
|------------|---------|---------------|
| `shows` | Productions (upcoming & past) | Read only |
| `blog_posts` | News articles | Read only (published) |
| `contact_submissions` | Form entries from /contact | Write only (create) |
| `supporters` | Sponsor logos on homepage | Read only |

Security rules must allow public reads for content, public creates for submissions, and authenticated access for all writes.

## Authentication

Firebase Email/Password only. The `AuthProvider` wraps all `/admin/*` routes via `app/admin/layout.tsx`. Check `AuthContext.tsx` for the auth state hook.

## Styling Notes

Custom utility classes in `globals.css`:
- `.container-page` - Centered max-width container
- `.section-padding` - Consistent vertical spacing
- `.page-header` - Purple gradient header used on all public pages
- `.card` - White card with shadow and hover effect

Colors: Primary = purple (`primary-*`), Secondary = amber/gold (`secondary-*`)

## Environment Variables

All prefixed with `NEXT_PUBLIC_` (client-side accessible):
- Firebase config (API key, auth domain, project ID, storage bucket, messaging sender ID, app ID)

Set in `.env.local` for dev, GitHub Secrets for deployment.

## Gotchas

1. **Spotlight logic** - Remember only one show should be spotlight at a time
2. **Blog slugs must be unique** - The admin UI validates this, but direct Firestore writes could create duplicates
3. **Static export means no API routes** - Everything happens client-side
4. **Social links are hardcoded** - Update `SocialLinks.tsx` to change platforms/URLs

## Adding New Admin Sections

1. Create the page at `app/admin/[section]/page.tsx`
2. Add nav item to `NAV_ITEMS` array in `components/admin/AdminLayout.tsx`
3. Add Firestore functions to `lib/firestore.ts` if needed
4. Add types to `types/index.ts` if needed

---

*Last updated: September 2026*
