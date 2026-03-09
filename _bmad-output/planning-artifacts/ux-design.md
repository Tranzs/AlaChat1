# UX Design Document

## AlaChat - User Experience Design

---

## 1. Design Principles

### 1.1 Core Principles

| Principle | Description |
|-----------|-------------|
| **Minimal** | Chỉ hiển thị những gì cần thiết |
| **Fast** | Tốc độ phản hồi tức thì |
| **Intuitive** | Không cần hướng dẫn sử dụng |
| **Mobile-first** | Thiết kế cho điện thoại trước |

### 1.2 Visual Design Values

| Value | Description |
|-------|-------------|
| **Clean** | Nhiều whitespace, không clutter |
| **Friendly** | Bo tròn góc, màu dịu |
| **Consistent** | Thống nhất về màu sắc, typography |

---

## 2. Color Palette

### 2.1 Light Theme

| Element | Color | Hex |
|---------|-------|-----|
| Background | White | `#FFFFFF` |
| Surface | Light Gray | `#F5F5F5` |
| Primary | Blue | `#4A90D9` |
| Primary Hover | Dark Blue | `#3A7BC8` |
| Text Primary | Dark | `#1A1A1A` |
| Text Secondary | Gray | `#666666` |
| Border | Light Border | `#E0E0E0` |
| Sent Message | Blue | `#4A90D9` |
| Received Message | Gray | `#E8E8E8` |
| Sent Text | White | `#FFFFFF` |
| Received Text | Dark | `#1A1A1A` |
| Error | Red | `#E53935` |
| Success | Green | `#43A047` |

### 2.2 Dark Theme

| Element | Color | Hex |
|---------|-------|-----|
| Background | Dark | `#1A1A1A` |
| Surface | Dark Gray | `#2D2D2D` |
| Primary | Light Blue | `#5BA3E8` |
| Primary Hover | Bright Blue | `#6BB3F8` |
| Text Primary | White | `#FFFFFF` |
| Text Secondary | Light Gray | `#AAAAAA` |
| Border | Dark Border | `#404040` |
| Sent Message | Blue | `#5BA3E8` |
| Received Message | Darker Gray | `#3D3D3D` |
| Sent Text | White | `#FFFFFF` |
| Received Text | White | `#FFFFFF` |
| Error | Light Red | `#EF5350` |
| Success | Light Green | `#66BB6A` |

---

## 3. Typography

### 3.1 Font Family

| Element | Font | Weight |
|---------|------|--------|
| **Primary** | System UI (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto) | 400, 500, 600 |
| **Monospace** | 'SF Mono', Monaco, Consolas | 400 |

### 3.2 Font Sizes

| Element | Size | Line Height |
|---------|------|-------------|
| **H1 (Page Title)** | 24px | 1.3 |
| **H2 (Section)** | 20px | 1.3 |
| **Body** | 16px | 1.5 |
| **Small** | 14px | 1.4 |
| **Caption** | 12px | 1.4 |
| **Message** | 15px | 1.4 |

### 3.3 Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Buttons, labels |
| Semi-bold | 600 | Headings |

---

## 4. Spacing System

### 4.1 Base Unit

```
Base unit: 4px
```

### 4.2 Spacing Scale

| Name | Value | Usage |
|------|-------|-------|
| `xs` | 4px | Tight spacing |
| `sm` | 8px | Between related elements |
| `md` | 16px | Standard padding |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Large gaps |
| `xxl` | 48px | Page margins |

---

## 5. Screen Designs

### 5.1 Login/Setup Screen

```
┌─────────────────────────────┐
│                             │
│         AlaChat             │  ← H1, centered
│                             │
│   ┌─────────────────────┐   │
│   │ 👤 Enter your name  │   │  ← Input field
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │      Continue       │   │  ← Primary button
│   └─────────────────────┘   │
│                             │
└─────────────────────────────┘
```

**Specifications:**
- Centered vertically and horizontally
- Logo/App name: 24px, primary color
- Input: full width minus 32px padding, 48px height
- Button: full width, 48px height, rounded 8px
- Background: Surface color

### 5.2 Chat List Screen

```
┌─────────────────────────────┐
│ AlaChat              🌙    │  ← Header 56px
├─────────────────────────────┤
│ 🔍 Search conversations... │  ← Search 48px
├─────────────────────────────┤
│ ┌───┐ User Name            │  ← User Item 72px
│ │ A │ Last message preview  │
│ └───┘ 10:30 AM        ●●  │
├─────────────────────────────┤
│ ┌───┐ User Name            │
│ │ B │ Last message...      │
│ └───┘ 9:15 AM             │
├─────────────────────────────┤
│ ...                        │
└─────────────────────────────┘
         │ + │               ← Floating button (mobile)
```

**Components:**
- **Header:** App name left, theme toggle right
- **Search:** Full width input with icon
- **User Item:** Avatar (48px) + Name + Last message + Time + Unread indicator
- **Floating Button:** Create new chat (56px circle)

### 5.3 Chat Screen (1-1)

