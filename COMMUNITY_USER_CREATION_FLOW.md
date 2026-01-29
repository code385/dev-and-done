# Community User Profile Creation Flow

## 📋 **Overview**

Community user profiles are created **automatically** when users interact with the community (post, comment, ask questions, answer). There's no separate registration step - profiles are created on-demand.

---

## 🔄 **Creation Flow**

### **Step 1: User Interaction**
When a user tries to:
- Create a post
- Add a comment
- Ask a question
- Submit an answer

### **Step 2: Authentication Check**
The system checks if the user is authenticated:

```javascript
const token = await verifyToken(); // Checks for admin_token cookie
```

**Two scenarios:**

#### **Scenario A: Authenticated User (Logged in Admin/Founder)**
- If `token.email` exists, the system looks for an existing community user with that email
- If found → uses existing profile
- If not found → creates new community user profile linked to the founder account

#### **Scenario B: Guest User (Not Logged In)**
- If no token, the system uses the `authorEmail` provided in the request
- Looks for existing community user with that email
- If found → uses existing profile
- If not found → creates new **guest user** profile

---

## 🎯 **Where Profiles Are Created**

### **1. When Creating a Post** (`/api/community/posts`)
```javascript
// Location: src/app/api/community/posts/route.js (lines 99-124)

// Try authenticated user first
if (token && token.email) {
  user = await UserModel.getCommunityUserByEmail(token.email);
}

// If no user found, create one
if (!user && finalAuthorEmail) {
  user = await UserModel.getCommunityUserByEmail(finalAuthorEmail);
  if (!user) {
    // 🎯 PROFILE CREATED HERE
    const newUser = await UserModel.createCommunityUser({
      email: finalAuthorEmail,
      name: finalAuthorName || 'Guest',
      displayName: finalAuthorName || 'Guest',
    });
  }
}
```

### **2. When Adding a Comment** (`/api/community/posts/[id]/comments`)
```javascript
// Location: src/app/api/community/posts/[id]/comments/route.js

// Same flow - checks for existing user, creates if not found
```

### **3. When Asking a Question** (`/api/community/questions`)
```javascript
// Location: src/app/api/community/questions/route.js

// Same flow - checks for existing user, creates if not found
```

### **4. When Submitting an Answer** (`/api/community/questions/[id]/answers`)
```javascript
// Location: src/app/api/community/questions/[id]/answers/route.js

// Same flow - checks for existing user, creates if not found
```

---

## 📝 **Profile Creation Details**

### **Function: `createCommunityUser()`**
**Location:** `src/lib/mongodb/models/CommunityUser.js`

```javascript
export async function createCommunityUser(userData) {
  // 1. Generate username from email if not provided
  const username = userData.username || 
    userData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

  // 2. Create user object with defaults
  const user = {
    userId: userData.userId || null,        // Links to founders if admin
    email: userData.email.toLowerCase(),    // Required
    username: username.toLowerCase(),       // Auto-generated
    displayName: userData.displayName || userData.name || username,
    bio: userData.bio || '',
    avatar: userData.avatar || '',
    reputation: 0,                          // Starts at 0
    postCount: 0,
    questionCount: 0,
    answerCount: 0,
    acceptedAnswerCount: 0,
    upvotesReceived: 0,
    isBanned: false,
    isMuted: false,
    mutedUntil: null,
    joinedAt: new Date(),                   // Current timestamp
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 3. Check if user already exists (by email or username)
  const existing = await collection.findOne({ 
    $or: [
      { email: user.email },
      { username: user.username }
    ]
  });

  // 4. If exists, return existing user
  if (existing) {
    return { success: false, error: 'User already exists', user: existing };
  }

  // 5. Create new user
  const result = await collection.insertOne(user);
  return { success: true, id: result.insertedId, user: { ...user, _id: result.insertedId } };
}
```

---

## 🔑 **Key Points**

### **1. Automatic Creation**
- ✅ No registration form needed
- ✅ Profiles created on first interaction
- ✅ Email is the primary identifier

### **2. Username Generation**
- If not provided, username is auto-generated from email
- Example: `john.doe@example.com` → `johndoe`
- Special characters are removed
- Made lowercase

