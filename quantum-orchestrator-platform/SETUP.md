# 🚀 Quick Start Guide - Quantum Orchestrator Platform

## 5-Minute Setup

### Step 1: Prerequisites
```bash
# Check Node.js version (18+ required)
node --version

# Check Docker installation
docker --version
docker-compose --version
```

### Step 2: Clone & Setup
```bash
# Navigate to project directory
cd quantum-orchestrator-platform

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Step 3: Start Services
```bash
# Start all services with Docker Compose
docker-compose up -d

# Wait for services to be healthy (30 seconds)
sleep 30

# Check services
docker-compose ps
```

### Step 4: Access Dashboard
```
Open in browser:
http://localhost:3000
```

---

## Dashboard Overview

### 1. Navigation Sidebar
- **Dashboard**: Executive metrics & KPIs
- **Agent Control**: Manage active agents
- **Workflows**: Build & deploy workflows
- **Integration**: Connect external systems
- **Analytics**: View performance metrics

### 2. Main Dashboard
Shows real-time KPIs:
- 🤖 Active Agents: 847
- ⚡ System Uptime: 99.97%
- 💰 Token Throughput: 12.4M/day
- ⏱️ Response Time: 142ms

### 3. Workflow Builder
**To create a workflow:**

1. Click on "Workflow Builder" in sidebar
2. Drag components from left toolbox
3. Drop onto canvas
4. Configure in properties panel
5. Click "Deploy" to run

---

## Common API Calls

### Get Status
```bash
curl http://localhost:3000/api/status
```

### Create Workflow
```bash
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{"name": "My Workflow", "nodes": []}'
```

### Get KPIs
```bash
curl http://localhost:3000/api/dashboard/kpi
```

---

## Development Commands

```bash
npm run start:dev      # Development mode
npm run build          # Build for production
npm run start:prod     # Run production
npm run test           # Run tests
npm run lint           # Lint code
```

---

## Docker Commands

```bash
docker-compose ps      # View services
docker-compose logs -f # View logs
docker-compose down    # Stop services
```

---

## Troubleshooting

### Service won't start
```bash
# Check logs
docker-compose logs app

# Rebuild
docker-compose up -d --build
```

### Database connection error
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

---

## File Structure
```
quantum-orchestrator-platform/
├── src/
│   ├── main.ts              # Entry point
│   ├── public/              # Dashboard UI
│   └── modules/             # Backend modules
├── docker-compose.yml       # Services
├── Dockerfile              # Container
└── README.md               # Full docs
```

---

## Next Steps

1. Explore the dashboard
2. Create your first workflow
3. Deploy agents
4. Monitor execution
5. Check analytics

---

**For detailed information, see [README.md](./README.md)**
