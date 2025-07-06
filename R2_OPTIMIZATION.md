# R2 Image Optimization Guide

## Overview
This document explains the optimizations implemented to reduce R2 operations and improve performance.

## Implemented Optimizations

### 1. **Cloudflare Worker for Image Serving** (`/functions/images/[[path]].ts`)
- Intercepts requests to `/images/*`
- Implements edge caching with Cache API
- Sets aggressive cache headers (1 year)
- Supports future image transformations (width, quality, format)

### 2. **Cache Headers on Upload** (`upload-with-cache-headers.sh`)
- Sets `Cache-Control: public, max-age=31536000, immutable` on all uploads
- Adds CDN-specific cache control headers
- Ensures images are cached for 1 year at browser and CDN level

### 3. **Responsive Images with srcset**
- Gallery component now uses srcset for optimal image loading
- Serves different sizes based on viewport
- Reduces bandwidth usage on mobile devices

### 4. **Cache Purge Utility** (`purge-r2-cache.sh`)
- Allows selective cache invalidation
- Supports purging all, specific files, or by prefix
- Requires Cloudflare API credentials

## How It Reduces R2 Operations

1. **Browser Caching**: Images are cached for 1 year in user browsers
2. **CDN Edge Caching**: Cloudflare edge servers cache images globally
3. **Worker Caching**: Additional caching layer at the Worker level
4. **Smart Loading**: Only loads appropriate image sizes for device

## Setup Instructions

### 1. Configure R2 Bucket Binding
Add to `wrangler.toml`:
```toml
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "aat"
```

### 2. Set Up Cache Purge Script
Edit `purge-r2-cache.sh` and add:
- Your Cloudflare Zone ID
- API Token with Cache Purge permissions

### 3. Upload New Images
Use the new upload script:
```bash
./upload-with-cache-headers.sh "./Greatest hits"
```

## Monitoring

Track cache performance in Cloudflare Dashboard:
- Analytics → Cache Analytics
- Monitor cache hit ratio (should be >90%)
- Check R2 operations in R2 dashboard

## Cost Savings

With proper caching:
- Class A operations (writes): Only on initial upload
- Class B operations (reads): Only on cache misses
- Expected 95%+ cache hit rate = 95% reduction in R2 operations

## Future Enhancements

1. **Image Optimization**: Add on-the-fly resizing with Cloudflare Image Resizing
2. **WebP/AVIF Support**: Serve modern formats to supported browsers
3. **Blur-up Placeholders**: Generate tiny placeholders for progressive loading
4. **Batch Upload API**: Create API endpoint for bulk uploads with processing