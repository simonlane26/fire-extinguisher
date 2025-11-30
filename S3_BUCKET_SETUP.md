# S3 Bucket Configuration for Logo Storage

## Your Bucket Details
- **Bucket Name**: `26Fire-extinguisher-app26`
- **Region**: `eu-west-2` (Europe - London)

## Step-by-Step Setup

### 1. Configure Public Access Settings

In AWS Console:
1. Go to S3 → Buckets → `26Fire-extinguisher-app26`
2. Click on the **Permissions** tab
3. Scroll to **Block public access (bucket settings)**
4. Click **Edit**
5. **Uncheck** "Block all public access" OR at minimum uncheck:
   - "Block public access to buckets and objects granted through new public bucket or access point policies"
6. Click **Save changes**
7. Type `confirm` when prompted

### 2. Add Bucket Policy

Still in the **Permissions** tab:
1. Scroll down to **Bucket policy**
2. Click **Edit**
3. Paste this policy (replace the bucket name if needed):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::26Fire-extinguisher-app26/logos/*"
    }
  ]
}
```

4. Click **Save changes**

### 3. Enable CORS (Optional but Recommended)

If you want to allow direct uploads from the browser in the future:

1. In the **Permissions** tab, scroll to **Cross-origin resource sharing (CORS)**
2. Click **Edit**
3. Paste this configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

4. Click **Save changes**

## What This Does

- **Bucket Policy**: Allows public read access ONLY to files in the `logos/` folder
- **CORS**: Allows your application to upload files directly from the browser
- **Security**: Files outside the `logos/` folder remain private

## Environment Variables in Railway

Make sure you have these exact variable names set in Railway:

- `AWS_REGION=eu-west-2`
- `S3_BUCKET=26Fire-extinguisher-app26`
- `AWS_ACCESS_KEY_ID=your-access-key-id`
- `AWS_SECRET_ACCESS_KEY=your-secret-access-key`

## Testing

After setup, upload a logo through your app's Settings page. The URL should look like:
```
https://26Fire-extinguisher-app26.s3.eu-west-2.amazonaws.com/logos/tenant-id/timestamp-filename.png
```

You should be able to open this URL in a browser and see the image.

## Troubleshooting

**If logo doesn't load:**
1. Check Railway logs for "✅ S3 storage configured" message
2. Try accessing the S3 URL directly in a browser
3. If you get AccessDenied, verify the bucket policy is correct
4. Make sure "Block public access" is disabled for the bucket

**If upload fails:**
1. Check Railway logs for S3 error messages
2. Verify AWS credentials are correct
3. Check IAM user has `s3:PutObject` permission on the bucket
