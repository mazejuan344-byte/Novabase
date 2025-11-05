# How to Find Your Supabase Database Connection String

## Method 1: Direct Link (Easiest)

1. In your Supabase project dashboard
2. Click the **gear icon** (⚙️) at the bottom left
3. Click **"Database"** in the sidebar
4. Scroll down to find **"Connection string"** or **"Connection info"**
5. Look for a tab that says **"URI"** - click it
6. You'll see something like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

## Method 2: Connection Pooling

1. Same steps 1-3 as above
2. Look for **"Connection pooling"** section
3. Find **"Connection string"** there
4. Use the URI format (not the session or transaction mode)

## Method 3: Build It Manually

If you can see these fields, I can help you build it:

1. **Host:** (e.g., `aws-0-us-east-1.pooler.supabase.com`)
2. **Database name:** (usually `postgres`)
3. **Port:** (usually `6543` for pooling or `5432` for direct)
4. **User:** (usually `postgres`)
5. **Password:** (the one you set when creating the project)

The format is:
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

## What to Look For

- The connection string should start with `postgresql://`
- It should have your password in it (or `[YOUR-PASSWORD]` placeholder)
- Make sure you're using the **URI** format, not the other formats

## Still Can't Find It?

Try this:
1. In Supabase dashboard, look for **"Project Settings"** or **"Settings"**
2. Click on **"API"** or **"Database"**
3. The connection info might be there

Or share what you see, and I'll help you locate it!




