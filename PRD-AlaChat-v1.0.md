# Product Requirements Document (PRD)
# AlaChat - Internal Real-time Chat Application

---

## 1. Product Overview

### 1.1 Product Name
**AlaChat** - Internal Real-time Chat Application

### 1.2 Product Type
Web Application (PWA-ready)

### 1.3 Core Summary
Ứng dụng web chat real-time chạy trên mạng nội bộ, cho phép 10 người dùng chat 1-1 với nhau một cách nhanh chóng và vui nhộn với tính năng auto-convert text thành emoji.

### 1.4 Target Users
- Nhân viên trong công ty (10 người)
- Sử dụng trên mạng nội bộ (LAN)
- Ưu tiên sử dụng trên điện thoại di động

### 1.5 Problem Statement
Hiện tại công ty thiếu một công cụ giao tiếp nội bộ nhanh chóng, nhẹ và không cần kết nối internet. Nhân viên cần một ứng dụng chat đơn giản, dễ sử dụng để trao đổi công việc hàng ngày.

### 1.6 Solution
AlaChat - ứng dụng chat real-time chạy trên local server, không cần internet, giao diện tối giản, hỗ trợ emoji và auto-convert text → emoji.

---

## 2. User Personas

### 2.1 User Persona: Nhân viên thường (User)

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên** | Người dùng A |
| **Vai trò** | User |
| **Mục đích sử dụng** | Chat nhanh với đồng nghiệp, trao đổi công việc |
| **Thiết bị ưa thích** | Smartphone |
| **Mức độ kỹ thuật** | Trung bình |
| **Nhu cầu** | Gửi tin nhanh, xem lịch sử chat, đổi avatar/tên |

### 2.2 User Persona: Quản lý (Admin)

| Thuộc tính | Mô tả |
|------------|-------|
| **Tên** | Quản lý B |
| **Vai trò** | Admin |
| **Mục đích sử dụng** | Quản lý users, giám sát chat |
| **Thiết bị ưa thích** | Laptop/Desktop |
| **Mức độ kỹ thuật** | Trung bình |
| **Nhu cầu** | Thêm/xóa user, xóa tin nhắn vi phạm |

---

## 3. Functional Requirements

### 3.1 FR1: User Authentication & Profile

| ID | Requirement | Priority | Mô tả chi tiết |
|----|-------------|----------|----------------|
| FR1.1 | Đặt tên user | P0 | User nhập tên khi đăng nhập lần đầu |
| FR1.2 | Upload avatar | P1 | User có thể upload ảnh đại diện (jpg, png, max 2MB) |
| FR1.3 | Chỉnh sửa profile | P1 | User có thể đổi tên và avatar |
| FR1.4 | Danh sách user | P0 | Hiển thị danh sách tất cả user đang có trong hệ thống |

### 3.2 FR2: Chat 1-1 Real-time

| ID | Requirement | Priority | Mô tả chi tiết |
|----|-------------|----------|----------------|
| FR2.1 | Gửi tin nhắn | P0 | Gửi tin nhắn text real-time đến user khác |
| FR2.2 | Nhận tin nhắn | P0 | Nhận tin nhắn real-time không cần refresh |
| FR2.3 | Hiển thị tin nhắn | P0 | Hiển thị tin nhắn theo thứ tự thời gian |
| FR2.4 | Tin nhắn của tôi | P0 | Tin nhắn gửi đi hiển bên phải |
| FR2.5 | Tin nhắn người khác | P0 | Tin nhắn nhận được hiển bên trái |
| FR2.6 | Timestamp | P0 | Hiển thị thời gian gửi tin nhắn |
| FR2.7 | Xem ai đang chat | P0 | Biết được đang chat với ai |

### 3.3 FR3: Chat List

| ID | Requirement | Priority | Mô tả chi tiết |
|----|-------------|----------|----------------|
| FR3.1 | Danh sách chat | P0 | Hiển thị danh sách các cuộc trò chuyện |
| FR3.2 | Xem tin mới nhất | P0 | Hiển thị tin nhắn mới nhất trong mỗi cuộc chat |
| FR3.3 | Thời gian tin mới | P0 | Hiển thị thời gian tin nhắn mới nhất |
| FR3.4 | Avatar trong list | P1 | Hiển thị avatar người chat trong list |
| FR3.5 | Sắp xếp mới nhất | P0 | Sắp xếp cuộc chat theo tin mới nhất |