### **3. Duplicate Prevention**
- System checks for existing users by:
  - Email (primary)
  - Username (secondary)
- If user exists, returns existing profile instead of creating duplicate

### **4. Guest vs Authenticated Users**
- **Authenticated:** Linked to founder account via `userId` field
- **Guest:** Only has email, no password/auth required
- Both can participate in community

### **5. Initial Values**
- Reputation: `0`
- All counts: `0` (posts, questions, answers)
- Status: Active (not banned/muted)
- Joined date: Current timestamp

---

## 📊 **Example Flow**

### **User Creates First Post:**

1. **User submits post** with email: `john@example.com`
2. **System checks:** Is there a community user with `john@example.com`?
3. **Not found** → Creates new profile:
   ```javascript
   {
     email: "john@example.com",
     username: "john",  // Auto-generated
     displayName: "John",  // From name field
     reputation: 0,
     postCount: 0,
     joinedAt: "2024-01-15T10:30:00Z"
   }
   ```
4. **Post is created** with `authorId` pointing to new user
5. **User's postCount** is incremented to `1`
6. **User's reputation** gets +5 points for creating post

### **User Adds Comment Later:**

1. **User submits comment** with same email: `john@example.com`
2. **System checks:** Finds existing user (created when posting)
3. **Uses existing profile** → No new profile created
4. **Comment is created** with `authorId` pointing to existing user

---

## 🔍 **How to Check User Creation**

### **In Database:**
```javascript
// MongoDB collection: community_users
{
  _id: ObjectId("..."),
  email: "user@example.com",
  username: "user",
  displayName: "User Name",
  reputation: 15,
  postCount: 2,
  questionCount: 1,
  answerCount: 3,
  joinedAt: ISODate("2024-01-15T10:30:00Z"),
  // ... other fields
}
```

### **Via API:**
```javascript
// Get user by email
GET /api/community/users/[username]

// Or check in any post/comment/question
// They all have authorId pointing to community_users collection
```

---

## 🎨 **UI Flow**

### **For Users:**
1. User visits `/community/posts/new`
2. Fills form with name and email (if not logged in)
3. Submits post
4. **Profile is created automatically** in the background
5. User can now see their profile at `/community/users/[username]`

### **For Admins:**
1. Admin logs in with admin credentials
2. Creates post/comment
3. System links to their founder account
4. Creates community profile if doesn't exist
5. Can view profile with admin privileges

---

## ⚠️ **Important Notes**

1. **Email is Required:** All community interactions require an email
2. **No Password:** Guest users don't need passwords (email-only)
3. **Unique Username:** System ensures username uniqueness
4. **Auto-Increment:** Stats (postCount, reputation) update automatically
5. **No Manual Creation:** There's no API endpoint to manually create users - it's automatic

---

## 🔧 **Technical Implementation**

### **Files Involved:**
- `src/lib/mongodb/models/CommunityUser.js` - User model & creation logic
- `src/app/api/community/posts/route.js` - Post creation (creates users)
- `src/app/api/community/posts/[id]/comments/route.js` - Comment creation
- `src/app/api/community/questions/route.js` - Question creation
- `src/app/api/community/questions/[id]/answers/route.js` - Answer creation

### **Database Collection:**
- **Collection:** `community_users`
- **Indexes:** 
  - `email` (unique)
  - `username` (unique)
  - `reputation` (for sorting)
  - `userId` (for linking to founders)

---

## 📈 **Reputation System**

When profiles are created, reputation starts at `0`. It increases when:
- **Post created:** +5 points
- **Question asked:** +5 points
- **Answer upvoted:** +10 points
- **Answer accepted:** +15 points
- **Comment upvoted:** +2 points
- **Post upvoted:** +10 points

---

## ✅ **Summary**

**Community user profiles are created automatically when:**
1. User creates their first post/comment/question/answer
2. System checks if profile exists (by email)
3. If not found, creates new profile with:
   - Auto-generated username
   - Email from request
   - Default values (reputation: 0, counts: 0)
   - Current timestamp as joined date
4. Profile is then used for all future interactions

**No manual registration required!** 🎉

