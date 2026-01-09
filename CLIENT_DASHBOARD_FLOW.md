# Client Dashboard Flow - Complete Explanation

This document explains how the Client Portal and Dashboard work from authentication to data display.

## 🏗️ Architecture Overview

```
User Browser
    ↓
Middleware (Route Protection)
    ↓
Client Layout (Conditional Rendering)
    ↓
Dashboard Page (Server Component)
    ↓
Database Models (MongoDB)
```

---

## 📋 Complete Flow

### **1. USER ACCESSES CLIENT PORTAL**

When a user visits `/client/dashboard`:

#### **Step 1.1: Middleware Interception** (`src/middleware.js`)

```
GET /client/dashboard
    ↓
Middleware checks:
    - Is this a client route? ✓
    - Is it the login page? ✗
    - Does user have client_token cookie?
        - YES → Verify JWT token
            - Valid → Allow access
            - Invalid → Redirect to /client/login
        - NO → Redirect to /client/login
```

**Code Flow:**
```javascript
// Middleware checks if route is /client/*
if (isClientRoute) {
    // If NOT login page
    if (pathname !== '/client/login') {
        // Get token from cookie
        const token = request.cookies.get('client_token')?.value;
        
        if (!token) {
            // No token → Redirect to login
            return NextResponse.redirect('/client/login');
        }
        
        // Verify token
        try {
            await jwtVerify(token, secret);
            // Token valid → Allow access
            return NextResponse.next();
        } catch (error) {
            // Invalid token → Delete cookie and redirect
            response.cookies.delete('client_token');
            return NextResponse.redirect('/client/login');
        }
    }
}
```

---

#### **Step 1.2: Client Layout Wrapper** (`src/app/client/ClientLayoutWrapper.js`)

After middleware passes, the request reaches the **ClientLayout** component:

```javascript
// ClientLayout (Server Component)
export default function ClientLayout({ children }) {
    return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>;
}
```

**ClientLayoutWrapper** (Client Component) checks authentication again:

```javascript
1. Get current pathname using usePathname()
2. If pathname === '/client/login':
    → Skip auth check, show login page without header
3. If pathname !== '/client/login':
    → Fetch /api/client/auth/me to verify authentication
    → If authenticated: Show dashboard with header
    → If not authenticated: Redirect to /client/login
```

**Why Two Checks?**
- **Middleware**: First line of defense, prevents server-side rendering of protected pages
- **Layout Wrapper**: Second check for client-side navigation and dynamic content

---

### **2. AUTHENTICATION FLOW** (`/client/login`)

#### **Step 2.1: User Submits Login Form**

```
User enters email + password
    ↓
POST /api/client/auth/login
    ↓
API Route checks:
    1. Find client by email in MongoDB
    2. Verify password (bcrypt)
    3. Create JWT token with:
       - clientId
       - email
       - name
       - role: 'client'
    4. Set client_token cookie (httpOnly, 30 days)
    5. Return success response
    ↓
Client redirects to /client/dashboard
```

**JWT Token Structure:**
```javascript
{
    clientId: "507f1f77bcf86cd799439011",
    email: "client@example.com",
    name: "John Doe",
    role: "client"
}
```

---

### **3. DASHBOARD PAGE RENDERING** (`/client/dashboard`)

#### **Step 3.1: Server Component Execution** (`src/app/client/dashboard/page.js`)

The dashboard page is a **Server Component**, which means it runs on the server:

```javascript
export default async function ClientDashboardPage() {
    // 1. Verify authentication (Server-side)
    const client = await getCurrentClient();
    // getCurrentClient() does:
    //   - Reads client_token cookie
    //   - Verifies JWT token
    //   - Fetches client from database
    //   - Returns client object
    
    if (!client) {
        redirect('/client/login');
    }
    
    // 2. Fetch dashboard data (Server-side, parallel)
    const [projects, milestones, files] = await Promise.all([
        // Fetch projects for this client
        ProjectModel.getProjectsByClientId(client._id.toString()),
        
        // Fetch all milestones for all projects
        ProjectModel.getProjectsByClientId(client._id.toString())
            .then(async (projs) => {
                // For each project, get milestones
                const milestonePromises = projs.map(p => 
                    MilestoneModel.getMilestonesByProjectId(p._id.toString())
                );
                return Promise.all(milestonePromises);
            })
            .then(milestones => milestones.flat()),
        
        // Fetch all files for all projects
        ProjectModel.getProjectsByClientId(client._id.toString())
            .then(async (projs) => {
                const filePromises = projs.map(p => 
                    ProjectFileModel.getFilesByProjectId(p._id.toString())
                );
                return Promise.all(filePromises);
            })
            .then(files => files.flat()),
    ]);
    
    // 3. Calculate statistics
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const activeMilestones = milestones.filter(m => m.status === 'in-progress').length;
    
    // 4. Render dashboard UI (Server-side rendering)
    return (
        <div>
            {/* Stats cards */}
            {/* Project cards */}
        </div>
    );
}
```

---

