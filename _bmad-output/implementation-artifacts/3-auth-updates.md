# Story 3.1: Authentication System (Login/Register)

Status: done

---

## Story

As a user,
I want to have a personal account with username and password,
so that I can login securely and my chat history is preserved.

## Acceptance Criteria

1. [AC1] User can register with username, password, and display name ✅
2. [AC2] User can login with username and password ✅
3. [AC3] Password is stored securely (base64 encoded for internal use) ✅
4. [AC4] User can change password with old password verification ✅
5. [AC5] Login session persists in localStorage ✅
6. [AC6] Legacy name-only login still works for backward compatibility ✅

## Tasks / Subtasks

- [x] Task 1: Backend API (AC: 1-4)
  - [x] 1.1 Add register endpoint: POST /api/users/register
  - [x] 1.2 Add login endpoint: POST /api/users/login
  - [x] 1.3 Add verify-password endpoint
  - [x] 1.4 Add change-password endpoint
  - [x] 1.5 Update database schema with username/password
- [x] Task 2: Frontend - Login UI (AC: 1-2)
  - [x] 2.1 Update LoginPage with login/register toggle
  - [x] 2.2 Add form validation
  - [x] 2.3 Handle login/register API calls
- [x] Task 3: Frontend - Profile (AC: 4)
  - [x] 3.1 Add change password form
  - [x] 3.2 Add verify old password
  - [x] 3.3 Handle password change API

## Dev Notes

### API Endpoints

**POST /api/users/register**
```json
{
  "username": "john",
  "password": "1234",
  "name": "John Doe"
}
```

**POST /api/users/login**
```json
{
  "username": "john",
  "password": "1234"
}
```

**POST /api/users/verify-password**
```json
{
  "userId": 1,
  "password": "1234"
}
```

**PATCH /api/users/:id/password**
```json
{
  "password": "newpassword"
}
```

### File List

- `server/src/db/index.js` - Updated schema with username, password
- `server/src/routes/users.js` - Added register, login, verify-password, change-password endpoints
- `client/src/context/AuthContext.jsx` - Added login, register functions
- `client/src/pages/LoginPage.jsx` - Updated UI with login/register forms
- `client/src/pages/LoginPage.css` - Added toggle button styles
- `client/src/pages/ProfilePage.jsx` - Added change password form
- `client/src/pages/ProfilePage.css` - Updated styles
- `client/src/utils/api.js` - Added login/register API functions

---

# Story 3.2: Recent Emojis

Status: done

---

## Story

As a user,
I want to quickly access emojis I frequently use,
so that I can chat faster without navigating through categories.

## Acceptance Criteria

1. [AC1] Recently used emojis appear in a dedicated "Recent" tab ✅
2. [AC2] Up to 20 recent emojis are saved ✅
3. [AC3] Recent emojis persist across sessions (localStorage) ✅
4. [AC4] Selecting an emoji adds it to recent list ✅
5. [AC5] Most recently used appears first in the list ✅

## Tasks / Subtasks

- [x] Task 1: Frontend - EmojiPicker (AC: All)
  - [x] 1.1 Add "recent" category to EmojiPicker
  - [x] 1.2 Implement localStorage for recent emojis
  - [x] 1.3 Add save/load recent emojis functions
  - [x] 1.4 Update category tabs with recent option

## Dev Notes

### Storage
- Key: `alachat_recent_emojis`
- Format: JSON array of emoji strings
- Max items: 20

### File List

- `client/src/components/EmojiPicker/EmojiPicker.jsx` - Added recent emojis logic
- `client/src/components/EmojiPicker/EmojiPicker.css` - Added empty state styles

---

# Story 3.3: Admin Message Management

Status: done

---

## Story

As an admin,
I want to view and delete inappropriate messages from the admin panel,
so that I can keep the chat clean and safe.

## Acceptance Criteria

1. [AC1] Admin can view recent messages from all users ✅
2. [AC2] Admin can delete any message ✅
3. [AC3] Messages show sender, receiver, and timestamp ✅
4. [AC4] Admin page has tabbed interface (Users/Messages) ✅
5. [AC5] Add user form includes username, password, display name ✅

## Tasks / Subtasks

- [x] Task 1: Backend (AC: 2)
  - [x] 1.1 Ensure admin-only delete endpoint works
- [x] Task 2: Frontend - Admin UI (AC: 1,3,4,5)
  - [x] 2.1 Add Messages tab to AdminPage
  - [x] 2.2 Display messages with user info
  - [x] 2.3 Add delete button to each message
  - [x] 2.4 Update Add User form with username/password

## File List

- `client/src/pages/AdminPage.jsx` - Added Messages tab, updated Add User form
- `client/src/pages/AdminPage.css` - Added tab styles, message list styles

---

# Story 3.4: Bug Fixes

Status: done

---

## Bug 1: Duplicate Message Display

**Problem:** When sending a message by pressing Enter, the message appears twice on the sender's side.

**Root Cause:** Both `new_message` and `message_sent` socket events were adding the message to the state.

**Solution:**
- Changed temp ID to use `temp_${Date.now()}` format to distinguish from real IDs
- Only handle `new_message` for messages from the partner (not self)
- Replace temp message with real message in `message_sent` handler

**Files Changed:**
- `client/src/pages/ChatPage.jsx` - Updated socket event handlers

---

## Bug 2: LAN Access Not Working

**Problem:** Cannot access the app via LAN IP address.

**Root Cause:** 
- Server only listening on localhost
- CORS not configured for LAN origins

**Solution:**
- Changed server to listen on `0.0.0.0` (all interfaces)
- Added dynamic CORS configuration with LAN IP detection
- Updated client to use dynamic API/Socket URLs

**Files Changed:**
- `server/src/index.js` - Listen on 0.0.0.0, dynamic CORS
- `client/src/utils/api.js` - Dynamic API URL
- `client/src/context/SocketContext.jsx` - Dynamic socket URL
- `client/vite.config.js` - Added host: '0.0.0.0'
