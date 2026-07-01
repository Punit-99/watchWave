# DevOps Learning Roadmap (Hands-on)

> **Goal:** Become job-ready in DevOps by learning through deploying real applications, not by memorizing tools.

---

# Current Project

Application: **WatchWave (Next.js + Prisma + Neon PostgreSQL)**

Current Status:

- ✅ Dockerized
- ✅ GitHub CI (Lint, Type Check, Docker Build)
- ✅ EC2 instance created
- ✅ SSH configured
- 🚧 Deployment in progress

---

# Phase 1 — Deploy the Application (Current Phase)

## Objective

Deploy WatchWave to AWS EC2 using a production-style workflow.

### Learning Goals

- EC2 fundamentals
- Docker deployment
- GitHub Container Registry (GHCR)
- CI/CD
- Docker Registry
- Production deployment flow

---

## Method 1 — Build on EC2

```
GitHub
    │
git clone
    │
EC2
    │
docker build
    │
docker run
```

### Learn

- Docker build
- Building images on servers
- Running containers manually

### Limitation

Small EC2 instances may not have enough RAM for large builds.

---

## Method 2 — Build on EC2 using Linux Swap

```
GitHub
    │
git clone
    │
EC2
    │
Enable Swap
    │
docker build
    │
docker run
```

### Learn

- Linux Swap
- Memory management
- OOM Killer
- Resource troubleshooting

### Purpose

Understanding Linux memory management.

---

## Method 3 — Build in CI (Recommended)

```
git push
    │
GitHub Actions
    │
Build Docker Image
    │
Push Image → GHCR
    │
EC2
    │
docker pull
    │
docker run
```

### Learn

- Docker Registry
- GitHub Container Registry (GHCR)
- Continuous Deployment
- Deploying pre-built images

This is the deployment strategy we'll implement.

---

# Deployment Architecture

```
Developer
     │
git push
     │
     ▼
GitHub Repository
     │
     ▼
GitHub Actions
     │
     ├── Install Dependencies
     ├── Type Check
     ├── Lint
     ├── Format Check
     ├── Build Docker Image
     └── Push Image to GHCR
                    │
                    ▼
       GitHub Container Registry
                    │
                    ▼
              AWS EC2 Instance
                    │
             docker pull
                    │
             docker run
                    │
                    ▼
             WatchWave Running
```

---

# CI vs CD

## Continuous Integration (CI)

Purpose:

Verify code automatically.

Pipeline:

```
Push
    │
Install
    │
Type Check
    │
Lint
    │
Tests
    │
Build
```

No deployment happens.

---

## Continuous Deployment (CD)

Purpose:

Deploy automatically after CI succeeds.

Pipeline:

```
Push
    │
CI
    │
Build Docker Image
    │
Push Registry
    │
Deploy EC2
```

---

# Topics Covered During Deployment

## Docker Registry

Purpose:

Store Docker images.

Examples:

- GitHub Container Registry (GHCR)
- Docker Hub
- Amazon ECR

---

## Why GHCR?

Current project is hosted on GitHub.

Advantages:

- Native GitHub integration
- Free for public repositories
- Simple authentication
- Easy GitHub Actions integration

Later we'll also learn:

- Docker Hub
- Amazon ECR

---

## Prisma Deployment Strategy

Development:

```
pnpm prisma migrate dev
```

Production:

```
pnpm prisma migrate deploy
```

Docker Build:

```
prisma generate
```

Deployment:

```
prisma migrate deploy
```

Important:

Never execute production migrations during `docker build`.

---

## Linux Swap

RAM is fast.

Swap is disk space used as overflow memory.

```
RAM Full
    │
Move inactive pages
    │
Swap
```

Purpose:

Prevent Out Of Memory (OOM) failures.

---

## OOM Killer

When RAM becomes full:

Linux terminates memory-heavy processes.

Typical Docker exit code:

```
137
```

Meaning:

```
Killed by Linux (SIGKILL)
```

---

## Docker HEALTHCHECK

Purpose:

Verify the application is actually responding.

Example:

```
Docker

↓

GET /health

↓

200 OK

↓

Healthy
```

Benefits:

- Detect hung applications
- Automatic restart
- Kubernetes compatibility
- ECS compatibility

---

## ENTRYPOINT

Instead of starting directly:

```
node server.js
```

We can execute startup tasks.

Example:

```
ENTRYPOINT

↓

Run Prisma Migration

↓

Warm Cache

↓

Start Server
```

Purpose:

Centralize startup logic.

---

# Production Hardening (After Deployment)

Once WatchWave is successfully deployed:

- Improve Dockerfile
- Add `.dockerignore`
- Add HEALTHCHECK
- Create ENTRYPOINT script
- Production Prisma migration strategy
- Nginx Reverse Proxy
- HTTPS (SSL)
- Automatic deployment
- Monitoring
- Logging
- Rollback strategy

---

# AWS Roadmap

## EC2

Learn:

- Instances
- Security Groups
- EBS
- Elastic IP
- SSH

---

## EBS

Understand:

- Storage
- Volume Types
- IOPS
- Throughput
- Pricing

Important:

Stopping EC2 stops compute charges.

Stopping EC2 **does not** stop EBS storage charges.

---

# Future DevOps Roadmap

After deployment:

1. Linux Deep Dive
2. Shell Scripting
3. Networking
4. Nginx
5. Docker Advanced
6. Docker Compose
7. GitHub Actions Advanced
8. Amazon ECR
9. AWS Services
10. Terraform
11. Kubernetes
12. Monitoring (Prometheus + Grafana)
13. Logging
14. Production Architecture
15. Scaling
16. Zero Downtime Deployments

---

# Final Goal

Deploy applications confidently using a production-grade workflow.

```
Developer
      │
Git Push
      │
GitHub Actions
      │
Docker Build
      │
Container Registry
      │
EC2 / ECS / Kubernetes
      │
Production Deployment
```