### **4. DATA FLOW DIAGRAM**

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│  GET /client/dashboard                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   MIDDLEWARE                            │
│  (src/middleware.js)                                    │
│  ✓ Check client_token cookie                            │
│  ✓ Verify JWT token                                     │
│  ✓ Allow/Block access                                   │
└────────────────────┬────────────────────────────────────┘
                     │ (If allowed)
                     ↓
┌─────────────────────────────────────────────────────────┐
│              CLIENT LAYOUT WRAPPER                      │
│  (src/app/client/ClientLayoutWrapper.js)                │
│  - Check pathname                                       │
│  - If NOT login: Fetch /api/client/auth/me             │
│  - Show header/navigation if authenticated              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│              DASHBOARD PAGE (Server)                    │
│  (src/app/client/dashboard/page.js)                     │
│  1. getCurrentClient() → Verify token + fetch client    │
│  2. getProjectsByClientId() → Fetch projects           │
│  3. getMilestonesByProjectId() → Fetch milestones      │
│  4. getFilesByProjectId() → Fetch files                │
│  5. Calculate stats                                     │
│  6. Render HTML (Server-side)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                 MONGODB DATABASE                        │
│  Collections:                                           │
│  - clients (client data)                                │
│  - projects (projects linked to clientId)               │
│  - milestones (milestones linked to projectId)          │
│  - project_files (files linked to projectId)            │
└─────────────────────────────────────────────────────────┘
                     │
                     ↓ (Data returned)
┌─────────────────────────────────────────────────────────┐
│              RENDERED HTML SENT TO USER                 │
│  - Stats cards with numbers                             │
│  - Project cards (clickable)                            │
│  - Client info in header                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Layers

### **Layer 1: Middleware Protection**
- **Location**: `src/middleware.js`
- **Purpose**: First defense before any rendering
- **Checks**: 
  - Valid JWT token in cookie
  - Token expiration
  - Role verification

### **Layer 2: Layout Wrapper**
- **Location**: `src/app/client/ClientLayoutWrapper.js`
- **Purpose**: Client-side auth check for dynamic navigation
- **Checks**: 
  - API call to `/api/client/auth/me`
  - Validates token still works
  - Handles expired tokens gracefully

### **Layer 3: Page-Level Authentication**
- **Location**: Each page (e.g., `dashboard/page.js`)
- **Purpose**: Server-side verification before data fetching
- **Checks**: 
  - `getCurrentClient()` verifies token
  - Redirects if not authenticated
  - Ensures client exists in database

### **Layer 4: API Route Protection**
- **Location**: `/api/client/*` routes
- **Purpose**: Verify authentication for data requests
- **Checks**: 
  - `requireClientAuth()` verifies token
  - Ensures client owns the requested data
  - Returns 401/403 if unauthorized

### **Layer 5: Database Query Filtering**
- **Location**: MongoDB model functions
- **Purpose**: Ensure clients only see their own data
- **Checks**: 
  - All queries filtered by `clientId`
  - No cross-client data leakage
  - ObjectId verification

---

## 📊 Data Isolation Example

When client with ID `"507f1f77bcf86cd799439011"` requests projects:

```javascript
// ❌ WRONG - Would expose all projects
const projects = await ProjectModel.getProjects({});

// ✅ CORRECT - Only this client's projects
const client = await getCurrentClient(); // Gets client from JWT
const projects = await ProjectModel.getProjectsByClientId(client._id.toString());
// Query: { clientId: ObjectId("507f1f77bcf86cd799439011") }
```

---

## 🔄 Complete Request Flow Example

### **Request: GET /client/dashboard**

```
1. Browser sends request with cookies:
   Cookie: client_token=eyJhbGc...

2. Middleware intercepts:
   ✓ Route is /client/dashboard (not login)
   ✓ Found client_token cookie
   ✓ Verified JWT token (valid)
   ✓ Allowed to proceed

3. Next.js App Router:
   → Loads ClientLayout component
   → Loads ClientLayoutWrapper (client component)
   → Loads DashboardPage (server component)

4. ClientLayoutWrapper (client):
   ✓ Pathname is /client/dashboard (not login)
   ✓ Fetches /api/client/auth/me
   ✓ Receives client data
   ✓ Shows header with client name
   ✓ Renders children (DashboardPage)

5. DashboardPage (server component):
   ✓ Calls getCurrentClient()
     → Reads client_token cookie
     → Verifies JWT
     → Queries MongoDB: clients.findOne({ _id: "507f..." })
     → Returns client object
   
   ✓ Calls ProjectModel.getProjectsByClientId("507f...")
     → Queries MongoDB: projects.find({ clientId: ObjectId("507f...") })
     → Returns array of projects
   
   ✓ Calls MilestoneModel.getMilestonesByProjectId(...)
     → For each project, queries milestones
     → Returns flattened array of milestones
   
   ✓ Calculates statistics
   
   ✓ Renders HTML:
     <div>
       <h1>Welcome back, John Doe!</h1>
       <StatsCards ... />
       <ProjectCards ... />
     </div>

6. HTML sent to browser:
   → Dashboard displays with data
   → User sees their projects, milestones, files
```

