# Secure Vault - Password Generator & Manager

A full-stack password manager built with Next.js, MongoDB, and client-side encryption.

## Features

- **Password Generator**: Create strong, customizable passwords with control over length (8-32 chars) and character types
- **Secure Vault**: Store and manage passwords with client-side encryption using CryptoJS
- **Authentication**: Custom JWT-based auth with bcrypt password hashing
- **Search & Filter**: Quickly find vault entries by title or username
- **Copy to Clipboard**: Auto-clearing clipboard after 15 seconds for security
- **CRUD Operations**: Add, edit, delete, and view vault entries

## Tech Stack

- **Frontend**: Next.js 13 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom JWT + bcrypt
- **Encryption**: CryptoJS (AES encryption)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance like MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/securevault
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_ENCRYPTION_KEY=your-32-character-encryption-key
   ```

   **IMPORTANT**: Change these secrets in production!

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign Up**: Create an account with email and password
2. **Login**: Access your secure vault
3. **Generate Passwords**: Use the built-in generator with customizable options
4. **Add Entries**: Store website credentials securely
5. **Search**: Filter your vault entries
6. **Copy Passwords**: Quick clipboard copy with auto-clear

## Security Features

- Passwords hashed with bcrypt before storage
- Client-side encryption for sensitive vault data
- JWT authentication with 7-day expiry
- Auto-clearing clipboard after password copy
- Protected routes requiring authentication

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Connect to MongoDB Atlas or your MongoDB instance
5. Deploy

## Project Structure

```
├── app/
│   ├── api/          # API routes for auth and vault
│   ├── login/        # Login page
│   ├── signup/       # Signup page
│   ├── vault/        # Vault dashboard
│   └── page.tsx      # Home (redirects to login/vault)
├── components/       # React components
├── contexts/         # Auth context
├── lib/              # Utilities (MongoDB, encryption, auth)
├── models/           # Mongoose models
└── types/            # TypeScript types
```

## Notes

- This app uses MongoDB instead of the default Supabase configuration
- All sensitive data is encrypted client-side before sending to the server
- The clipboard auto-clears 15 seconds after copying passwords
