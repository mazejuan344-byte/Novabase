# Troubleshooting Sign-In Issues

## Common Causes and Fixes

### 1. Database Connection Issues

**Error:** "Database connection failed" or "Unable to connect to server"

**Solution:**
- Check `DATABASE_URL` in backend environment variables
- Verify Supabase database is accessible
- Check database credentials are correct
- Ensure SSL is enabled for Supabase connections

### 2. Missing JWT_SECRET

**Error:** "Server configuration error. JWT_SECRET is missing or invalid"

**Solution:**
- Add `JWT_SECRET` to backend environment variables
- Generate a secure secret (32+ characters)
- Restart backend after adding

**Generate JWT Secret:**
```powershell
# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

```bash
# Mac/Linux
openssl rand -base64 32
```

### 3. Users Table Doesn't Exist

**Error:** "Database table does not exist"

**Solution:**
- Run the database migration in Supabase SQL Editor
- Copy contents of `database/schema.sql`
- Paste and run in Supabase SQL Editor

### 4. Invalid Credentials

**Error:** "Invalid email or password"

**Possible causes:**
- Wrong email or password
- User doesn't exist
- Password hash mismatch

**Solution:**
- Verify email and password are correct
- Check if user exists in database
- Try resetting password or creating new account

### 5. Account Inactive

**Error:** "Account is inactive"

**Solution:**
- Check `is_active` field in users table
- Update to `true` if needed:
  ```sql
  UPDATE users SET is_active = true WHERE email = 'user@example.com';
  ```

### 6. API Endpoint Not Found

**Error:** Network error or 404

**Solution:**
- Check `NEXT_PUBLIC_API_URL` in frontend environment
- Verify backend is running and accessible
- Check CORS configuration

## Testing Sign-In

### Test Backend Directly

```bash
# Test sign-in endpoint
curl -X POST https://your-backend-url.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Check Backend Logs

Look for:
- "Signin error:" - Shows the actual error
- Database connection errors
- JWT_SECRET errors
- Validation errors

### Verify Environment Variables

**Backend needs:**
- `DATABASE_URL` - Supabase connection string
- `JWT_SECRET` - Secret key for tokens
- `FRONTEND_URL` - For CORS
- `NODE_ENV` - production or development

**Frontend needs:**
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Quick Fixes

### Fix 1: Check Database Connection

```sql
-- In Supabase SQL Editor, test connection
SELECT COUNT(*) FROM users;
```

### Fix 2: Verify JWT_SECRET

```bash
# In backend environment, check if set
echo $JWT_SECRET  # Should show a value
```

### Fix 3: Test User Exists

```sql
-- Check if user exists
SELECT id, email, is_active FROM users WHERE email = 'test@example.com';
```

### Fix 4: Reset User Password (if needed)

```sql
-- This would require re-hashing the password
-- Better to use signup or password reset feature
```

## Debugging Steps

1. **Check browser console** (F12)
   - Look for network errors
   - Check API response

2. **Check backend logs**
   - Look for "Signin error:"
   - Check for database errors
   - Verify JWT_SECRET is set

3. **Test API directly**
   - Use Postman or curl
   - Test `/api/auth/signin` endpoint
   - Check response

4. **Verify database**
   - Check users table exists
   - Verify user exists
   - Check is_active status

## What Was Fixed

✅ **Better error messages** - Shows specific error causes
✅ **JWT_SECRET validation** - Checks if secret is configured
✅ **Database error detection** - Identifies connection issues
✅ **Improved frontend errors** - Better user feedback

## After Fixes

1. **Deploy backend** with improved error handling
2. **Test sign-in** - Should show specific errors if it fails
3. **Check error messages** - They will tell you exactly what's wrong
4. **Fix the specific issue** based on error message

## Summary

The improved error handling will now show:
- "Database connection failed" → Check DATABASE_URL
- "JWT_SECRET missing" → Add JWT_SECRET to environment
- "Table does not exist" → Run database migration
- "Invalid credentials" → Check email/password
- "Account inactive" → Update is_active in database