### 3.4 FR4: Search & Find Users

| ID | Requirement | Priority | Mô tả chi tiết |
|----|-------------|----------|----------------|
| FR4.1 | Tìm kiếm user | P0 | Tìm user theo tên |
| FR4.2 | Danh sách user online | P0 | Hiển thị user đang online |
| FR4.3 | Bắt đầu chat mới | P0 | Chọn user để bắt đầu cuộc chat mới |

### 3.5 FR5: Emoji Support

| ID | Requirement | Priority | Mô tả chi tiết |
|----|-------------|----------|----------------|
| FR5.1 | Emoji picker | P1 | Popup nhỏ gọn chọn emoji |
| FR5.2 | Categories | P1 | Các category: Smileys, Animals, Food, Activities |
| FR5.3 | Recent emojis | P2 | Lưu emoji hay dùng |
| FR5.4 | Auto-convert | P1 | Tự động chuyển text thành emoji |

**Emoji Mapping Dictionary:**
```
:) → 😊  :( → ☹️  :D → 😄  :P → 😛  >.< → 😝
T.T → 😭  T_T → 😭  :'( → 😢  T_T → 😭
<3 → ❤️  :* → 😘  ;) → 😉  -_- → 😑
^.^ → 😊  ^_^ → 😊  -3- → 😻  xD → 😆
```

### 3.6 FR6: Reactions

| ID | Requirement | Priority | Mô tả chi tiết |
|----|-------------|----------|----------------|
| FR6.1 | React tin nhắn | P2 | Thả reaction vào tin nhắn |
| FR6.2 | 5 Reactions | P2 | ❤️ 😂 😮 😢 👍 |
| FR6.3 | Hiển thị reaction | P2 | Hiển thị reaction trên tin nhắn |

### 3.7 FR7: Theme & UI

| ID | Requirement | Priority | Mô tả chi tiết |
|----|-------------|----------|----------------|
| FR7.1 | Dark Mode | P1 | Chế độ tối |
| FR7.2 | Light Mode | P1 | Chế độ sáng |
| FR7.3 | Toggle theme | P1 | Nút chuyển đổi theme |
| FR7.4 | Save preference | P1 | Lưu theme vào localStorage |
| FR7.5 | Responsive | P0 | Hiển thị tốt trên mobile |
| FR7.6 | Mobile-first | P0 | Thiết kế ưu tiên mobile |

### 3.8 FR8: Permissions (Phân quyền)

| ID | Requirement | Priority | Mô tả chi tiết |
|----|-------------|----------|----------------|
| FR8.1 | User role | P0 | Role mặc định cho user |
| FR8.2 | Admin role | P2 | Role cho quản lý |
| FR8.3 | Xem danh sách user | P0 | Tất cả user đều xem được |
| FR8.4 | Xóa tin nhắn | P2 | Chỉ Admin được xóa |
| FR8.5 | Quản lý user | P2 | Admin thêm/xóa user |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| Requirement | Target |
|-------------|--------|
| Thời gian load trang | < 2 giây |
| Latency tin nhắn | < 100ms |
| Real-time responsiveness | Tức thì |

### 4.2 Scalability

| Requirement | Target |
|-------------|--------|
| Số user | 10 người |
| Số tin nhắn/lưu trữ | ~30 ngày |
| Database | SQLite |

### 4.3 Security

| Requirement | Target |
|-------------|--------|
| Network | Chỉ chạy trên local network |
| Data | Không mã hóa (nội bộ) |
| Access control | Phân quyền Admin/User |

### 4.4 Compatibility

| Requirement | Target |
|-------------|--------|
| Browser | Chrome, Firefox, Safari, Edge |
| Mobile | iOS Safari, Chrome Mobile |
| Desktop | Windows, macOS, Linux |

---

## 5. User Flows

