# Update Implementation Summary

This document summarizes the update functionality that has been implemented for the support system.

## What Was Implemented

### 1. Database Migration System

Created a migration system to update existing databases:

- **Migration File**: `database/migrations/001_add_support_tickets.sql`
- **Migration Runner**: `database/migrations/run_migration.js`
- **Migration Scripts**: 
  - `scripts/migrate-db.ps1` (Windows PowerShell)
  - `scripts/migrate-db.sh` (Linux/Mac Bash)
- **npm Scripts**: Added `migrate` and `migrate:check` commands

### 2. Update Endpoints

#### User Endpoints (`/api/support/tickets/:id`)

**PUT `/api/support/tickets/:id`** - Update ticket
- Users can update their own tickets
- Only allowed if:
  - Ticket status is `open` or `in_progress`
  - Ticket has no admin response yet
- Can update:
  - `subject` (optional)
  - `message` (optional)
  - `priority` (optional)

#### Admin Endpoints (`/api/admin/support/tickets/:id`)

**PUT `/api/admin/support/tickets/:id/status`** - Update ticket status
- Admins can update ticket status
- Statuses: `open`, `in_progress`, `resolved`, `closed`

**PUT `/api/admin/support/tickets/:id/priority`** - Update ticket priority
- Admins can update ticket priority
- Priorities: `low`, `medium`, `high`, `urgent`

**PUT `/api/admin/support/tickets/:id/response`** - Update admin response
- Admins can edit/update their response to a ticket
- Updates the `admin_response` field and `updated_at` timestamp

**POST `/api/admin/support/tickets/:id/respond`** - Respond to ticket
- Admins can respond to tickets
- Automatically sets status to `in_progress` if status was `open`

## How to Use

### Running the Migration

1. **Check if migration is needed:**
   ```bash
   npm run migrate:check
   ```

2. **Run the migration:**
   ```bash
   npm run migrate
   ```

3. **Or use psql directly:**
   ```bash
   psql -U postgres -d cryptex -f database/migrations/001_add_support_tickets.sql
   ```

### Using Update Endpoints

#### Update User Ticket

```javascript
// Update ticket subject and message
await api.put('/support/tickets/123', {
  subject: 'Updated Subject',
  message: 'Updated message',
  priority: 'high'
})
```

#### Update Admin Response

```javascript
// Update admin response
await api.put('/admin/support/tickets/123/response', {
  response: 'Updated admin response'
})
```

#### Update Ticket Status

```javascript
// Update ticket status
await api.put('/admin/support/tickets/123/status', {
  status: 'resolved'
})
```

#### Update Ticket Priority

```javascript
// Update ticket priority
await api.put('/admin/support/tickets/123/priority', {
  priority: 'urgent'
})
```

## API Reference

### User Update Ticket

**Endpoint:** `PUT /api/support/tickets/:id`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "subject": "Updated subject (optional)",
  "message": "Updated message (optional)",
  "priority": "high" // optional: low, medium, high, urgent
}
```

**Response:**
```json
{
  "ticket": {
    "id": 123,
    "user_id": 1,
    "subject": "Updated subject",
    "message": "Updated message",
    "status": "open",
    "priority": "high",
    "admin_response": null,
    "admin_id": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T01:00:00.000Z"
  }
}
```

**Errors:**
- `404` - Ticket not found
- `400` - Can only update open or in-progress tickets
- `400` - Cannot update ticket after admin response
- `400` - No fields to update

### Admin Update Response

**Endpoint:** `PUT /api/admin/support/tickets/:id/response`

**Headers:**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "response": "Updated admin response"
}
```

**Response:**
```json
{
  "ticket": {
    "id": 123,
    "user_id": 1,
    "subject": "Support Request",
    "message": "User message",
    "status": "in_progress",
    "priority": "medium",
    "admin_response": "Updated admin response",
    "admin_id": 2,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T01:00:00.000Z"
  }
}
```

### Admin Update Status

**Endpoint:** `PUT /api/admin/support/tickets/:id/status`

**Request Body:**
```json
{
  "status": "resolved" // open, in_progress, resolved, closed
}
```

### Admin Update Priority

**Endpoint:** `PUT /api/admin/support/tickets/:id/priority`

**Request Body:**
```json
{
  "priority": "urgent" // low, medium, high, urgent
}
```

## Security

- Users can only update their own tickets
- Users can only update tickets that are open or in_progress
- Users cannot update tickets after admin response
- Admins can update any ticket
- All endpoints require authentication
- Admin endpoints require admin role

## Testing

To test the update functionality:

1. **Create a ticket as a user:**
   ```bash
   POST /api/support/tickets
   ```

2. **Update the ticket as a user:**
   ```bash
   PUT /api/support/tickets/:id
   ```

3. **Respond as an admin:**
   ```bash
   POST /api/admin/support/tickets/:id/respond
   ```

4. **Update the response as an admin:**
   ```bash
   PUT /api/admin/support/tickets/:id/response
   ```

5. **Update status as an admin:**
   ```bash
   PUT /api/admin/support/tickets/:id/status
   ```

## Notes

- The migration is idempotent (safe to run multiple times)
- Updates automatically set the `updated_at` timestamp
- All update operations are logged in the database
- The migration can be rolled back if needed (see MIGRATION_GUIDE.md)

