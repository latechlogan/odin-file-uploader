# Odin File Uploader

A Google Drive-style file storage app where users can organize files into folders and upload them to the cloud. Built as a portfolio project for The Odin Project curriculum, with full authentication and persistent cloud storage via Supabase.

## Live Demo

[Live Demo](https://odin-file-uploader-production-d195.up.railway.app/login)

**Demo credentials:**

| Username | Password    |
|----------|-------------|
| alice    | password123 |
| bob      | password123 |

## Features

- User registration and login with hashed passwords
- Create, rename, and delete folders
- Upload files (JPEG, PNG, GIF, WebP, PDF — 5MB limit) into any folder or as standalone files
- View file details (name, size, type, upload date)
- Download files
- Delete files (removes from both cloud storage and database)
- All data scoped to the authenticated user — no cross-user access

## Tech Stack

- **Runtime/Framework:** Node.js, Express 5
- **Templating:** EJS
- **Database:** PostgreSQL via Prisma ORM
- **File Storage:** Supabase Storage
- **Auth:** Passport.js (local strategy), bcryptjs, express-session
- **Session Store:** `@quixo3/prisma-session-store` (sessions persisted in PostgreSQL)
- **File Handling:** Multer (in-memory processing before upload)
- **Icons:** Feather Icons

## Local Development Setup

**1. Clone the repo**

```bash
git clone https://github.com/latechlogan/odin-file-uploader.git
cd odin-file-uploader
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```
DATABASE_URL=        # PostgreSQL connection string
SESSION_SECRET=      # Random secret string for signing session cookies
SUPABASE_URL=        # Your Supabase project URL
SUPABASE_SECRET_KEY= # Supabase service role secret key
```

**4. Run database migrations**

```bash
npx prisma migrate dev
```

**5. Start the development server**

```bash
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

## Database

Prisma ORM manages the PostgreSQL schema. Migrations live in `prisma/migrations/`. The schema defines five models: `User`, `Folder`, `File`, `Session`, and `ShareLink`.

Run `npm run migrate` to create a new migration during development, or `npm run migrate:deploy` for production.

## Project Structure

```
├── app.js              # Express app entry point
├── routes/             # Route definitions (auth, folders, files)
├── controllers/        # Request handlers and business logic
├── middleware/         # isAuthenticated, multer upload config
├── lib/                # Prisma client, Supabase client, Passport strategy
├── views/              # EJS templates
│   └── shared/         # Layout, reusable partials
├── public/             # Static assets (CSS, JS)
└── prisma/
    ├── schema.prisma   # Database schema
    └── migrations/     # Migration history
```
