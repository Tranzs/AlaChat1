---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: ["_bmad-output/brainstorming/PRD-AlaChat-v1.0.md", "_bmad-output/brainstorming/brainstorming-session-2026-03-07-000000.md", "_bmad-output/planning-artifacts/ux-design.md", "_bmad-output/planning-artifacts/research.md", "_bmad-output/planning-artifacts/project-context.md"]
workflowType: 'architecture'
project_name: 'AlaChat'
user_name: 'Tranz'
date: '2026-03-07'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## Architecture Decisions Summary

### Tech Stack (Đã xác nhận)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React.js 18+ | Phổ biến, nhiều tài liệu, dễ tuyển dụng |
| **State Management** | React Context API | Đơn giản, không cần thêm thư viện, đủ cho 10 users |
| **Backend** | Node.js 18+ | JavaScript full-stack |
| **Framework** | Express.js 4+ | Nhẹ, linh hoạt |
| **Real-time** | Socket.io 4+ | Thư viện chuyên cho real-time |
| **Database** | SQLite3 | File-based, không cần cài server |
| **Styling** | CSS Modules | scoped styles, không cần thêm framework |
| **Build Tool** | Vite | Nhanh, hiện đại |

### Key Architectural Decisions

| Decision | Choice | Justification |
|----------|--------|---------------|
| **Frontend Framework** | React | Phổ biến nhất, ecosystem lớn |
| **State Management** | Context API + useReducer | Đủ cho quy mô 10 users |
| **Real-time** | Socket.io | WebSocket with fallback, auto-reconnect |
| **Database** | SQLite | Đơn giản, portable, backup dễ |
| **Project Structure** | Monorepo (client + server) | Dễ quản lý |

### Database Schema (from PRD)

```sql
-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME
);

-- Messages table
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0,
    delete_at DATETIME,
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id)
);
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Tạo user mới |
| GET | `/api/users` | Lấy danh sách user |
| GET | `/api/users/:id` | Lấy thông tin user |
| PUT | `/api/users/:id` | Cập nhật user |
| GET | `/api/messages/:userId` | Lấy tin nhắn với user |
| GET | `/api/chats` | Lấy danh sách chat |

### Socket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `connect` | Client → Server | `{ userId }` |
| `disconnect` | Client → Server | - |
| `message` | Client ↔ Server | `{ toUserId, content, timestamp }` |
| `typing` | Client ↔ Server | `{ toUserId }` |

---

## Project Structure

```
alachat/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ChatList/
│   │   │   ├── ChatWindow/
│   │   │   ├── MessageBubble/
│   │   │   ├── EmojiPicker/
│   │   │   ├── UserItem/
│   │   │   └── ThemeToggle/
│   │   ├── pages/              # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ChatListPage.jsx
│   │   │   ├── UsersPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── context/            # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ChatContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── useSocket.js
│   │   │   └── useChat.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── emojiMap.js
│   │   │   └── api.js
│   │   ├── styles/             # CSS files
│   │   │   ├── global.css
│   │   │   ├── themes.css
│   │   │   └── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js Backend
│   ├── src/
│   │   ├── index.js            # Entry point
│   │   ├── routes/
│   │   │   ├── users.js
│   │   │   └── messages.js
│   │   ├── socket/
│   │   │   └── handlers.js
│   │   ├── db/
│   │   │   ├── index.js       # Database connection
│   │   │   └── init.js        # Schema initialization
│   │   └── utils/
│   ├── database.sqlite
│   └── package.json
│
├── package.json                 # Root scripts
└── README.md
```

---

## Security & Deployment

| Aspect | Decision |
|--------|----------|
| **Network** | Local network only (LAN) |
| **CORS** | Configure for local development |
| **No Auth** | Simple username-based (internal use) |
| **Data** | No encryption (internal) |

---

## Next Steps

- [ ] Review UX Design document
- [ ] Review Research document  
- [ ] Review Project Context document
- [ ] Proceed to Step 2: Context Analysis

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- 30+ FRs organized into 8 categories:
  - FR1: User Authentication & Profile (4 requirements)
  - FR2: Chat 1-1 Real-time (7 requirements)
  - FR3: Chat List (5 requirements)
  - FR4: Search & Find Users (3 requirements)
  - FR5: Emoji Support (4 requirements)
  - FR6: Reactions (3 requirements)
  - FR7: Theme & UI (6 requirements)
  - FR8: Permissions (5 requirements)

**Non-Functional Requirements:**
- Performance: < 2s load, < 100ms message latency
- Scalability: 10 users, 30-day message retention
- Security: LAN only, no encryption needed
- Compatibility: Modern browsers, mobile support

### Scale & Complexity

- **Primary domain:** Full-stack Web Application
- **Complexity level:** Low-Medium (MVP)
- **Estimated architectural components:** 15-20

### Technical Constraints & Dependencies

- Single server deployment (Node.js + Express)
- SQLite database (file-based)
- Socket.io for real-time
- React Context API for state
- No external dependencies (LAN only)

### Cross-Cutting Concerns Identified

1. **State Management:** Auth, Chat, Theme cần global state
2. **Real-time Sync:** Socket connection management
3. **Error Handling:** Network errors, disconnections
4. **Theme System:** CSS variables for light/dark
5. **Message Handling:** Optimistic UI updates

---

## Starter Template Evaluation

### Primary Technology Domain
- **Domain:** Full-stack Web Application (React + Node.js)
- **Build Tool:** Vite (recommended for React in 2026)

### Starter Options Considered

1. **Vite + React (Official)**
   - ✅ Fast HMR, modern tooling
   - ✅ TypeScript available
   - ✅ Best React ecosystem support

2. **Vite-Express-Template (GitHub)**
   - ⚠️ Has frontend + backend structure
   - ⚠️ Need to add SQLite manually

3. **Socket.io Official Chat**
   - ❌ Just a demo, not production-ready

### Selected Approach: Vite + Manual Backend Setup

**Rationale:**
- Vite is the standard for React in 2026
- Manual backend setup gives full control
- SQLite + Socket.io need custom configuration

**Initialization Commands:**

```bash
# Frontend
npm create vite@latest client -- --template react
cd client
npm install socket.io-client