### 5.1 Flow 1: Đăng nhập lần đầu

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User mở app                                             │
│                        ↓                                     │
│ 2. Kiểm tra localStorage có user_id?                       │
│        ↓                                                     │
│    ┌──────┐     ┌──────────────┐                           │
│    │ Có   │     │ Không        │                           │
│    ↓      │     ↓              │                           │
│ 4. Vào    │ 3. Hiển thị màn   │                           │
│ Chat List │    hình nhập tên   │                           │
│           │           ↓        │                           │
│           │ 5. User nhập tên   │                           │
│           │           ↓        │                           │
│           │ 6. Tạo user mới   │                           │
│           │    trong database  │                           │
│           │           ↓        │                           │
│           └─────── → Vào Chat List                         │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Flow 2: Gửi tin nhắn

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User đang ở màn hình Chat 1-1                           │
│                        ↓                                     │
│ 2. Nhập tin nhắn vào input                                 │
│                        ↓                                     │
│ 3. Nhấn nút gửi hoặc Enter                                │
│                        ↓                                     │
│ 4. Hiển thị tin nhắn ngay (Optimistic UI)                 │
│                        ↓                                     │
│ 5. Gửi qua Socket.io đến server                           │
│                        ↓                                     │
│ 6. Server lưu vào SQLite                                   │
│                        ↓                                     │
│ 7. Server gửi tin đến recipient qua Socket                │
│                        ↓                                     │
│ 8. Recipient nhận tin hiển thị                           │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Flow 3: Auto-convert Emoji

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User nhập text ":)" trong input                        │
│                        ↓                                     │
│ 2. Event listener bắt sự kiện input                       │
│                        ↓                                     │
│ 3. Kiểm tra text có trong emoji mapping?                  │
│        ↓                                                     │
│    ┌──────┐     ┌──────────────┐                           │
│    │ Có   │     │ Không        │                           │
│    ↓      │     ↓              │                           │
│ 4. Thay   │ 6. Giữ nguyên     │                           │
│ text = :) │    text            │                           │
│ bằng 😊   │           ↓        │                           │
│    ↓      │           └─────── → Hiển thị text            │
│ 5. Hiển thị 😊                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. UI/UX Requirements

### 6.1 Screen List

| Screen | Route | Mô tả |
|--------|-------|-------|
| Login/Setup | `/` | Màn hình nhập tên lần đầu |
| Chat List | `/chats` | Danh sách cuộc trò chuyện |
| Search Users | `/users` | Tìm và chọn user để chat |
| Chat 1-1 | `/chat/:userId` | Màn hình chat với 1 người |
| Profile | `/profile` | Chỉnh sửa profile |

### 6.2 Color Palette

**Light Theme:**
| Element | Color |
|---------|-------|
| Background | #FFFFFF |
| Surface | #F5F5F5 |
| Primary | #4A90D9 |
| Text Primary | #1A1A1A |
| Text Secondary | #666666 |
| Border | #E0E0E0 |
| Sent Message | #4A90D9 |
| Received Message | #E8E8E8 |

**Dark Theme:**
| Element | Color |
|---------|-------|
| Background | #1A1A1A |
| Surface | #2D2D2D |
| Primary | #5BA3E8 |
| Text Primary | #FFFFFF |
| Text Secondary | #AAAAAA |
| Border | #404040 |
| Sent Message | #5BA3E8 |
| Received Message | #3D3D3D |

### 6.3 Layout Specifications

**Mobile Layout (max-width: 480px):**
- Header: 56px fixed top
- Content: Full width, calc(100vh - 56px)
- Chat input: 56px fixed bottom
- Message bubble: max-width 75%

**Desktop Layout (min-width: 768px):**
- Max width container: 480px (centered)
- Similar mobile experience

### 6.4 Components

| Component | States | Behavior |
|-----------|--------|----------|
| Message Bubble | sent, received | Click để xem chi tiết |
| User List Item | default, selected, online | Click để chat |
| Send Button | default, disabled, loading | Click gửi tin |
| Emoji Button | default, active | Click mở picker |
| Theme Toggle | light, dark | Click chuyển đổi |
| Reaction Button | default, active | Click hiển thị menu |

---

## 7. Technical Requirements

### 7.1 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js 18+ hoặc Vue.js 3+ |
| Backend | Node.js 18+ |
| Framework | Express.js 4+ |
| Real-time | Socket.io 4+ |
| Database | SQLite3 |
| Styling | CSS3 / Tailwind CSS |
| Build Tool | Vite |

### 7.2 Project Structure

