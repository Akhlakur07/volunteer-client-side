# VolunteerHub – Volunteer Management Frontend

A modern React (Vite) application to discover, post, and manage volunteer opportunities. Users can register/login (email-password or Google via Firebase), publish volunteer-need posts, browse all posts with search, request to volunteer, manage their own posts, and edit their profile.

- Live site: [volunteer-auth-e1a75.web.app](https://volunteer-auth-e1a75.web.app)

## Features

- Authentication
  - Email/password sign up & login
  - Google sign-in with Firebase Auth
  - Persisted session and protected routes
- Volunteer posts
  - Create new volunteer-need post (title, description, category, location, needed count, deadline, thumbnail URL)
  - List all posts with client-side search by title
  - Post details page with “Be a Volunteer” request flow
  - Update and delete your own posts
- Requests
  - Submit a volunteering request from a post
  - View and cancel your own requests
- Profile
  - View and update name, photo URL, bio
  - Syncs Firebase displayName/photoURL and persists to backend
- Polished UI/UX
  - Tailwind CSS + DaisyUI styling
  - Lottie animations for auth pages
  - Toast notifications and responsive layout

## Tech Stack

- React 19, React Router 7
- Vite 7
- Firebase Web SDK (Auth)
- Tailwind CSS 4, DaisyUI
- Lottie React
- React Toastify

Key packages (see `package.json`): `react`, `react-router`, `firebase`, `tailwindcss`, `daisyui`, `lottie-react`, `react-toastify`, `react-datepicker`, `vite`.

## Project Structure (high level)

```
src/
  components/        # Navbar, Banner, sections for home page, etc.
  context/           # AuthContext, AuthProvider, PrivateRoute
  firebase/          # firebase.init.js (reads env vars)
  pages/             # Route pages: Home, Login, Register, Posts, Details, etc.
  routes/            # router.jsx (route definitions)
```

## Routing

Defined in `src/routes/router.jsx`:

- `/` → `Home`
- `/register` → `Register`
- `/login` → `Login`
- `/posts` → `AllPosts`
- `/posts/:id` → `PostDetails` (protected)
- `/add-post` → `VolunteerNeed` (protected)
- `/manage-posts` → `MyPosts` (protected)
- `/posts/:id/edit` → `UpdatePost` (protected)
- `/my-requests` → `Request` (protected)
- `/profile` → `Profile` (protected)

“Protected” routes are wrapped with `PrivateRoute`, which checks the authenticated `user` from `AuthContext`.

## Backend API

This frontend currently calls a hosted backend at:

```
https://volunteer-back-nine.vercel.app
```

Endpoints used in the app (examples):

- `GET /posts`, `GET /posts/:id`, `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id`
- `POST /requests`, `GET /requests?volunteerEmail=...`, `DELETE /requests/:id`
- `GET /users/:email`, `POST /users`

Note: The base URL above is hard-coded in some components/pages. If you need to switch environments, consider extracting it to an environment variable.

## Environment Variables

Firebase config is read from Vite env variables inside `src/firebase/firebase.init.js`:

```
VITE_apiKey=
VITE_authDomain=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=
```

Create a `.env.local` (or `.env`) at the project root with your Firebase credentials:

```bash
# .env.local
VITE_apiKey=YOUR_FIREBASE_API_KEY
VITE_authDomain=YOUR_PROJECT.firebaseapp.com
VITE_projectId=YOUR_PROJECT_ID
VITE_storageBucket=YOUR_PROJECT.appspot.com
VITE_messagingSenderId=YOUR_SENDER_ID
VITE_appId=YOUR_APP_ID
```

## Getting Started (Local Development)

Prerequisites:

- Node.js 18+ recommended
- A Firebase project (for Auth) with Web App credentials

Install and run:

```bash
# install deps
npm install

# start dev server
npm run dev

# open the printed local URL in the terminal
```

Build & preview production build:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Authentication Flow

- `AuthProvider` wraps the app, exposing `user`, `loading`, and helpers (`createUser`, `signInUser`, `googleSignin`, `updateUser`, `logOut`).
- `PrivateRoute` renders children only if `user?.email` is truthy; otherwise it redirects to `/login` and preserves the intended path in route state.
- Registration updates Firebase profile and persists a user record to the backend. Google sign-in also upserts to the backend.

## Key Screens

- Home: Hero/banner + featured content sections
- All Posts: Grid view with search by title
- Post Details: Full post info and request modal; request submission updates available needed count
- Add Post/Update Post: Forms with validation and `react-datepicker`
- My Posts: Organizer’s table to update/delete their posts
- My Requests: Volunteer’s table to view/cancel their requests
- Profile: Edit name, photo URL, bio; synced with Firebase and backend

## Styling

- Tailwind CSS and DaisyUI power the styling. Utility classes are used throughout components/pages. Animations use `lottie-react` on auth pages.

## Deployment

The project is built with Vite and can be deployed to any static host.

- Current live deployment: [volunteer-auth-e1a75.web.app](https://volunteer-auth-e1a75.web.app)
- Typical steps:
  1. Set environment variables in your hosting provider (or bake into the build for Firebase Hosting).
  2. Run `npm run build` to produce `dist/`.
  3. Upload `dist/` to your static host or use Firebase Hosting.

If using Firebase Hosting, ensure you have a `firebase.json` configured and run:

```bash
# one-time
npm install -g firebase-tools
firebase login
firebase init hosting

# deploy
npm run build
firebase deploy
```

## Notes & Next Steps

- Consider moving the backend base URL into a Vite env var (e.g., `VITE_API_BASE_URL`) and refactoring fetch calls to use it in one place.
- Add loading skeletons and empty states where helpful.
- Add unit tests/integration tests as needed.
