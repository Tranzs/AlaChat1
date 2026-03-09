# Research Document

## AlaChat - Technical Research & Analysis

---

## 1. Tech Stack Research

### 1.1 Frontend Framework Comparison

| Criteria | React | Vue | Angular |
|----------|-------|-----|---------|
| **Popularity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Learning Curve** | Medium | Easy | Steep |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **State Management** | Context, Redux | Pinia, Vuex | Built-in |
| **Ecosystem** | Largest | Large | Medium |
| **Job Market** | Highest | High | Medium |
| **Dev Tools** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Winner for AlaChat:** **React.js**
- Phổ biến nhất
- Nhiều tài liệu hơn
- Dễ tìm help khi gặp vấn đề

### 1.2 Real-time Library Comparison

| Library | Pros | Cons | Best For |
|---------|------|------|----------|
| **Socket.io** | Auto-reconnect, Fallback, Rooms | Slightly larger bundle | Chat apps ⭐ |
| **ws** | Lightweight, Fast | Manual implementation | Experienced devs |
| **SockJS** | Fallback, Similar to Socket | Less maintained | Enterprise |
| **Firebase** | Managed, Easy | Vendor lock-in | Quick MVP |

**Winner for AlaChat:** **Socket.io**
- Tự xử lý reconnect
- Hỗ trợ rooms cho multi-chat
- Dễ sử dụng nhất

### 1.3 Database Comparison

| Database | Type | Pros | Cons | Best For |
|----------|------|------|------|----------|
| **SQLite** | SQL | No setup, Portable, Fast | Single user write | 10-100 users ⭐ |
| **MongoDB** | NoSQL | Flexible, JSON | More complex | Large scale |
| **PostgreSQL** | SQL | Robust, ACID | Needs setup | Enterprise |
| **Redis** | In-memory | Super fast | Volatile | Caching |

**Winner for AlaChat:** **SQLite**
- Không cần cài đặt server
- File-based - easy backup
- Đủ cho 10 users

### 1.4 Styling Approach Comparison

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **CSS Modules** | Scoped, No conflicts | Manual | AlaChat ⭐ |
| **Styled Components** | Dynamic, CSS-in-JS | Runtime overhead | Large apps |
| **Tailwind** | Fast development | Learning curve | Rapid dev |
| **SASS** | Variables, Nesting | Preprocessor needed | Traditional |

**Winner for AlaChat:** **CSS Modules**
- Scoped styles mặc định
- Không cần thêm thư viện
- Dễ maintain

---

## 2. Best Practices Research

### 2.1 Chat App Best Practices

| Practice | Description |
|----------|-------------|
| **Optimistic UI** | Hiển thị tin nhắn ngay lập tức trước khi server xác nhận |
| **Lazy Loading** | Load tin nhắn theo batch (20-50 tin/lần) |
| **Debounce Search** | Chờ 300ms sau khi gõ xong mới search |
| **Reconnect Strategy** | Socket.io tự reconnect, hiển thị trạng thái |
| **Message Queue** | Queue tin nhắn khi offline, gửi khi online |

### 2.2 React Best Practices

| Practice | Implementation |
|----------|----------------|
| **Functional Components** | Use only, no class components |
| **Hooks** | useState, useEffect, useContext, useReducer |
| **Custom Hooks** | Extract logic thành hooks (useSocket, useChat) |
| **Memo** | Memoize expensive computations |
| **Error Boundaries** | Wrap components to catch errors |

### 2.3 Security Best Practices

| Practice | Implementation |
|----------|----------------|
| **Input Sanitization** | Validate & sanitize all user input |
| **XSS Prevention** | React tự escape, cẩn thận với dangerouslySetInnerHTML |
| **CORS** | Configure for specific origins only |
| **Rate Limiting** | Limit API calls per user |

---

## 3. Performance Optimization

### 3.1 Frontend Performance

| Technique | Description | Impact |
|----------|-------------|--------|
| **Code Splitting** | Lazy load routes | High |
| **Memoization** | useMemo, useCallback | Medium |
| **Virtual List** | Render only visible items | High (long lists) |
| **Image Optimization** | Compress avatars | Low-Medium |
| **Bundle Size** | Keep under 200KB | Medium |

### 3.2 Backend Performance

| Technique | Description | Impact |
|----------|-------------|--------|
| **Indexing** | Index user_id, timestamp | High |
| **Query Optimization** | Select only needed fields | Medium |
| **Connection Pool** | SQLite doesn't need (single file) | N/A |
| **Caching** | Cache user list | Low-Medium |

---

## 4. Socket.io Deep Dive

### 4.1 Events Flow