# Backend
mkdir server
cd server
npm init -y
npm install express socket.io sqlite3 cors
```

**Architectural Decisions Provided:**

- **Build Tool:** Vite (fast HMR, optimized builds)
- **Frontend:** React 18+ with Vite
- **Backend:** Express.js standalone
- **Real-time:** Socket.io (manual integration)
- **Database:** SQLite (manual setup)

---

## Core Architectural Decisions

### 1. API Design Pattern
- **Decision:** REST API
- **Rationale:** Đơn giản, phù hợp với quy mô 10 users, dễ implement

### 2. Error Handling Strategy
- **Decision:** Express Middleware
- **Rationale:** Centralized error handling, dễ debug và maintain

### 3. Environment Configuration
- **Decision:** .env files
- **Rationale:** Best practice, tách config khỏi code, dễ thay đổi

### 4. CORS Configuration
- **Decision:** Specific origins (localhost, LAN IP)
- **Rationale:** Bảo mật hơn cho internal use

### 5. Project Organization
- **Decision:** Layer-based structure
- **Rationale:** Dễ maintain, clear separation of concerns

### 6. Message Handling
- **Decision:** Optimistic UI with Socket.io
- **Rationale:** Instant feedback, tăng trải nghiệm user

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Database schema ✅ (SQLite)
- API endpoints ✅ (REST)
- Socket events ✅ (Socket.io)

**Important Decisions (Shape Architecture):**
- State management ✅ (Context API)
- Error handling ✅ (Middleware)
- Environment config ✅ (.env)

**Deferred Decisions (Post-MVP):**
- File upload
- Group chat
- Push notifications

---

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database:**
- Tables: `snake_case` plural (users, messages)
- Columns: `snake_case` (user_id, created_at)
- Foreign keys: `table_id` (user_id, message_id)

**API:**
- Endpoints: `/api/users`, `/api/messages`
- Route params: `:user_id`
- JSON fields: `snake_case`

**Code:**
- Components: PascalCase (ChatList)
- Files: kebab-case (chat-list.jsx)
- Functions: camelCase (getUserData)
- Constants: UPPER_SNAKE_CASE

### Format Patterns

**API Response (Success):**
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

**API Response (Error):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

**Date Format:**
- API: ISO 8601 ("2026-03-07T10:30:00Z")
- UI: Localized format (DD/MM/YYYY HH:mm)

### Communication Patterns

**Socket Events:**
- Event names: `snake_case` (new_message, user_typing)
- Payload: `{ userId, content, timestamp }`

**State Management:**
- State updates: Immutable patterns
- Action names: `camelCase` (setUser, addMessage)

### Process Patterns

**Error Handling:**
- Use try-catch in async functions
- Central error middleware in Express
- Toast notifications for user-facing errors

**Loading States:**
- Local state with `isLoading` prefix
- Disable buttons during submission
- Show skeleton loaders for list data

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow snake_case for database/API
- Follow camelCase for JavaScript code
- Use PascalCase for React components
- Return consistent API response format
- Handle errors with try-catch
- Use CSS Modules for styling
