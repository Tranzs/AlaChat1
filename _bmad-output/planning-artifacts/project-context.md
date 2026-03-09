# Project Context Document

## AlaChat - Internal Chat Application

---

## 1. Project Overview

### 1.1 Project Summary

| Field | Value |
|-------|-------|
| **Project Name** | AlaChat |
| **Type** | Web Application (Real-time Chat) |
| **Core Functionality** | Internal team chat application for 10 users on local network |
| **Target Users** | Company employees (10 people) |
| **Network** | Local Area Network (LAN) - No internet required |

### 1.2 Problem Statement

**Current Situation:**
- Công ty thiếu công cụ giao tiếp nội bộ nhanh chóng
- Nhân viên phải dùng email hoặc các ứng dụng không phù hợp
- Cần internet để sử dụng các ứng dụng chat phổ biến

**Pain Points:**
- Không có công cụ chat nội bộ
- Phụ thuộc internet công cộng
- Thiếu tính năng phù hợp với công việc

### 1.3 Solution

AlaChat - Ứng dụng web chat real-time:
- Chạy trên mạng nội bộ (không cần internet)
- Giao diện đơn giản, dễ sử dụng
- Real-time với Socket.io
- Miễn phí, tự host

---

## 2. Business Context

### 2.1 Business Objectives

| Objective | Success Metric |
|-----------|----------------|
| **Enable quick communication** | Nhân viên có thể chat trong 1 click |
| **Reduce email** | Giảm email không cần thiết 50% |
| **No internet dependency** | Hoạt động khi internet down |
| **Low cost** | Không tốn phí license |

### 2.2 Business Constraints

| Constraint | Description |
|-----------|-------------|
| **Budget** | Miễn phí - open source |
| **Timeline** | 4 tuần (MVP) |
| **Team** | 1 developer |
| **Infrastructure** | 1 server machine |

### 2.3 Success Criteria

| Criteria | Target |
|----------|--------|
| **Launch** | Within 4 weeks |
| **Users** | All 10 employees use it |
| **Uptime** | 99% on local network |
| **Latency** | < 100ms message delivery |
| **Usability** | No training required |

---

## 3. Stakeholders

### 3.1 Stakeholder Map

```
┌─────────────────┐
│    COMPANY      │
│    DIRECTOR     │  ← Primary Sponsor
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌────────┐
│  IT   │ │EMPLOYEES│
│  Team │ │ (10    │
│       │ │ people)│
└───────┘ └────────┘
     │         │
     ▼         ▼
┌──────────┐ ┌──────────┐
│System    │ │End Users │
│Admin     │ │          │
└──────────┘ └──────────┘
```

### 3.2 Stakeholder Details

| Stakeholder | Interest | Influence | Concern |
|-------------|----------|-----------|---------|
| **Director** | Low cost, quick communication | High | Simple to deploy |
| **IT Team** | Easy maintenance | Medium | Reliable, backup |
| **Employees** | Fast chat, good UX | High | Easy to use |
| **Developer** | Clean code, maintainable | Medium | Clear specs |

---

## 4. Technical Context

### 4.1 Technical Constraints

| Constraint | Description | Impact |
|------------|-------------|--------|
| **Single Server** | All users connect to 1 machine | Performance optimization |
| **LAN Only** | No internet access required | No external dependencies |
| **10 Users** | Small scale | Simple architecture |
| **No Auth Server** | Simple username only | No complex security |

### 4.2 Infrastructure

| Component | Specification |
|-----------|---------------|
| **Server** | 1 x PC/Laptop (Windows/macOS/Linux) |
| **Network** | Local WiFi/Ethernet |
| **Database** | SQLite (file on server) |
| **Domain** | http://localhost:3000 or LAN IP |

### 4.3 Environment

| Environment | URL | Purpose |
|-------------|-----|---------|
| **Development** | http://localhost:3000 | Local dev |
| **Production** | http://[server-ip]:3000 | Live usage |

---

## 5. User Requirements Summary

### 5.1 User Personas (from PRD)

| Persona | Role | Goals | Frustrations |
|---------|------|-------|--------------|
| **Employee** | User | Chat quickly, see history, change profile | Complex apps, need internet |
| **Manager** | Admin | Manage users, monitor if needed | Can't delete bad messages |

### 5.2 User Stories

| Story | As a | I want to | So that |
|-------|------|-----------|---------|
| **US1** | Employee | Enter my name | I can be identified |
| **US2** | Employee | See chat list | I know who I've chatted with |
| **US3** | Employee | Send message | I can communicate |
| **US4** | Employee | Receive messages instantly | I don't miss messages |
| **US5** | Employee | Use emoji | I can express myself |
| **US6** | Employee | Auto-convert :) to 😊 | It's fun |
| **US7** | Employee | Toggle dark/light | I can use in any light |
| **US8** | Employee | Use on phone | I can chat anywhere |
| **US9** | Admin | Delete inappropriate messages | Keep chat clean |
| **US10** | Employee | Change my name/avatar | I can update my profile |