```
alachat/
├── client/                 # Frontend
│   ├── src/
│   │   ├── components/    # React/Vue components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utility functions
│   │   ├── styles/       # CSS files
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── public/           # Static assets
│   ├── index.html        # HTML template
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite config
│
├── server/                # Backend
│   ├── src/
│   │   ├── index.js      # Server entry point
│   │   ├── routes/      # API routes
│   │   ├── socket/      # Socket.io handlers
│   │   ├── db/          # Database operations
│   │   └── utils/       # Utility functions
│   ├── database.sqlite   # SQLite database file
│   └── package.json      # Backend dependencies
│
├── package.json           # Root package.json
└── README.md             # Project documentation
```

### 7.3 API Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/users` | Tạo user mới | `{ name, avatar }` |
| GET | `/api/users` | Lấy danh sách user | - |
| GET | `/api/users/:id` | Lấy thông tin user | - |
| PUT | `/api/users/:id` | Cập nhật user | `{ name, avatar }` |
| GET | `/api/messages/:userId` | Lấy tin nhắn với user | - |
| GET | `/api/chats` | Lấy danh sách chat | - |

### 7.4 Socket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `connect` | Client → Server | `{ userId }` |
| `disconnect` | Client → Server | - |
| `message` | Client → Server | `{ toUserId, content }` |
| `message` | Server → Client | `{ fromUserId, content, timestamp }` |
| `typing` | Client → Server | `{ toUserId }` |
| `typing` | Server → Client | `{ fromUserId }` |

---

## 8. Data Model

### 8.1 Database Schema

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

### 8.2 Entity Relationship

```
┌─────────────┐       ┌─────────────┐
│    users    │       │  messages   │
├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ from_user   │
│ name        │       │     _id (FK)│
│ avatar      │       ├─────────────┤
│ role        │       │ to_user_id  │
│ created_at  │       │   (FK)      │
│ last_active │       │ content     │
└─────────────┘       │ timestamp   │
                      │ is_read     │
                      │ delete_at   │
                      └─────────────┘
```

---

## 9. Milestones

### Phase 1: MVP (Week 1-2)

| Milestone | Tasks | Deliverable |
|-----------|-------|-------------|
| M1.1 | Setup project, server, database | Project running |
| M1.2 | User registration | User có thể nhập tên |
| M1.3 | Real-time chat basic | Gửi/nhận tin nhắn |
| M1.4 | Chat list | Hiển thị danh sách chat |
| M1.5 | Search user | Tìm và chọn user |

### Phase 2: Features (Week 2-3)

| Milestone | Tasks | Deliverable |
|-----------|-------|-------------|
| M2.1 | Emoji picker | Popup chọn emoji |
| M2.2 | Auto-convert | Text → emoji tự động |
| M2.3 | Theme toggle | Dark/Light mode |
| M2.4 | Profile editing | Đổi tên, avatar |

### Phase 3: Polish (Week 3-4)

| Milestone | Tasks | Deliverable |
|-----------|-------|-------------|
| M3.1 | Reactions | Thả reaction |
| M3.2 | Permissions | Admin/User roles |
| M3.3 | Responsive test | Test trên mobile |
| M3.4 | Bug fixes | Ứng dụng ổn định |

---

## 10. Testing Requirements

### 10.1 Test Cases

| Feature | Test Case | Expected Result |
|---------|-----------|-----------------|
| Login | Nhập tên mới | User được tạo, vào app |
| Send message | Gửi tin "Hello" | Tin hiển thị ở cả 2 máy |
| Emoji picker | Click 😊 | Hiển thị trong tin nhắn |
| Auto-convert | Nhập ":)" | Tự chuyển thành 😊 |
| Theme | Click toggle | Chuyển Light ↔ Dark |
| Search | Tìm "A" | Hiển thị user có chữ A |

---

## 11. Future Enhancements

### 11.1 Phase 2 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| File sharing | Gửi file, hình ảnh | P2 |
| Group chat | Tạo nhóm chat nhiều người | P2 |
| Push notifications | Thông báo khi có tin nhắn | P2 |
| Disappearing messages | Tin nhắn tự xóa | P3 |

### 11.2 Technical Enhancements

| Feature | Description |
|---------|-------------|
| PWA | Progressive Web App |
| Encryption | Mã hóa tin nhắn |
| Docker | Containerize application |

---

## 12. Appendix

### 12.1 Emoji Mapping Full List