```
┌─────────────────────────────┐
│ ← User Name           ⋮    │  ← Header 56px
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │ Hello! How are you? │   │  ← Received
│   │ 10:30 AM            │   │
│   └─────────────────────┘   │
│                             │
│ ┌─────────────────────┐     │
│ │ I'm doing great! 🎉 │     │  ← Sent (right)
│ │ 10:31 AM             │     │
│ └─────────────────────┘     │
│                             │
│   ┌─────────────────────┐   │
│   │ 👍❤️               │   │  ← Reactions
│   └─────────────────────┘   │
│                             │
├─────────────────────────────┤
│ │ 😊 │ Type a message...│ ➤ │  ← Input 56px
└─────────────────────────────┘
```

**Components:**
- **Header:** Back button + User name + Menu
- **Message Bubble:** Max 75% width, rounded 16px
- **Sent:** Right-aligned, primary color background
- **Received:** Left-aligned, surface color background
- **Reactions:** Small row below message
- **Input:** Emoji button + Text input + Send button

### 5.4 User List Screen

```
┌─────────────────────────────┐
│ ← Find Users        🌙    │  ← Header
├─────────────────────────────┤
│ 🔍 Search by name...       │  ← Search
├─────────────────────────────┤
│ ● Online                  │  ← Section label
├─────────────────────────────┤
│ ┌───┐ User Name     ➤    │  ← User Item
│ │ A │                 │   │
├─────────────────────────────┤
│ ○ Offline                 │  ← Section label
├─────────────────────────────┤
│ ┌───┐ User Name     ➤    │
│ │ B │                 │   │
└─────────────────────────────┘
```

**Components:**
- **Sections:** Online/Offline groups
- **User Item:** Avatar + Name + Arrow indicator

---

## 6. Components Specifications

### 6.1 Message Bubble

| Property | Sent | Received |
|----------|------|----------|
| Background | Primary color | Surface color |
| Text color | White | Text primary |
| Max width | 75% | 75% |
| Border radius | 16px 16px 4px 16px | 16px 16px 16px 4px |
| Padding | 12px 16px | 12px 16px |
| Margin | 4px 0 | 4px 0 |
| Alignment | Flex-end (right) | Flex-start (left) |

### 6.2 Input Field

| Property | Value |
|----------|-------|
| Height | 48px |
| Border radius | 24px |
| Background | Surface |
| Border | 1px solid border |
| Focus border | Primary color |
| Padding | 0 16px |
| Font size | 16px |

### 6.3 Button

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | Primary | White | None |
| Secondary | Transparent | Primary | 1px Primary |
| Disabled | Gray | White | None |

| Property | Value |
|----------|-------|
| Height | 48px |
| Border radius | 8px |
| Padding | 0 24px |
| Font weight | 500 |

### 6.4 Avatar

| Size | Dimensions | Border Radius |
|------|------------|---------------|
| Small | 32px | 50% |
| Medium | 48px | 50% |
| Large | 64px | 50% |

**Default Avatar:**
- Background: Primary color with 20% opacity
- Text: Primary color, centered
- First letter of name

---

## 7. Animations & Transitions

### 7.1 Timing Functions

| Purpose | Timing |
|---------|--------|
| Default | 200ms ease |
| Hover | 150ms ease |
| Page transition | 300ms ease |
| Message appear | 200ms ease-out |

### 7.2 Animations

| Animation | Description |
|-----------|-------------|
| **Message appear** | Fade in + slide up 10px |
| **Button press** | Scale 0.95 on active |
| **Tab switch** | Fade transition |
| **Modal open** | Fade in + scale from 0.95 |

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 480px | Full width |
| Tablet | 480px - 768px | Centered, max 480px |
| Desktop | > 768px | Centered, max 480px |

---

## 9. Accessibility

### 9.1 Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Color contrast** | Minimum 4.5:1 for text |
| **Focus states** | Visible focus ring on interactive elements |
| **Tap targets** | Minimum 44x44px |
| **Screen reader** | Proper ARIA labels |

### 9.2 ARIA Labels

| Component | ARIA Label |
|-----------|------------|
| Send button | "Gửi tin nhắn" |
| Emoji button | "Chọn emoji" |
| Theme toggle | "Chuyển đổi giao diện" |
| Back button | "Quay lại" |

---

## 10. Error States

### 10.1 Input Errors

| State | Visual |
|-------|--------|
| Empty submit | Red border, error message below |
| Network error | Toast notification |

### 10.2 Empty States

| Screen | Message |
|--------|---------|
| No chats | "Chưa có cuộc trò chuyện nào" |
| No users found | "Không tìm thấy người dùng" |
| No messages | "Hãy gửi tin nhắn đầu tiên" |

---

## 11. Loading States

| Component | Loading State |
|-----------|---------------|
| Chat list | Skeleton placeholders |
| Messages | Skeleton messages |
| Send button | Spinner icon |
| Page | Full screen loader |

---

## 12. Component States Summary

| Component | States |
|-----------|--------|
| Button | default, hover, active, disabled, loading |
| Input | default, focus, error, disabled |
| Message | sending, sent, failed |
| User item | default, selected, online, offline |
| Emoji | default, selected |
