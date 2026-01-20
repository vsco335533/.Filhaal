# Local Development Setup

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The `.env` file is already configured with Supabase credentials:

```env
VITE_SUPABASE_URL=https://vfqyfusugxnoqsvmibbm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** These credentials are already set up and connected to your Supabase project.

### 3. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## Demo Accounts

### Admin Account
- **Email:** `admin@example.com`
- **Password:** `password`
- **Access:** Full admin dashboard, content moderation

### Researcher Account
- **Email:** `researcher@example.com`
- **Password:** `password`
- **Access:** Content creation, researcher dashboard

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run typecheck

# Run linter
npm run lint
```

## Project Architecture

### Frontend (React + TypeScript)
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Supabase JS Client

### Backend (Supabase)
- **Database:** PostgreSQL (hosted on Supabase)
- **Authentication:** Supabase Auth with JWT
- **API:** Auto-generated RESTful API
- **Security:** Row Level Security (RLS) policies

### Database Schema

The database includes these main tables:
- `profiles` - User profiles with roles
- `posts` - Research articles, field studies, opinions
- `categories` - Content categorization
- `tags` - Content tagging system
- `post_tags` - Many-to-many relationship
- `media` - Videos, images, documents
- `moderation_log` - Content approval tracking

## How Backend Works

### No Traditional Backend Server

This application doesn't have a traditional Express/Node.js backend. Instead:

1. **Frontend communicates directly with Supabase:**
   ```typescript
   // Example: Fetch posts
   const { data } = await supabase
     .from('posts')
     .select('*')
     .eq('status', 'published');
   ```

2. **Row Level Security (RLS) handles authorization:**
   ```sql
   -- Only published posts or author's own posts are visible
   CREATE POLICY "Published posts are viewable"
     ON posts FOR SELECT
     USING (status = 'published' OR auth.uid() = author_id);
   ```

3. **Database functions handle complex logic:**
   ```sql
   -- Auto-create profile when user signs up
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW
     EXECUTE FUNCTION handle_new_user();
   ```

### When You Need Custom Backend Logic

If you need custom server-side logic, you have two options:

#### Option 1: Supabase Edge Functions (Recommended)
Create serverless functions for custom logic:

```bash
# This would be done via Supabase CLI (not installed in this project)
supabase functions new my-function
```

#### Option 2: Traditional Backend
Add an Express.js server:

```typescript
// server.js
import express from 'express';
const app = express();

app.post('/api/custom-endpoint', async (req, res) => {
  // Custom logic here
});
```

**Current project uses Option 1 architecture (serverless/BaaS)**

## Database Management

### View Database Tables

Access Supabase Dashboard:
1. Go to https://supabase.com
2. Login to your project
3. Navigate to Table Editor

### Run SQL Queries

You can run SQL directly in Supabase:
1. Go to SQL Editor in Supabase Dashboard
2. Write and execute queries
3. View results

### Migrations

Database migrations are stored in:
```
supabase/migrations/
└── 20251209113624_create_research_platform_schema.sql
```

## Common Development Tasks

### Create a New Post (as Researcher)
1. Login with researcher account
2. Click "Dashboard" → "New Post"
3. Fill in title, content, category
4. Click "Submit for Review"

### Approve Content (as Admin)
1. Login with admin account
2. Click "Admin" dashboard
3. View pending submissions
4. Click "Approve" or "Reject"

### Add New Categories
Admin can add categories through SQL:
```sql
INSERT INTO categories (name, slug, description)
VALUES ('New Category', 'new-category', 'Description');
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Authentication Issues
- Check `.env` file has correct Supabase credentials
- Verify Supabase project is active
- Check browser console for errors

### Database Connection Issues
- Verify Supabase project is running
- Check network connection
- Confirm RLS policies are properly configured

## Production Deployment

### Build for Production
```bash
npm run build
```

This creates optimized files in `dist/` directory.

### Deploy Options
- **Vercel:** Connect GitHub repo, auto-deploy
- **Netlify:** Drag & drop `dist` folder
- **AWS S3 + CloudFront:** Upload static files
- **Any static hosting service**

Remember to set environment variables in your hosting platform.

## Environment Variables for Production

When deploying, set these environment variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Support & Documentation

- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Tailwind CSS:** https://tailwindcss.com

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for sensitive data
- RLS policies protect data at database level
- JWT tokens expire automatically
- All API calls require authentication where appropriate