```javascript
const emojiMap = {
  // Faces
  ':)': '😊', ':(': '☹️', ':D': '😄', ':P': '😛', '>.<': '😝',
  ':p': '😛', ':d': '😄', '>(': '😠', '>:(': '😠', 'o.O': '😮',
  'O.o': '😮', '-_-': '😑', '^_^': '😊', '^.^': '😊',
  
  // Crying
  'T.T': '😭', 'T_T': '😭', ":'(": '😢', ':,(': '😢', 'T_T': '😭',
  
  // Hearts
  '<3': '❤️', ':*': '😘', 'x3': '😻', 'X3': '😻', '❤': '❤️',
  
  // Wink
  ';)': '😉', ';P': '😜', ';p': '😜', ':,D': '😆',
  
  // Misc
  'xD': '😆', 'XD': '😆', ':O': '😮', ':o': '😮', ':0': '😮'
};
```

### 12.2 Color Reference (CSS Variables)

```css
:root {
  /* Light Theme */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --color-primary: #4A90D9;
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --border-color: #E0E0E0;
  --message-sent: #4A90D9;
  --message-received: #E8E8E8;
  
  /* Dark Theme */
  --bg-primary-dark: #1A1A1A;
  --bg-secondary-dark: #2D2D2D;
  --color-primary-dark: #5BA3E8;
  --text-primary-dark: #FFFFFF;
  --text-secondary-dark: #AAAAAA;
  --border-color-dark: #404040;
  --message-sent-dark: #5BA3E8;
  --message-received-dark: #3D3D3D;
}
```

---

## Document Info

| Field | Value |
|-------|-------|
| **Version** | 1.1 |
| **Author** | Tranz |
| **Date** | 2026-03-08 |
| **Status** | Active Development |

---

# PHỤ LỤC: TIẾN ĐỘ DỰ ÁN

## A. Trạng Thái Triển Khai

### ✅ Đã Hoàn Thành (v1.0 - v1.1)

| Feature | Status | Notes |
|---------|--------|-------|
| **FR1.1** Đặt tên user | ✅ Done | Đổi thành login/register với username/password |
| **FR1.2** Upload avatar | ✅ Done | Max 2MB, JPG/PNG/GIF |
| **FR1.3** Chỉnh sửa profile | ✅ Done | Đổi tên + mật khẩu |
| **FR1.4** Danh sách user | ✅ Done | |
| **FR2.1** Gửi tin nhắn | ✅ Done | Real-time via Socket.io |
| **FR2.2** Nhận tin nhắn | ✅ Done | Real-time |
| **FR2.3** Hiển thị tin nhắn | ✅ Done | |
| **FR2.4** Tin nhắn của tôi | ✅ Done | Bên phải |
| **FR2.5** Tin nhắn người khác | ✅ Done | Bên trái |
| **FR2.6** Timestamp | ✅ Done | |
| **FR2.7** Xem ai đang chat | ✅ Done | |
| **FR3.1** Danh sách chat | ✅ Done | |
| **FR3.2** Xem tin mới nhất | ✅ Done | |
| **FR3.3** Thời gian tin mới | ✅ Done | |
| **FR3.4** Avatar trong list | ✅ Done | |
| **FR3.5** Sắp xếp mới nhất | ✅ Done | |
| **FR4.1** Tìm kiếm user | ✅ Done | |
| **FR4.2** Danh sách user online | ✅ Done | |
| **FR4.3** Bắt đầu chat mới | ✅ Done | |
| **FR5.1** Emoji picker | ✅ Done | 5 categories + Recent |
| **FR5.2** Categories | ✅ Done | Faces, Hearts, Gestures, Objects, Symbols |
| **FR5.3** Recent emojis | ✅ Done | Lưu 20 emoji hay dùng |
| **FR5.4** Auto-convert | ✅ Done | :) → 😊, T.T → 😭, etc. |
| **FR6.1** React tin nhắn | ✅ Done | |
| **FR6.2** 5 Reactions | ✅ Done | ❤️ 😂 😮 😢 👍 |
| **FR6.3** Hiển thị reaction | ✅ Done | |
| **FR7.1** Dark Mode | ✅ Done | |
| **FR7.2** Light Mode | ✅ Done | |
| **FR7.3** Toggle theme | ✅ Done | |
| **FR7.4** Save preference | ✅ Done | localStorage |
| **FR7.5** Responsive | ✅ Done | Mobile-first |
| **FR7.6** Mobile-first | ✅ Done | |
| **FR8.1** User role | ✅ Done | Default role |
| **FR8.2** Admin role | ✅ Done | |
| **FR8.3** Xem danh sách user | ✅ Done | |
| **FR8.4** Xóa tin nhắn | ✅ Done | Admin only |
| **FR8.5** Quản lý user | ✅ Done | Admin thêm/xóa/đổi role |

