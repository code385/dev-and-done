# Community Post 404 Error - Debugging Guide

## 🔍 **Issue**
Getting `notFound()` error when trying to view a community post.

## 🐛 **Possible Causes**

### **1. Slug Mismatch**
- URL slug doesn't match database slug
- Case sensitivity issues
- Special characters not normalized

### **2. Post Doesn't Exist**
- Post was deleted
- Post was never created
- Database connection issue

### **3. Status Filter**
- Post exists but status is not 'published'
- User doesn't have permission to view draft

## ✅ **Fixes Applied**

### **1. Enhanced Slug Matching** (`CommunityPost.js`)
- Added case-insensitive slug matching
- Normalizes slug (lowercase, trim)
- Falls back to regex search if exact match fails

### **2. Fallback to ID Lookup** (`page.js`)
- If slug lookup fails, tries to find by ObjectId
- Useful if URL accidentally has ID instead of slug

### **3. Better Error Handling**
- Added console.error logging
- Null safety for voteData
- Proper error boundaries

## 🔧 **How to Debug**

### **Step 1: Check Console Logs**
Look for: `Post not found for slug/ID: [slug]`

### **Step 2: Verify Post Exists**
```javascript
// In MongoDB shell or Compass
db.community_posts.findOne({ slug: "your-slug-here" })
```

### **Step 3: Check Slug Format**
- Slug should be lowercase
- No special characters (except hyphens)
- Generated from title: `title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')`

### **Step 4: Verify Post Status**
- Published posts: visible to everyone
- Draft posts: only visible to author/admin

## 📝 **Example Slug Generation**

**Title:** "How to Build a Next.js App"
**Slug:** `how-to-build-a-nextjs-app`

**Title:** "React Hooks 101!"
**Slug:** `react-hooks-101`

## 🚀 **Testing**

1. Create a new post
2. Check the slug in the response
3. Try accessing `/community/posts/[slug]`
4. If 404, check console for error message
5. Verify post exists in database

## ⚠️ **Common Issues**

### **Issue 1: Slug with Timestamp**
If slug exists, system adds timestamp:
- Original: `my-post`
- If exists: `my-post-1705123456789`

**Solution:** Use the full slug with timestamp in URL

### **Issue 2: Special Characters**
Slugs are sanitized, but URL encoding might cause issues.

**Solution:** Ensure URL is properly encoded/decoded

### **Issue 3: Locale Prefix**
URL might be: `/en/community/posts/[slug]` or `/community/posts/[slug]`

**Solution:** Check middleware routing configuration

