# Forge2 Kanban Architecture

## Project Overview

Forge2 Kanban is a Trello-style task management application built for the Forge2 Edition 2 Qualifier.

The project uses a React frontend with a Laravel REST API backend. The frontend is deployed on Vercel, while the backend is deployed on Railway.

---

# Technology Stack

## Frontend

- React
- Vite
- Axios

## Backend

- Laravel 13
- PHP 8.5
- SQLite
- Eloquent ORM

## Deployment

- Frontend: Vercel
- Backend: Railway

## AI Tools

- Hermes Agent
- OpenClaw
- Slack
- Google AI Studio (Gemini 3.5 Flash)

---

# System Architecture

```text
               User
                 │
                 ▼
      React Frontend (Vercel)
                 │
         REST API (Axios)
                 │
                 ▼
     Laravel Backend (Railway)
                 │
            Eloquent ORM
                 │
                 ▼
          SQLite Database
```

---

# Database Models

## Board

Stores Kanban boards.

Example:

- Personal
- Project
- College Work

---

## TaskList

Stores columns inside a board.

Example:

- To Do
- Doing
- Done

Each TaskList belongs to one Board.

---

## Card

Stores individual tasks.

Each card contains:

- title
- description
- due date
- position

Each Card belongs to one TaskList.

---

## Tag

Stores reusable colored labels.

Example:

- Bug
- Feature
- Design

Cards and Tags are connected using the **card_tag** pivot table.

---

## Member

Represents the person assigned to a task.

Each Card can have one assigned Member.

---

# Agent Responsibilities

## Hermes (Brain)

Hermes was responsible for:

- understanding the human request
- planning implementation
- suggesting fixes
- reporting progress
- communicating through Slack

---

## OpenClaw (Hands)

OpenClaw executed the implementation.

Responsibilities included:

- running commands
- installing packages
- editing files
- running migrations
- testing APIs
- preparing deployment

---

## Human

The human operator:

- approved changes
- tested features
- entered credentials
- verified deployment

---

# Slack Workflow

```
Human Task
      │
      ▼
Hermes Plan
      │
      ▼
Implementation
      │
      ▼
Testing
      │
      ▼
Final Report
```

---

# AI Model

Provider:

Google AI Studio

Final Model:

Gemini 3.5 Flash

The model was selected because it provides fast responses suitable for planning, debugging, coding guidance, and status reporting.

---

# Deployment

## Frontend

https://forge2-qualifier-divyani.vercel.app

## Backend

https://forge2-qualifier-divyani-production.up.railway.app

---

# Security

- API keys are stored in environment variables.
- Slack tokens are not committed.
- `.env` files are ignored.
- Only placeholder values are included in public configuration files.