### 🔄 Tính Năng Mới Thêm (v1.1)

| Feature | Status | Notes |
|---------|--------|-------|
| Login/Register với password | ✅ Done | Thay thế login chỉ có tên |
| Đổi mật khẩu | ✅ Done | Xác nhận mật khẩu cũ |
| Recent Emojis | ✅ Done | Lưu vào localStorage |
| Admin: Xem tin nhắn | ✅ Done | 50 tin gần nhất |
| Admin: Xóa tin nhắn | ✅ Done | Từ giao diện |
| LAN Access | ✅ Done | 0.0.0.0 + CORS config |

### ⏳ Chưa Hoàn Thành

| Feature | Priority | Notes |
|---------|----------|-------|
| Unread message count | Low | Hiển thị số tin chưa đọc |
| File sharing | Future | Gửi file, hình ảnh |
| Group chat | Future | Tạo nhóm chat |
| Push notifications | Future | Thông báo khi có tin nhắn |
| Disappearing messages | Future | Tin nhắn tự xóa |
| PWA | Future | Progressive Web App |
| Docker | Future | Containerize |

---

## B. Cấu Trúc Database

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME
);
```

### Messages Table
```sql
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

### Reactions Table
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

---

## C. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Đăng ký user mới |
| POST | `/api/users/login` | Đăng nhập |
| POST | `/api/users/verify-password` | Xác thực mật khẩu |
| PATCH | `/api/users/:id/password` | Đổi mật khẩu |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Danh sách user |
| GET | `/api/users/:id` | Chi tiết user |
| POST | `/api/users` | Tạo user (legacy) |
| PUT | `/api/users/:id` | Cập nhật user |
| POST | `/api/users/:id/avatar` | Upload avatar |
| DELETE | `/api/users/:id` | Xóa user (admin) |
| PATCH | `/api/users/:id/role` | Đổi role (admin) |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:userId` | Tin nhắn với user |
| GET | `/api/messages` | Danh sách chat |
| DELETE | `/api/messages/:id` | Xóa tin nhắn |

### Reactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reactions/:messageId` | Reactions của tin |
| POST | `/api/reactions` | Thêm reaction |
| DELETE | `/api/reactions/:id` | Xóa reaction |

### Socket Events
| Event | Direction | Payload |
|-------|-----------|---------|
| `connect_user` | Client → Server | `{ userId }` |
| `send_message` | Client → Server | `{ fromUserId, toUserId, content }` |
| `new_message` | Server → Client | Tin nhắn mới |
| `message_sent` | Server → Client | Xác nhận đã lưu |
| `typing` | Client → Server | Đang soạn tin |
| `user_typing` | Server → Client | Partner đang soạn |
| `add_reaction` | Client → Server | Thêm reaction |
| `reaction_update` | Server → Client | Cập nhật reaction |

---

## D. Công Nghệ Sử Dụng

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Database | SQLite3 |
| Styling | CSS Variables |

---

## E. Cách Chạy Ứng Dụng

### Development
```bash
# Cài đặt dependencies
npm run install:all

# Chạy dev server (client + server)
npm run dev

# Hoặc chạy riêng
npm run client  # Frontend: http://localhost:5173
npm run server  # Backend: http://localhost:3001
```

### Production
```bash
# Build client
npm run build

# Chạy server (sẽ serve static files từ client/dist)
npm run server

# Truy cập
http://localhost:3001
http://[LAN_IP]:3001
```

---

## F. Bug Đã Sửa

1. **Duplicate tin nhắn**: Khi ấn Enter, tin nhắn hiển thị 2 lần
   - Nguyên nhân: Xử lý cả `new_message` và `message_sent`
   - Giải pháp: Chỉ xử lý tin từ partner trong `new_message`

2. **LAN Access**: Không thể truy cập bằng IP
   - Nguyên nhân: Server chỉ listen trên localhost
   - Giải pháp: Listen trên `0.0.0.0`, CORS mở rộng

---

## Document Info
