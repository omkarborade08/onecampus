# OneCampus

A full-stack campus community platform built with React (frontend) and Spring Boot (backend).

## Features

- **Marketplace**: Buy and sell items with students from your campus
- **Lost & Found**: Report lost items or help others find theirs
- **Real-time Chat**: Message buyers, sellers, and classmates directly
- **Events**: Discover and register for campus events
- **AI-Powered Search**: Smart search across all campus data (coming soon)
- **JWT Authentication**: Secure API access

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- React Router DOM v7
- Lucide React icons

### Backend
- Spring Boot 3.5 (Modular Monolith)
- Spring Security + JWT
- Spring Data JPA
- WebSocket (STOMP) for real-time chat
- PostgreSQL (production) / H2 (testing)

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL (optional for development)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

The backend will run on `http://localhost:8080`

## Project Structure

```
OneCampus/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── data/          # Mock data (hardcoded)
│   │   └── styles/        # Global styles
│   └── package.json
└── backend/
    └── src/main/java/com/OneCampus/
        ├── common/        # Shared configs, security, exceptions
        ├── identity/      # Authentication & user management
        ├── marketplace/   # Marketplace listings
        ├── lostfound/     # Lost & Found items
        ├── chat/          # Real-time messaging
        └── event/         # Campus events
```

## License

MIT

"# onecampus" 
