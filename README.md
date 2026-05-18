
# TaskFlow — Full Stack OpenShift Deployment Guide

## Overview

TaskFlow is a full-stack task/project management application deployed using:

- Frontend: React + Vite + Nginx
- Backend: FastAPI + SQLAlchemy
- Database: PostgreSQL
- Containerization: Docker
- Orchestration: OpenShift / Kubernetes

This document captures:

- Architecture
- Local development setup
- Docker Compose setup
- OpenShift deployment
- Common issues encountered
- Debugging takeaways
- Kubernetes/OpenShift lessons learned
- Production considerations

---

# Architecture

## Application Components

### Frontend

- React + Vite
- Built into static assets
- Served through Nginx
- Exposed through OpenShift Route

### Backend

- FastAPI
- SQLAlchemy ORM
- REST API endpoints
- Connects to PostgreSQL through internal Kubernetes service

### Database

- PostgreSQL
- OpenShift-compatible PostgreSQL image
- Internal ClusterIP service

---

# Key Takeaways

1. OpenShift runs containers as non-root users.
2. Nginx must listen on port 8080, not 80.
3. Kubernetes startup order is not guaranteed.
4. Backend retry logic is essential.
5. Docker on Mac builds ARM images by default.
6. OpenShift nodes required AMD64 images.
7. Kubernetes Services depend entirely on labels/selectors.
8. Service selector mismatches result in ENDPOINTS <none>.
9. OpenShift-compatible PostgreSQL images avoid SCC permission issues.
10. Docker Compose behavior differs from Kubernetes/OpenShift behavior.

---

# Local Development

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

---

# Final Working Docker Compose

```yaml
version: "3.9"

services:
  frontend:
    build:
      context: ./frontend

    container_name: taskflow-frontend

    ports:
      - "5173:80"

    depends_on:
      - backend

    restart: always

  backend:
    build:
      context: ./backend

    container_name: taskflow-backend

    ports:
      - "8000:8000"

    environment:
      DATABASE_URL: postgresql://taskflowuser:postgres@db:5432/taskflow
      SECRET_KEY: supersecretkey
      ALGORITHM: HS256
      ACCESS_TOKEN_EXPIRE_MINUTES: 60
      CORS_ORIGINS: http://localhost:5173

    depends_on:
      - db

    restart: always

  db:
    image: postgres:16

    container_name: taskflow-db

    environment:
      POSTGRES_USER: taskflowuser
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: taskflow

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

    restart: always

volumes:
  postgres_data:
```

---

# Frontend nginx Configuration

```nginx
events {}

http {
    client_body_temp_path /tmp/nginx/client_temp;

    include /etc/nginx/mime.types;

    server {
        listen 8080;

        location / {
            root /usr/share/nginx/html;
            index index.html;

            try_files $uri $uri/ /index.html;
        }
    }
}
```

---

# Frontend Dockerfile

```dockerfile
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
```

---

# Backend Retry Logic

```python
MAX_RETRIES = 10
RETRY_DELAY = 5
```

This solves startup timing issues where Kubernetes starts the backend before PostgreSQL is ready.

---

# OpenShift PostgreSQL Deployment

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: taskflow-db

spec:
  replicas: 1

  selector:
    matchLabels:
      app: taskflow-db

  template:
    metadata:
      labels:
        app: taskflow-db

    spec:
      containers:
        - name: postgresql

          image: image-registry.openshift-image-registry.svc:5000/openshift/postgresql:13-el9

          ports:
            - containerPort: 5432

          env:
            - name: POSTGRESQL_USER
              value: taskflowuser

            - name: POSTGRESQL_PASSWORD
              value: postgres

            - name: POSTGRESQL_DATABASE
              value: taskflow
```

---

# Useful Commands

## Build Backend

```bash
docker buildx build   --platform linux/amd64   -t ghcr.io/mabedd/tasflow-backend:latest   --push ./backend
```

## Build Frontend

```bash
docker buildx build   --platform linux/amd64   -t ghcr.io/mabedd/tasflow-frontend:latest   --push ./frontend
```

## Deploy Kubernetes Resources

```bash
oc apply -f k8s/
```

## Restart Deployments

```bash
oc rollout restart deployment/taskflow-db
oc rollout restart deployment/taskflow-backend
oc rollout restart deployment/taskflow-frontend
```

## Watch Pods

```bash
oc get pods -w
```

## Get Routes

```bash
oc get routes
```

---

# Final Healthy State

```text
taskflow-db          1/1 Running
taskflow-backend     1/1 Running
taskflow-frontend    1/1 Running
```

---

# Final Notes

This deployment covered real-world cloud-native deployment concepts including:

- OpenShift SCCs
- Non-root containers
- Kubernetes networking
- Services and selectors
- Container image architecture
- Internal OpenShift image registries
- Docker Compose vs Kubernetes behavior
- Retry strategies
- React SPA routing with Nginx
- PostgreSQL compatibility with OpenShift
