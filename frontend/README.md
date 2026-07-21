# 🚀 Kanban Task Management System

A modern full-stack Kanban Board application built with **Laravel**, **React (Vite)**, and **MySQL**. It helps teams organize work using boards, lists, cards, members, tags, due dates, and drag-and-drop functionality.

---

# 📌 Features

- 📋 Multiple Boards
- 📝 Create, Edit and Delete Lists
- ✅ Create, Edit and Delete Cards
- 👥 Member Assignment
- 🏷️ Tag Management
- 📅 Due Dates
- 📊 Dashboard Statistics
- 🔄 Drag & Drop Cards Between Lists
- 🎨 Modern Responsive UI
- 💬 Modal-based Forms
- 🔐 Authentication Support
- ⚡ REST API Backend

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Axios
- CSS3

## Backend

- Laravel
- Sanctum Authentication
- REST API

## Database

- MySQL

---

# 📷 Screenshots

> Add these images inside the `screenshots` folder.

## Dashboard

![Dashboard](screenshots/Dashboard.png)


## Add Card

![Add Card](screenshots/add-card-modal.png)

## Edit Card

![Edit Card](screenshots/edit-card-modal.png)

## Add Tag

![Add Tag](screenshots/tag-modal.png)

## Drag & Drop

![Drag & Drop](screenshots/drag-drop.png)

---

# ✨ Major Features

## Board Management

- Create Boards
- Organize multiple workflows

## List Management

- Add Lists
- Remove Lists
- Organize workflow stages

## Card Management

- Create Cards
- Edit Cards
- Delete Cards
- Move Cards

## Tags

- Add Tags
- Remove Tags
- Color-coded labels

## Members

- Assign members to tasks

## Due Dates

- Set deadlines
- Highlight overdue tasks

## Dashboard

Displays:

- Number of Lists
- Total Cards
- Completed Cards
- Overdue Cards

---

# 📂 Project Structure

```
backend/
frontend/

frontend/src/
    components/
    pages/
    services/

backend/app/
backend/routes/
backend/database/
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Backend

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan serve
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📡 API

The backend provides REST APIs for:

- Authentication
- Boards
- Lists
- Cards
- Members
- Tags

---

# 🎯 Improvements Added

The application has been enhanced with:

- Modern responsive interface
- Drag-and-drop support
- Dashboard statistics
- Modal-based forms
- Improved workflow
- Better visual hierarchy
- Enhanced user experience

---

# 🔮 Future Enhancements

- Search & Filter
- Toast Notifications
- Dark Mode
- Activity Timeline
- File Attachments
- Comments
- Email Notifications
- Real-time Collaboration

---

# 👩‍💻 Author

**Divyani Singh**

IT Student

---

# 📄 License

This project is developed for educational and learning purposes.