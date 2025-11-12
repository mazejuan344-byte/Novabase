# Rate Limit Fix - 429 Error

## Issue
Users getting "Request failed with status code 429" when trying to sign in.

## What is 429 Error?
**429 = Too Many Requests** - The rate limiter is blocking requests because too many requests were made from the same IP address.

## What Was Fixed

### 1. Increased General Rate Limit
- **Before:** 100 requests per 15 minutes
- **After:** 200 requests per 15 minutes

### 2. Separate Auth Rate Limit
- **Auth endpoints** (sign in/sign up): 20 requests per 15 minutes
- **Skip successful requests:** Only failed attempts count
- **Better error message:** "Too many sign-in attempts. Please try again in a few minutes."

### 3. Better Error Handling
- Frontend now shows specific rate limit messages
- Shows retry-after time if available
- Better user feedback

## Rate Limit Configuration

### Auth Endpoints (`/api/auth/*`)
- **Limit:** 20 requests per 15 minutes per IP
- **Skip successful:** Yes (only failed attempts count)
- **Message:** "Too many sign-in attempts. Please try again in a few minutes."

### Other API Endpoints
- **Limit:** 200 requests per 15 minutes per IP
- **Message:** "Too many requests from this IP, please try again later."

### Health Check
- **No rate limiting** - Always accessible

## Why This Happens

Rate limiting can trigger if:
1. **Multiple sign-in attempts** - User trying different passwords
2. **Shared IP address** - Multiple users behind same network
3. **Frontend retries** - Automatic retries on errors
4. **Development/testing** - Rapid testing from same IP

## Solutions

### For Users
- **Wait 15 minutes** - Rate limit resets after 15 minutes
- **Check credentials** - Make sure email/password are correct
- **Try again later** - Rate limit will reset

### For Admins
- **Increase limits** - Adjust in `backend/server.js` if needed
- **Whitelist IPs** - Add trusted IPs to skip rate limiting
- **Monitor usage** - Check if legitimate traffic or abuse

## Adjusting Rate Limits

If you need to adjust the limits, edit `backend/server.js`:

```javascript
// For auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Change this number
  // ...
});

// For general API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Change this number
  // ...
});
```

## Testing

After deploying:

1. **Try signing in** - Should work normally
2. **If you get 429** - Wait 15 minutes or check rate limit settings
3. **Check error message** - Should be more helpful now

## Summary

✅ **Increased general limit** - 100 → 200 requests per 15 min
✅ **Separate auth limit** - 20 requests, skips successful
✅ **Better error messages** - Shows specific rate limit info
✅ **Health check excluded** - No rate limiting

The rate limits are now more reasonable and auth endpoints have special handling!

