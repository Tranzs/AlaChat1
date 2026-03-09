# Story 2.1: Reactions Feature

Status: done

---

## Review Findings (Fixed)

### Issues Fixed from Code Review:

1. **HIGH - Duplicate API calls**: Removed duplicate API call in ChatPage.jsx - socket now handles persistence
2. **HIGH - No tests exist**: Created unit tests (7 tests passing)
3. **MEDIUM - Long press conflicts with scroll**: Added dedicated reaction button next to each message
4. **MEDIUM - No input validation**: Added integer validation and emoji validation in socket handler
5. **MEDIUM - Race condition**: Optimized reaction update to update local state without API call
6. **LOW - Click behavior**: Fixed toggle behavior with dedicated button

---

## Story

As a user,
I want to react to messages with emoji reactions,
so that I can quickly express my feelings without typing a reply.

## Acceptance Criteria

1. [AC1] User can tap/click on any message to open reaction menu
2. [AC2] User can select from 5 reactions: ❤️ 😂 😮 😢 👍
3. [AC3] Selected reaction appears below the message
4. [AC4] Multiple users can add reactions to the same message
5. [AC5] User can see who added which reaction (tooltip/hover)
6. [AC6] User can remove their own reaction by tapping it again
7. [AC7] Reactions update in real-time for both sender and receiver

## Tasks / Subtasks

- [x] Task 1: Database Schema Update (AC: 1-7)
  - [x] 1.1 Add reactions table to SQLite database
  - [x] 1.2 Create database initialization script
- [x] Task 2: Backend API Development (AC: 1,2,6)
  - [x] 2.1 Create reactions route: GET /api/reactions/:messageId
  - [x] 2.2 Create reactions route: POST /api/reactions
  - [x] 2.3 Create reactions route: DELETE /api/reactions/:id
  - [x] 2.4 Add socket events for real-time reactions
- [x] Task 3: Frontend - Reaction UI Components (AC: 1,2)
  - [x] 3.1 Create ReactionPicker component (popup menu)
  - [x] 3.2 Update MessageBubble to show reactions
- [x] Task 4: Frontend - Integration (AC: 3,4,5,6,7)
  - [x] 4.1 Add reaction logic to ChatPage
  - [x] 4.2 Handle real-time reaction updates
  - [x] 4.3 Add API calls for reactions
- [x] Task 5: Testing & Validation (AC: All)
  - [x] 5.1 Test reaction creation
  - [x] 5.2 Test reaction display
  - [x] 5.3 Test reaction removal
  - [x] 5.4 Test real-time sync

## Dev Notes

### Technical Specifications

**Reactions Table Schema:**
```sql
CREATE TABLE reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(message_id, user_id, emoji)
);
```

**API Endpoints:**
- `GET /api/reactions/:messageId` - Get all reactions for a message
- `POST /api/reactions` - Add reaction (body: { messageId, userId, emoji })
- `DELETE /api/reactions/:id` - Remove reaction

**Socket Events:**
- `new_reaction` - Broadcast when reaction added
- `reaction_removed` - Broadcast when reaction removed

**Frontend Components:**
- `ReactionPicker` - Popup with 5 emoji buttons
- Update `MessageBubble` - Add reaction display area

### Project Structure

- Backend: `server/src/routes/reactions.js` (new)
- Backend: `server/src/db/index.js` - Add reactions table
- Backend: `server/src/socket/handlers.js` - Add reaction events
- Frontend: `client/src/components/ReactionPicker/` (new)
- Frontend: Update `client/src/pages/ChatPage.jsx`

### References

- Source: _bmad-output/brainstorming/PRD-AlaChat-v1.0.md#FR6
- Source: _bmad-output/planning-artifacts/architecture.md#Database-Schema

---

## Dev Agent Record

### Agent Model Used

OpenCode AI - Big Pickle

### Debug Log References

### Completion Notes List

- Implemented FR6 Reactions feature with all acceptance criteria
- Database schema updated with reactions table
- Backend API supports GET, POST, DELETE operations for reactions
- Socket events for real-time reaction updates (add/remove)
- Frontend ReactionPicker component with 5 emoji options: ❤️ 😂 😮 😢 👍
- Reactions displayed below messages with user count
- Toggle reaction: tap same emoji to remove reaction
- Real-time sync between chat participants
- **Code Review Fixes:**
  - Removed duplicate API calls (socket handles persistence)
  - Added dedicated reaction button to avoid scroll conflicts
  - Added input validation in socket handler
  - Optimized reaction updates (no API call needed)
  - Added unit tests (7 tests passing)

### File List

- `server/src/db/index.js` - Added reactions table to database schema
- `server/src/routes/reactions.js` - New API routes for reactions
- `server/src/routes/reactions.test.js` - New unit tests
- `server/src/index.js` - Registered reactions route
- `server/src/socket/handlers.js` - Added socket events for real-time reactions
- `client/src/utils/api.js` - Added reactions API functions
- `client/src/utils/emojiMap.test.js` - New unit tests
- `client/src/context/SocketContext.jsx` - Added sendReaction function
- `client/src/components/ReactionPicker/ReactionPicker.jsx` - New ReactionPicker component
- `client/src/components/ReactionPicker/ReactionPicker.css` - New ReactionPicker styles
- `client/src/pages/ChatPage.jsx` - Integrated reactions in chat
- `client/src/pages/ChatPage.css` - Added reaction styles
- `client/package.json` - Added vitest dependencies and test scripts

