# MMTC - Melyncrythan Musical Theatre Company Website

A modern, responsive website and lightweight CMS for Melyncrythan Musical Theatre Company, built with Next.js, Tailwind CSS, and Firebase.

## Features

### Public Website
- **Homepage** - Hero section, spotlight show, latest news, about snippet, sponsors
- **Upcoming Shows** - Featured productions with ticket booking links
- **Past Productions** - Filterable archive with gallery modals
- **About & History** - Company history, senior & junior sections info
- **Blog** - News and announcements with search functionality
- **Contact** - Join us form with interest categories

### Admin CMS (`/admin`)
- **Dashboard** - Overview stats and quick actions
- **Show Manager** - Full CRUD for productions, spotlight toggle, gallery images
- **Blog Manager** - Create/edit posts, publish/draft status, auto-slug generation
- **Form Submissions** - View and manage contact form entries

## Tech Stack

- **Framework:** Next.js 14 (App Router, Static Export)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Backend:** Firebase (Auth + Firestore)
- **Hosting:** GitHub Pages

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm
- Firebase project with Auth and Firestore enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mmtc.git
   cd mmtc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase configuration in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Enable **Authentication** with Email/Password provider

3. Create a **Firestore Database** with the following collections:
   - `shows`
   - `blog_posts`
   - `contact_submissions`
   - `supporters`

4. Set up Firestore security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Public read for shows, blog posts, and supporters
       match /shows/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /blog_posts/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       match /supporters/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       // Contact submissions - public write, authenticated read
       match /contact_submissions/{document=**} {
         allow create: if true;
         allow read, update, delete: if request.auth != null;
       }
     }
   }
   ```

5. Create an admin user in Firebase Authentication

## Deployment to GitHub Pages

### Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the site when you push to the `main` branch.

### Setup Steps

1. Go to your GitHub repository settings

2. Navigate to **Pages** and set:
   - Source: GitHub Actions

3. Navigate to **Secrets and variables > Actions** and add the following secrets:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

4. Push to `main` to trigger deployment

### Custom Domain (Optional)

1. Add a `CNAME` file to the `public/` folder with your domain:
   ```
   www.mmtc.org.uk
   ```

2. Configure DNS settings with your domain provider

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin CMS pages
│   │   ├── blog/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── shows/
│   │   └── submissions/
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── past-productions/
│   ├── upcoming/
│   └── page.tsx            # Homepage
├── components/
│   ├── admin/              # Admin-specific components
│   ├── ui/                 # Reusable UI components
│   ├── BlogCard.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── ShowCard.tsx
│   └── SocialLinks.tsx
├── contexts/
│   └── AuthContext.tsx     # Firebase Auth context
├── lib/
│   ├── firebase.ts         # Firebase initialization
│   └── firestore.ts        # Firestore CRUD operations
└── types/
    └── index.ts            # TypeScript interfaces
```

## Customization

### Updating Social Links

Edit the social media URLs in `src/components/SocialLinks.tsx`

### Changing Colors

Modify the color palette in `tailwind.config.ts`

### Adding Content

Use the admin portal at `/admin` to manage:
- Shows (upcoming and past productions)
- Blog posts
- View contact form submissions

## License

© Melyncrythan Musical Theatre Company. All rights reserved.
