# TicketBox - Online Event Ticketing Platform

## Project Overview
TicketBox is a high-performance online event ticketing platform built with a Microservices Architecture. Users can browse events, book tickets, manage accounts, and handle payments.

## Architecture
- **Frontend**: React 19 + Vite (rolldown-vite) + Tailwind CSS — located in `web/web-app/`
- **Backend**: Java 21 + Spring Boot 3.2 microservices (not running in Replit — requires Docker/full stack)
- **API Gateway**: Nginx (gateway/)
- **Services**: identity, event, booking, ticket, payment, seat, notification, statistical, voucher

## Running in Replit
Only the frontend is configured to run in Replit. The full backend stack requires Docker Compose with MySQL, MongoDB, Redis, and RabbitMQ.

### Frontend Workflow
- **Workflow**: "Start application"
- **Command**: `cd web/web-app && npm run dev`
- **Port**: 5000
- **Host**: 0.0.0.0 (configured in vite.config.js)
- **AllowedHosts**: true (proxy-safe)

## Deployment
- **Target**: Static site
- **Build**: `cd web/web-app && npm run build`
- **Public Dir**: `web/web-app/dist`

## Package Management
- Frontend: npm (in `web/web-app/`)
- Backend: Maven (per-service pom.xml)

## Key Files
- `web/web-app/vite.config.js` — Vite configuration (port, host, proxy settings)
- `web/web-app/src/` — React source code
- `docker-compose.yml` — Full stack orchestration (requires Docker)
- `gateway/` — Nginx API Gateway config
- `services/` — Java Spring Boot microservices
