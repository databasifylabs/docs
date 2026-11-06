---
title: Storage providers
description: S3-compatible buckets for point-in-time recovery.
---

Point-in-time recovery archives to an S3-compatible bucket, such as AWS S3, Cloudflare R2, DigitalOcean Spaces, Backblaze B2, Wasabi or MinIO. Add a bucket once, then pick it on any database.

## Add storage

Go to **Storage → Add storage** and fill in:

- **Endpoint:** the HTTPS address of the S3 API, without the bucket, for example `https://s3.us-east-1.amazonaws.com`.
- **Region:** for example `us-east-1`. Use `auto` for Cloudflare R2 and `us-east-1` for MinIO.
- **Bucket.**
- **Path prefix** (optional): a folder inside the bucket, such as `databasify`.
- **Path-style addressing:** sends requests to `endpoint/bucket` instead of `bucket.endpoint`. Turn it on for MinIO and services without per-bucket hostnames.
- **Access key** and **Secret key.**
- **Storage name:** how it appears in Databasify.

Choose **Test and add**. Databasify writes, reads and deletes a test object before it saves the storage. You can run **Test connection** again later.

### Cloudflare R2 example

- Endpoint: `https://<account-id>.r2.cloudflarestorage.com`
- Region: `auto`
- Access key and secret key: from an R2 API token with read and write access to the bucket.

## Editing and removing

- While a database archives to a storage, its endpoint, bucket and path stay fixed. You can still rename it or rotate its keys.
- A storage cannot be removed while a database archives to it. Turn off that database's point-in-time recovery first.
- Removing a storage makes Databasify forget it and its keys. Archives already in the bucket stay there.