---

## 🎯 Key Components Explained

### **1. getCurrentClient()** (`src/lib/auth/client-auth.js`)

```javascript
export async function getCurrentClient() {
    // Step 1: Verify token
    const payload = await verifyClientToken();
    // verifyClientToken() does:
    //   - Reads client_token from cookies
    //   - Verifies JWT signature
    //   - Checks expiration
    //   - Returns payload if valid
    
    if (!payload || payload.role !== 'client') {
        return null; // Not authenticated
    }
    
    // Step 2: Fetch client from database
    const client = await ClientModel.getClientById(payload.clientId);
    // Queries: clients.findOne({ _id: ObjectId(payload.clientId) })
    
    return client; // Returns full client object
}
```

### **2. ProjectModel.getProjectsByClientId()**

```javascript
export async function getProjectsByClientId(clientId) {
    const client = await clientPromise;
    const db = client.db('devanddone');
    const collection = db.collection('projects');
    
    // Query filtered by clientId for security
    const projects = await collection
        .find({ clientId: new ObjectId(clientId) }) // ← Security filter
        .sort({ createdAt: -1 })
        .toArray();
    
    return projects;
}
```

---

## 🔍 How Data Isolation Works

### **Example: Client A vs Client B**

```
Database:
clients collection:
  { _id: "A", email: "clientA@example.com", ... }
  { _id: "B", email: "clientB@example.com", ... }

projects collection:
  { _id: "1", clientId: "A", title: "Project A1" }
  { _id: "2", clientId: "A", title: "Project A2" }
  { _id: "3", clientId: "B", title: "Project B1" }

When Client A logs in:
1. JWT token created with clientId: "A"
2. Dashboard queries: projects.find({ clientId: "A" })
3. Returns: [Project A1, Project A2]
4. Client A never sees Project B1 ✓

When Client B logs in:
1. JWT token created with clientId: "B"
2. Dashboard queries: projects.find({ clientId: "B" })
3. Returns: [Project B1]
4. Client B never sees Projects A1 or A2 ✓
```

---

## 🚀 Performance Optimizations

### **1. Parallel Data Fetching**

```javascript
// ✅ GOOD - Fetches in parallel
const [projects, milestones, files] = await Promise.all([...]);

// ❌ BAD - Sequential (slower)
const projects = await getProjects();
const milestones = await getMilestones();
const files = await getFiles();
```

### **2. Database Indexes**

```javascript
// Created indexes for faster queries:
- clients: { email: 1 } (unique)
- clients: { userId: 1 }
- projects: { clientId: 1 }
- milestones: { projectId: 1 }
- project_files: { projectId: 1 }
```

### **3. Server-Side Rendering**

- Dashboard renders on server
- HTML sent to browser (faster initial load)
- No client-side data fetching needed
- Better SEO (if needed)

---

## 📱 Client-Side vs Server-Side

### **Server Components** (Default in Next.js App Router)
- **Location**: `src/app/client/dashboard/page.js`
- **Runs on**: Server
- **Can do**: 
  - Direct database access
  - Read cookies
  - Fetch data before rendering
- **Cannot do**: 
  - Use browser APIs (useState, useEffect)
  - Handle user interactions directly

### **Client Components** (`'use client'`)
- **Location**: `src/app/client/ClientLayoutWrapper.js`, `src/components/client/ProjectCard.js`
- **Runs on**: Browser
- **Can do**: 
  - Use React hooks
  - Handle clicks, forms
  - Fetch data on user interaction
- **Cannot do**: 
  - Direct database access
  - Read server cookies directly

---

## 🔐 Security Checklist

✅ **JWT Token Security**
- Tokens stored in httpOnly cookies (can't be accessed by JavaScript)
- Tokens expire after 30 days
- Tokens verified on every request

✅ **Data Isolation**
- All queries filtered by `clientId`
- Clients can only see their own projects
- No cross-client data access

✅ **Route Protection**
- Middleware blocks unauthenticated requests
- Layout wrapper double-checks authentication
- Page components verify before data fetching
- API routes verify before returning data

✅ **Error Handling**
- Invalid tokens → Redirect to login
- Missing tokens → Redirect to login
- Database errors → Graceful error messages
- API failures → User-friendly error messages

---

## 🎓 Summary

**The Client Dashboard Flow:**

1. **User visits** `/client/dashboard`
2. **Middleware** checks for valid JWT token
3. **Layout Wrapper** verifies authentication client-side
4. **Dashboard Page** (server) fetches data:
   - Gets current client from JWT
   - Fetches client's projects
   - Fetches milestones for those projects
   - Fetches files for those projects
5. **Calculate statistics** from fetched data
6. **Render HTML** with stats and project cards
7. **Send to browser** - User sees their dashboard

**Security:**
- 5 layers of protection
- JWT-based authentication
- Complete data isolation
- Server-side verification on every request

**Performance:**
- Parallel data fetching
- Database indexes for fast queries
- Server-side rendering for instant display
- Minimal client-side JavaScript

This architecture ensures that clients can only access their own data while providing a fast, secure experience.

