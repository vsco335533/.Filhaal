# Research & Media Publishing Platform

A comprehensive web-based platform for publishing and managing research documents, field studies, opinion articles, videos, and media galleries.

## Features

### Public Portal
- **Home Page** - Latest research and trending posts
- **Research Library** - Browse all published research with advanced filtering
- **Video Gallery** - Watch presentations and documentaries
- **Photo Gallery** - Visual documentation from field studies
- **Article Pages** - Detailed view with author info, tags, and downloadable documents

### Researcher Dashboard
- Create and manage research articles, field studies, and opinions
- Rich text editor with markdown support
- Upload featured images and documents
- Track post performance (views, status)
- Submit content for admin review

### Admin Dashboard
- Approve/reject submitted content
- Manage researchers and users
- View platform analytics
- Monitor pending submissions
- Content moderation workflow

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT
- **Icons**: Lucide React

## Database Schema

The platform uses a comprehensive PostgreSQL database with:
- **Users & Profiles** - Role-based access control (Admin, Researcher)
- **Posts** - Research articles, field studies, opinions
- **Categories & Tags** - Content organization
- **Media** - Videos, images, documents
- **Moderation Log** - Content approval workflow tracking

All tables have Row Level Security (RLS) enabled for secure data access.

## Demo Accounts

### Admin Account
- Email: `admin@example.com`
- Password: `password`
- Access: Full platform administration

### Researcher Account
- Email: `researcher@example.com`
- Password: `password`
- Access: Content creation and management

## Getting Started

The application is already configured and ready to use. Simply navigate through the interface:

1. **Public Access** - Browse research, videos, and gallery without login
2. **Sign In** - Use demo accounts to access dashboards
3. **Create Content** - Researchers can create and submit posts
4. **Moderate** - Admins can approve/reject submissions

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Footer
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── lib/               # Utilities
│   └── supabase.ts    # Supabase client
├── pages/             # Application pages
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Research.tsx
│   ├── Videos.tsx
│   ├── Gallery.tsx
│   ├── PostDetail.tsx
│   ├── PostEditor.tsx
│   ├── ResearcherDashboard.tsx
│   └── AdminDashboard.tsx
├── types/             # TypeScript definitions
│   ├── database.ts    # Database types
│   └── index.ts       # Shared types
└── App.tsx            # Main application with routing
```

## Key Features Implemented

### Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (RBAC)
- Protected routes for authenticated users
- Separate admin and researcher permissions

### Content Management
- Create, edit, delete posts
- Draft, submit, review, publish workflow
- Content categorization and tagging
- Featured images and document attachments
- View counting and analytics

### Search & Filtering
- Full-text search across posts
- Filter by category, type, and date
- Responsive grid layouts
- Optimized database queries

### Security
- Row Level Security (RLS) on all tables
- Input validation and sanitization
- Secure file upload handling
- Protected API endpoints

## Future Enhancements

Potential additions for Phase 2:
- Comment system for public engagement
- Newsletter subscription functionality
- AI-powered content summarization
- Multilingual support
- Advanced analytics dashboard
- Mobile app (React Native)
- Video streaming optimization
- Real-time collaboration features

## Database Migrations

All database schema changes are managed through Supabase migrations:
- Initial schema with comprehensive tables
- Default categories and tags
- Row Level Security policies
- Indexes for performance optimization

## Support

The platform includes demo data with sample research posts to demonstrate functionality. All features are production-ready and follow security best practices.
