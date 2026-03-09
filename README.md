# AlaChat - Internal Real-time Chat Application

![Version](https://img.shields.io/badge/version-1.1-blue)
![Status](https://img.shields.io/badge/status-active-green)

AlaChat là ứng dụng web chat real-time chạy trên mạng nội bộ (LAN), cho phép các nhân viên trong công ty chat với nhau một cách nhanh chóng và vui nhộn với tính năng auto-convert text thành emoji.

---

## Tính Năng

### ✅ Đã Hoàn Thành

| Tính năng | Mô tả |
|------------|--------|
| **Chat 1-1 Real-time** | Gửi/nhận tin nhắn tức thì |
| **Đăng nhập/Đăng ký** | Tài khoản cá nhân với username/password |
| **Emoji Picker** | Popup chọn emoji với 5 categories |
| **Auto-convert** | Tự động chuyển `:)` → 😊 |
| **Recent Emojis** | Lưu 20 emoji hay dùng |
| **Reactions** | Thả reaction ❤️ 😂 😮 😢 👍 |
| **Dark/Light Theme** | Chế độ tối/sáng |
| **Profile** | Đổi tên, avatar, mật khẩu |
| **Admin Panel** | Quản lý users, xóa tin nhắn |
| **LAN Access** | Truy cập qua IP mạng nội bộ |

---

## Cài Đặt

### Yêu Cầu
- Node.js 18+
- npm hoặc yarn

### Bước 1: Clone/Copy project

```bash
cd F:\DevFest2025\AlaChat
```

### Bước 2: Cài đặt dependencies

```bash
npm run install:all
```

Hoặc cài đặt từng phần:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

---

## Cách Chạy

### Development (Development Mode)

```bash
# Chạy cả client và server
npm run dev

# Hoặc chạy riêng:
npm run client   # Frontend: http://localhost:5173
npm run server   # Backend: http://localhost:3001
```

### Production

```bash
# Build client
npm run build

# Chạy server (sẽ serve static files từ client/dist)
npm run server
```

---

## Truy Cập

### Sau khi chạy Production:
```
Local:    http://localhost:3001
LAN IP:   http://[YOUR_IP]:3001
```

### Tìm IP của máy:
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

Tìm dòng IPv4 Address (ví dụ: `192.168.1.100`)

---

## Tài Khoản Mặc Định

### Tạo tài khoản Admin đầu tiên:

1. Truy cập http://localhost:3001
2. Đăng ký user mới với username bất kỳ
3. Vào Database (`server/src/database.sqlite`) để edit role thành `admin`:

```sql
UPDATE users SET role = 'admin' WHERE id = 1;
```

Hoặc sử dụng công cụ SQLite như DB Browser for SQLite.

---

## Công Nghệ

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Database | SQLite3 |
| Styling | CSS Variables |

---

## Cấu Trúc Project

```
alachat/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── pages/        # Page Components
│   │   ├── context/      # React Context
│   │   ├── utils/        # Utilities
│   │   └── styles/       # CSS
│   └── dist/             # Built files
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── routes/       # API Routes
│   │   ├── socket/       # Socket.io Handlers
│   │   └── db/           # Database
│   └── database.sqlite   # SQLite Database
│
├── _bmad-output/         # Documentation
│   ├── brainstorming/    # Brainstorming docs
│   ├── planning-artifacts/ # Planning docs
│   └── implementation-artifacts/ # Implementation docs
│
└── package.json
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Đăng ký |
| POST | `/api/users/login` | Đăng nhập |
| POST | `/api/users/verify-password` | Xác thực mật khẩu |
| PATCH | `/api/users/:id/password` | Đổi mật khẩu |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Danh sách user |
| GET | `/api/users/:id` | Chi tiết user |
| POST | `/api/users/:id/avatar` | Upload avatar |
| DELETE | `/api/users/:id` | Xóa user (admin) |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:userId` | Tin nhắn với user |
| DELETE | `/api/messages/:id` | Xóa tin nhắn |

---

## Socket Events

| Event | Mô tả |
|-------|--------|
| `connect_user` | Kết nối với user ID |
| `send_message` | Gửi tin nhắn |
| `new_message` | Tin nhắn mới |
| `typing` | Đang soạn tin |
| `add_reaction` | Thả reaction |

---

## Emoji Auto-convert

```
:) → 😊    :( → ☹️    :D → 😄    :P → 😛    >.< → 😝
T.T → 😭   T_T → 😭   :'( → 😢
<3 → ❤️    :* → 😘    ;) → 😉    -_- → 😑
^.^ → 😊   ^_^ → 😊    xD → 😆
```

---

## Các Phiên Bản

### v1.1 (2026-03-08)
- ✅ Login/Register với password
- ✅ Đổi mật khẩu
- ✅ Recent Emojis
- ✅ Admin: Xem/xóa tin nhắn
- ✅ LAN Access
- ✅ Bug fixes

### v1.0 (2026-03-07)
- ✅ MVP Features
- ✅ Reactions
- ✅ Admin Roles

---

## License

Nội bộ - Công ty

---

## Liên Hệ

- Author: Tranz
- Email: [Your Email]
