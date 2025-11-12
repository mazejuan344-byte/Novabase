# Disable Rate Limiting (If Needed)

## Quick Fix: Disable Rate Limiting

If you're still getting "Too many requests" errors, you can temporarily disable rate limiting:

### Option 1: Environment Variable (Recommended)

Add to your backend environment variables:

```env
DISABLE_RATE_LIMIT=true
```

**Where to add:**
- **Render:** Dashboard → Environment → Add `DISABLE_RATE_LIMIT=true`
- **Vercel:** Settings → Environment Variables → Add `DISABLE_RATE_LIMIT=true`
- **Local:** Add to `backend/.env` file

### Option 2: Adjust Limits Further

If you want to keep rate limiting but make it even more lenient, edit `backend/server.js`:

```javascript
max: isDevelopment ? 5000 : 2000, // Increase these numbers
```

## Current Limits (After Fix)

- **General API:** 1000 requests/15min (production), 2000 (development)
- **Auth endpoints:** 100 requests/15min (production), 200 (development)
- **Skips successful sign-ins** - Only failed attempts count
- **Health check excluded** - No rate limiting

## Why You Might Still Get 429

1. **Shared IP address** - Multiple users behind same network
2. **Rapid testing** - Making many requests quickly
3. **Frontend retries** - Automatic retries on errors
4. **Cached rate limit** - Previous limit still in effect (wait 15 min)

## Temporary Solution

If you need immediate access:

1. **Add environment variable:**
   ```
   DISABLE_RATE_LIMIT=true
   ```

2. **Restart backend**

3. **Test again**

## Permanent Solution

After testing, you can:
- Re-enable rate limiting (remove `DISABLE_RATE_LIMIT`)
- Adjust limits to your needs
- Monitor usage to find optimal limits

## Summary

The limits are now much higher (1000-2000 requests per 15 minutes), but if you still have issues, you can disable rate limiting entirely with `DISABLE_RATE_LIMIT=true`.