```
Client                          Server
  │                               │
  │──── connect(userId) ────────►│
  │                               │
  │◄─── connect ACK + status ────│
  │                               │
  │──── message({to, content})──►│
  │                               │──► Save to DB
  │                               │──► Emit to recipient
  │◄──── message ACK + id ───────│
  │                               │
  │◄───── new_message ───────────│ (to recipient)
  │                               │
```

### 4.2 Room Management

```javascript
// Join personal room for direct messages
socket.join(`user_${userId}`);

// Join conversation rooms
socket.join(`chat_${chatId}`);

// Send to specific user
io.to(`user_${recipientId}`).emit('message', msg);

// Send to room
io.to(`chat_${chatId}`).emit('message', msg);
```

---

## 5. Emoji Auto-convert Implementation

### 5.1 Mapping Strategy

```javascript
const emojiMap = {
  ':)': '😊',
  ':(': '☹️',
  // ... more mappings
};

// Simple replace
function convertToEmoji(text) {
  let result = text;
  for (const [pattern, emoji] of Object.entries(emojiMap)) {
    result = result.replace(new RegExp(pattern, 'g'), emoji);
  }
  return result;
}
```

### 5.2 Considerations

| Aspect | Consideration |
|--------|---------------|
| **Performance** | Regex is fast enough for short messages |
| **Edge Cases** | Handle partial matches, escape special chars |
| **User Experience** | Convert on send OR on display (display is better) |
| **Emoji Picker** | Show picker overlay on button click |

---

## 6. State Management Strategy

### 6.1 React Context for AlaChat

| Context | Purpose | State |
|---------|---------|-------|
| **AuthContext** | User authentication | user, setUser, logout |
| **ChatContext** | Messages, conversations | messages, chats, sendMessage |
| **ThemeContext** | Light/Dark mode | theme, toggleTheme |

### 6.2 When to Use Context

```javascript
// Use useState for:
// - Component-local state
// - Frequently changing state in one component

// Use Context for:
// - Global state (user, theme)
// - State needed by many components
// - Avoid prop drilling
```

---

## 7. Error Handling

### 7.1 Error Types

| Error Type | Handling |
|------------|----------|
| **Network Error** | Show toast, retry button |
| **Socket Disconnect** | Show banner, auto-reconnect |
| **Validation Error** | Show inline error message |
| **Server Error** | Show generic error toast |

### 7.2 Error Boundaries

```javascript
// Wrap App with Error Boundary
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

---

## 8. File Structure Rationale

### 8.1 Why This Structure?

```
client/
├── src/
│   ├── components/    # Reusable UI pieces
│   ├── pages/         # Route components
│   ├── context/       # Global state
│   ├── hooks/         # Custom logic
│   ├── utils/        # Helpers
│   └── styles/       # CSS
```

| Folder | Purpose |
|--------|---------|
| **components** | Reusable: Button, Input, Avatar, MessageBubble |
| **pages** | Route views: Login, ChatList, Chat |
| **context** | Global state: Auth, Chat, Theme |
| **hooks** | Logic reuse: useSocket, useChat |
| **utils** | Helpers: emojiMap, api client |
| **styles** | Global CSS, themes |

---

## 9. Testing Strategy

### 9.1 Testing Levels

| Level | Tool | Coverage Target |
|-------|------|-----------------|
| **Unit** | Jest | 70% |
| **Integration** | Jest + React Testing Library | 50% |
| **E2E** | Playwright | Critical paths |

### 9.2 Critical Paths to Test

| Path | Description |
|------|-------------|
| Login | User enters name → Created → Redirected |
| Send Message | Type → Send → Appears → Received |
| Theme Toggle | Click → Changes → Persists |

---

## 10. References & Resources

### 10.1 Official Documentation

| Resource | URL |
|----------|-----|
| React | https://react.dev |
| Socket.io | https://socket.io/docs/ |
| SQLite | https://www.sqlite.org/docs.html |
| Express | https://expressjs.com/ |

### 10.2 Learning Resources

| Resource | Description |
|----------|-------------|
| Socket.io Chat Tutorial | Official chat tutorial |
| React Hooks Docs | Hooks patterns |
| CSS Modules | Scoped styling |

---

## 11. Decision Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend | React | Popular, ecosystem |
| Real-time | Socket.io | Easy, reliable |
| Database | SQLite | Simple, portable |
| Styling | CSS Modules | Scoped, no deps |
| State | Context API | Built-in, sufficient |
| Build | Vite | Fast, modern |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-------------|
| **Socket disconnect** | Medium | Auto-reconnect + status indicator |
| **Large message history** | Low | Lazy load + pagination |
| **Browser compatibility** | Low | Test in major browsers |
| **Data loss** | High | Regular SQLite backup |