### 5.3 Functional Requirements Summary

| Category | Requirements |
|----------|--------------|
| **Chat** | 1-1 real-time, message display, timestamps |
| **Users** | User list, search, profile |
| **Emoji** | Picker, auto-convert |
| **UI** | Dark/Light theme, responsive |
| **Admin** | Manage users, delete messages |

---

## 6. Non-Functional Requirements Summary

### 6.1 Performance

| Requirement | Target |
|-------------|--------|
| Page load | < 2 seconds |
| Message latency | < 100ms |
| Real-time | Instant updates |

### 6.2 Reliability

| Requirement | Target |
|-------------|--------|
| Uptime | 99% |
| Data retention | 30 days |
| Backup | Manual (copy .db file) |

### 6.3 Usability

| Requirement | Target |
|-------------|--------|
| Learning time | < 5 minutes |
| Mobile support | Yes |
| Browser support | Modern browsers |

---

## 7. Project Scope

### 7.1 In Scope (MVP)

| Feature | Priority | Phase |
|---------|----------|-------|
| User registration (name) | P0 | 1 |
| 1-1 Chat | P0 | 1 |
| Chat list | P0 | 1 |
| Search users | P0 | 1 |
| Emoji picker | P1 | 2 |
| Auto-convert | P1 | 2 |
| Dark/Light theme | P1 | 2 |
| Profile editing | P1 | 2 |
| Reactions | P2 | 3 |
| Admin features | P2 | 3 |

### 7.2 Out of Scope

| Feature | Reason |
|---------|--------|
| File upload | User requested no |
| Group chat | Future phase |
| Voice/Video | User requested no |
| Encryption | Internal use only |
| Mobile app | Web PWA ready |

### 7.3 Future Scope

| Feature | Phase |
|---------|-------|
| Group chat | v2.0 |
| File sharing | v2.0 |
| Push notifications | v2.0 |
| PWA install | v2.0 |

---

## 8. Timeline & Milestones

### 8.1 Project Timeline

```
Week 1          Week 2          Week 3          Week 4
│                │                │                │
├─ Setup         ├─ Chat List     ├─ Emoji         ├─ Testing
├─ Server/DB     ├─ Search        ├─ Theme         ├─ Bug fixes
├─ Auth          ├─ Real-time     ├─ Profile       └─ Launch
│                │                │
```

### 8.2 Milestones

| Milestone | Date | Deliverable |
|-----------|------|-------------|
| **M1** | Week 1 | Project setup, basic server |
| **M2** | Week 2 | Core chat working |
| **M3** | Week 3 | Features complete |
| **M4** | Week 4 | Tested, production ready |

---

## 9. Risks & Dependencies

### 9.1 Project Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scope creep | Medium | High | Stick to MVP |
| Technical issues | Low | Medium | Research first |
| Time overrun | Medium | Medium | Weekly reviews |
| Server down | Low | High | Easy restart |

### 9.2 Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Node.js | Technical | Available |
| Socket.io | Technical | Available |
| SQLite | Technical | Available |
| React | Technical | Available |

---

## 10. Assumptions

| Assumption | Impact |
|------------|--------|
| 1 server machine available | Project can run |
| All 10 users on same network | Can connect |
| No complex auth needed | Simpler development |
| SQLite handles load | Performance adequate |

---

## 11. Open Questions

| Question | Answer Needed By |
|----------|------------------|
| Who will maintain after launch? | Before launch |
| Backup frequency? | Before launch |
| Server specifications? | Week 1 |
| Who has admin access? | Week 1 |

---

## 12. Contact & Communication

| Role | Person | Responsibility |
|------|--------|----------------|
| **Project Lead** | Tranz | Decision making |
| **Developer** | TBD | Implementation |
| **Tester** | Tranz | UAT |

---

## 13. Appendix

### 13.1 Glossary

| Term | Definition |
|------|------------|
| **LAN** | Local Area Network - mạng nội bộ |
| **Real-time** | Tức thời - không cần refresh |
| **Socket.io** | Thư viện cho real-time communication |
| **SQLite** | File-based database |
| **MVP** | Minimum Viable Product - sản phẩm tối thiểu |

### 13.2 References

| Document | Location |
|----------|----------|
| PRD | `_bmad-output/brainstorming/PRD-AlaChat-v1.0.md` |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` |
| UX Design | `_bmad-output/planning-artifacts/ux-design.md` |
| Research | `_bmad-output/planning-artifacts/research.md` |

---

## 14. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-07 | Tranz | Initial version |
