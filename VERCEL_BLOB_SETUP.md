# Vercel Blob Storage Setup Guide

## Problem
Getting 500 errors when uploading books or cover images in production on Vercel.

## Solution
You need to set up Vercel Blob Storage and configure the `BLOB_READ_WRITE_TOKEN` environment variable.

## Step-by-Step Setup

### 1. Enable Vercel Blob Storage

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project (devanddone)
3. Go to the **Storage** tab
4. Click **Create Database** or **Add Storage**
5. Select **Blob** from the options
6. Click **Create**

### 2. Get Your Blob Token

After creating the Blob store:

1. In the Storage tab, click on your Blob store
2. Go to the **Settings** tab
3. Find **Environment Variables** or **Tokens**
4. Copy the **BLOB_READ_WRITE_TOKEN** (it starts with `vercel_blob_rw_`)

### 3. Add Environment Variable to Vercel

1. In your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add the following:
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** Paste the token you copied (starts with `vercel_blob_rw_`)
   - **Environment:** Select all (Production, Preview, Development)
5. Click **Save**

### 4. Redeploy Your Application

After adding the environment variable:

1. Go to **Deployments** tab
2. Click the **...** menu on your latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger a new deployment

**Important:** Environment variables are only available after redeployment!

## Verification

After redeploying, test the upload:

1. Go to your admin panel
2. Try uploading a book cover image
3. Check the browser console for any errors
4. If it still fails, check Vercel function logs:
   - Go to **Deployments** → Click on latest deployment → **Functions** tab
   - Look for error logs in the upload function

## Troubleshooting

### Error: "Blob storage is not configured"

**Solution:** The `BLOB_READ_WRITE_TOKEN` environment variable is not set or not available.

1. Verify the variable is set in Vercel dashboard
2. Make sure you redeployed after adding it
3. Check that the variable name is exactly `BLOB_READ_WRITE_TOKEN` (case-sensitive)

### Error: "Failed to upload to blob storage"

**Possible causes:**

1. **Invalid Token:**
   - Make sure you copied the full token
   - Token should start with `vercel_blob_rw_`
   - Regenerate the token if needed

2. **Token Permissions:**
   - Make sure you're using the **READ_WRITE** token, not read-only
   - Check token permissions in Blob store settings

3. **Blob Store Not Created:**
   - Make sure you created a Blob store in your Vercel project
   - Check the Storage tab in your project dashboard

4. **File Size Limits:**
   - Book PDFs: Max 50MB
   - Cover images: Max 5MB
   - If your file is larger, compress it first

### Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Go to **Functions** tab
4. Click on the failed function (e.g., `/api/books/upload-image`)
5. Check the **Logs** tab for detailed error messages

## Alternative: Check Environment Variables

You can verify your environment variables are set correctly:

1. In Vercel Dashboard → Settings → Environment Variables
2. Make sure `BLOB_READ_WRITE_TOKEN` is listed
3. Verify it's enabled for **Production** environment
4. The value should start with `vercel_blob_rw_`

## Quick Test

After setup, you can test if the token is working by checking the Vercel function logs. The upload should succeed and you should see a blob URL returned (starts with `https://...blob.vercel-storage.com/...`).

## Need Help?

If you're still having issues:

1. Check Vercel function logs for detailed error messages
2. Verify the Blob store is created and active
3. Make sure the token has read/write permissions
4. Try regenerating the token if it's not working

## Reference

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

