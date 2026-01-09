# Client Portal Module

A complete, production-ready Client Portal implementation for the DevAndDone Next.js application.

## Overview

The Client Portal allows clients to securely log in, view their projects, track milestones, share files, and communicate with the team.

## Features

### ✅ Authentication & Authorization
- JWT-based client authentication
- Role-based access control (RBAC)
- Secure client-only data access
- Protected routes via middleware

### ✅ Database Models
- **Client**: Client information and authentication
- **Project**: Client projects with status tracking
- **Milestone**: Project milestones with due dates and status
- **ProjectFile**: File sharing between clients and admins

### ✅ API Routes
- `/api/client/auth/login` - Client login
- `/api/client/auth/logout` - Client logout
- `/api/client/auth/me` - Get current client info
- `/api/client/projects` - Get client's projects
- `/api/client/milestones` - Get/create milestones
- `/api/client/files` - Get/upload files

### ✅ Client Pages
- `/client/login` - Client login page
- `/client/dashboard` - Overview with stats and recent projects
- `/client/projects/[id]` - Project detail with milestones, files, and communication
- `/client/files` - Centralized file management

### ✅ Components
- `ProjectCard` - Project summary card
- `MilestoneTracker` - Visual milestone tracking
- `FileUpload` - File upload with progress
- `CommunicationHub` - Project messaging (placeholder for future implementation)

## Setup

### 1. Database Indexes

Run the seed script to create indexes:

```bash
npm run seed
```

This will create indexes for all models including the new Client Portal models.

### 2. Environment Variables

Ensure you have `JWT_SECRET` set in your `.env.local`:

```env
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Create a Test Client

You can create a client via the admin panel or directly in MongoDB:

```javascript
// Example: Create a client with password
const bcrypt = require('bcryptjs');
const password = await bcrypt.hash('password123', 10);

await db.collection('clients').insertOne({
  name: 'John Doe',
  email: 'client@example.com',
  companyName: 'Example Corp',
  password: password, // Optional: if using password auth
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

## Usage

### Client Login

1. Navigate to `/client/login`
2. Enter email and password
3. Upon successful login, redirected to `/client/dashboard`

### Dashboard

The dashboard shows:
- Total projects count
- Active projects count
- Active milestones count
- Recent files count
- List of recent projects

### Project Detail Page

Each project page includes:
- Project information and status
- Milestone tracker with due dates
- File upload and file list
- Communication hub (placeholder)

### File Management

- Upload files to specific projects
- View all files across all projects
- Download files
- See file metadata (uploader, date, size)

## Security

### Route Protection

All `/client/*` routes (except `/client/login`) are protected by middleware:
- Validates JWT token
- Ensures role is 'client'
- Redirects to login if unauthorized

### Data Isolation

- Clients can only see their own projects
- API routes verify client ownership before returning data
- File access restricted to client's projects

### API Authorization

- Client routes require `client_token` cookie
- Admin routes require `admin_token` cookie
- RBAC utilities ensure proper access control

## File Upload

The `FileUpload` component currently uses a placeholder implementation. To enable actual file uploads:

1. Set up a file storage service (Vercel Blob, AWS S3, Cloudinary, etc.)
2. Create an upload API endpoint
3. Update `FileUpload.js` to use the actual upload service
4. Update `/api/client/files` POST route to handle file uploads

Example with Vercel Blob:

```javascript
import { put } from '@vercel/blob';

const blob = await put(file.name, file, {
  access: 'public',
});

// Use blob.url as fileUrl
```

## Communication Hub

The `CommunicationHub` component is a placeholder. To implement full messaging:

1. Create a `Message` model
2. Create `/api/client/messages` routes
3. Implement real-time updates (WebSockets or polling)
4. Update `CommunicationHub` to fetch and send messages

## Future Enhancements

- [ ] Invoice management
- [ ] Real-time notifications
- [ ] Advanced file versioning
- [ ] Project comments/activity feed
- [ ] Email notifications for milestones
- [ ] Mobile-responsive improvements
- [ ] Dark mode support
- [ ] Multi-language support

## API Documentation

### POST /api/client/auth/login

**Request:**
```json
{
  "email": "client@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "client": {
    "id": "...",
    "email": "client@example.com",
    "name": "John Doe",
    "companyName": "Example Corp"
  }
}
```

### GET /api/client/projects

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": "...",
      "title": "Project Name",
      "description": "...",
      "status": "active",
      "startDate": "...",
      "endDate": "...",
      "createdAt": "..."
    }
  ]
}
```

### GET /api/client/milestones?projectId=xxx

**Response:**
```json
{
  "success": true,
  "milestones": [
    {
      "id": "...",
      "projectId": "...",
      "title": "Milestone Name",
      "description": "...",
      "dueDate": "...",
      "status": "in-progress",
      "createdAt": "..."
    }
  ]
}
```

### POST /api/client/files

**Request:**
```json
{
  "projectId": "...",
  "fileName": "document.pdf",
  "fileUrl": "https://...",
  "fileType": "document",
  "fileSize": 1024000
}
```

## Troubleshooting

### "Unauthorized" errors

- Check that `client_token` cookie is set
- Verify JWT_SECRET matches between login and verification
- Ensure client exists in database

### Projects not showing

- Verify client owns the projects (check `clientId` field)
- Check database indexes are created
- Verify authentication is working

### File upload not working

- Check file size limits
- Verify project ID is valid
- Ensure file storage service is configured (if using)

## Code Structure

```
src/
├── app/
│   ├── client/
│   │   ├── login/page.js          # Login page
│   │   ├── dashboard/page.js      # Dashboard
│   │   ├── projects/[id]/page.js # Project detail
│   │   ├── files/page.js          # File management
│   │   └── layout.js               # Client portal layout
│   └── api/
│       └── client/
│           ├── auth/               # Auth routes
│           ├── projects/           # Project routes
│           ├── milestones/         # Milestone routes
│           └── files/              # File routes
├── components/
│   └── client/
│       ├── ProjectCard.js          # Project card component
│       ├── MilestoneTracker.js     # Milestone tracker
│       ├── FileUpload.js           # File upload component
│       └── CommunicationHub.js    # Communication component
└── lib/
    ├── auth/
    │   ├── client-auth.js          # Client auth utilities
    │   └── rbac.js                 # Role-based access control
    └── mongodb/
        └── models/
            ├── Client.js           # Client model
            ├── Project.js           # Project model
            ├── Milestone.js         # Milestone model
            └── ProjectFile.js       # Project file model
```

## License

Part of the DevAndDone project.

