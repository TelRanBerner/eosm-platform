# EOSM Platform 🚀
**Enterprise Incident Observability & Service Management**

Интеллектуальная платформа для управления ИТ-инцидентами и мониторинга состояния сервисов.

## 📋 О проекте
Данная платформа предназначена для автоматизации работы службы поддержки и инженеров. Проект разделен на две части:
- **Backend:** Node.js (Express)
- **Frontend:** React + React Router

## 🛠 Текущий прогресс (Stage 0)
На данном этапе реализован базовый скелет приложения:
- Настроена структура репозитория.
- Реализован эндпоинт **Health Check** на стороне сервера.
- Настроена базовая навигация (Login/Home) на стороне клиента.
- Добавлена проверка связи между фронтендом и бэкендом.

## 🚀 Как запустить

### Backend
1. Перейдите в папку `backend`: `cd backend`
2. Установите зависимости: `npm install`
3. Запустите сервер: `node src/app.js`
   *Сервер будет доступен по адресу: http://localhost:5000*

### Frontend
1. Перейдите в папку `frontend`: `cd frontend`
2. Установите зависимости: `npm install`
3. Запустите приложение: `npm start`
   *Приложение откроется на: http://localhost:3000*

## 🏗 Ролевая модель
- **USER**: Создает заявки.
- **SUPPORT**: Классифицирует инциденты.
- **ENGINEER**: Устраняет технические проблемы.
- **ADMIN**: Полный контроль и аналитика.

--------------------------------------------------------------------------

# Enterprise Incident Observability & Service Management Platform (EOSM) 🚀

## 1. Project Goal
The goal of this project is to develop a distributed web application for managing incidents and service requests within a campus environment. The project focuses on building practical skills in multi-user UI/UX, REST API development, security (AAA, JWT, RBAC), and system monitoring.

## 2. Domain Description
The system is designed for:
* Registering requests (equipment malfunctions, IT problems).
* Transforming requests into incidents.
* Incident lifecycle management.
* Centralized visualization of incidents and system health.

### System Users & Roles:
* **USER**: Creates service requests.
* **SUPPORT**: Processes requests and creates incidents.
* **ENGINEER**: Accepts incidents and manages their lifecycle.
* **ADMIN**: Manages the system and analyzes error dashboards.

## 3. Incident Lifecycle
1. **OPEN**: Ticket is registered.
2. **ASSIGNED**: Support assigned the incident.
3. **IN_PROGRESS**: Engineer is working on it.
4. **RESOLVED**: Issue fixed, awaiting closure.
5. **CLOSED**: Incident finalized.

## 4. Technical Progress (Current: Stage 0)
- **Back-End**: Node.js skeleton (Express) with Health Check endpoint.
- **Front-End**: React application with basic Routing (Login/Home).
- **Connectivity**: Verified communication between Client and Server.

## 5. Project Structure
```text
eosm-platform/
├── backend/                # Node.js API (Routers, Controllers, Services)
├── frontend/               # React App (Pages, Components, Routing)
├── docs/                   # Documentation & OpenAPI Specs
└── README.md               # Project overview