# Story 2.2: Permissions & Admin Feature

Status: done

---

## Story

As an admin,
I want to manage users and delete inappropriate messages,
so that I can keep the chat clean and secure.

## Acceptance Criteria

1. [AC1] User role is default for all new users ✅
2. [AC2] Admin role can be assigned to specific users ✅
3. [AC3] All users can view the user list ✅
4. [AC4] Only Admin can delete any message ✅
5. [AC5] Only Admin can add/remove users ✅
6. [AC6] Admin badge displayed next to admin users ✅

## Tasks / Subtasks

- [x] Task 1: Database & Backend (AC: 1-5)
  - [x] 1.1 Verify role column exists in users table
  - [x] 1.2 Create admin API endpoints: list users, delete user
  - [x] 1.3 Create message deletion endpoint (admin only)
  - [x] 1.4 Add middleware for admin-only routes
- [x] Task 2: Frontend - Admin UI (AC: 3,5,6)
  - [x] 2.1 Add role badge to user list
  - [x] 2.2 Create Admin panel page
  - [x] 2.3 Add user management UI (add/remove)
  - [x] 2.4 Add message delete option for admins
- [x] Task 3: Testing & Validation (AC: All)
  - [x] 3.1 Test role assignment
  - [x] 3.2 Test admin-only routes protection

---

## Dev Notes

### Technical Specifications

**Database:**
- Role column already exists in users table (default: 'user')
- Admin role: 'admin'

**API Endpoints:**
- `GET /api/users` - Get all users (all roles can access)
- `DELETE /api/users/:id` - Delete user (admin only)
- `DELETE /api/messages/:id` - Delete message (admin only)
- `PATCH /api/users/:id/role` - Update user role (admin only)

**Frontend Components:**
- Admin badge in UsersPage
- AdminPage.jsx - Admin panel at /admin route
- Admin button in Header (only for admin users)

---

## Dev Agent Record

### Completion Notes List

- Implemented FR8 Permissions & Admin feature
- Backend API supports admin delete user, update role
- Admin can access /admin route to manage users
- Admin can add/remove users and change user roles
- Admin badge shown next to admin users in user list
- Admin button (⚙️) shown in header only for admin users

### File List

- `server/src/routes/users.js` - Added admin endpoints
- `server/src/routes/messages.js` - Fixed admin delete check
- `client/src/utils/api.js` - Added admin API functions
- `client/src/pages/AdminPage.jsx` - New Admin page
- `client/src/pages/AdminPage.css` - Admin page styles
- `client/src/pages/UsersPage.jsx` - Added admin badge
- `client/src/pages/UsersPage.css` - Badge styles
- `client/src/components/Header/Header.jsx` - Admin button
- `client/src/components/Header/Header.css` - Admin button styles
- `client/src/App.jsx` - Added /admin route

