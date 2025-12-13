# 🚀 Quantum Orchestrator - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Navigate to Project
```bash
cd quantum-orchestrator-platform
```

### Step 2: Install & Configure
```bash
# Copy environment file
cp .env.example .env.local

# Install dependencies
npm install
```

### Step 3: Start Services
```bash
# Option A: With Docker (Recommended)
docker-compose up -d

# Option B: Without Docker (requires PostgreSQL + Redis running)
npm run start:dev
```

### Step 4: Access Dashboard
```
Dashboard: http://localhost:3000
API Docs: http://localhost:3000/api
```

## 📊 Dashboard Overview

### Key Sections

**Left Sidebar** - Navigation
- Executive Intelligence
- Agent Control Board  
- Tokenization Center
- Core Systems

**Main Workspace** - Workflow Building
- Toolbox (left) - Drag agent components
- Canvas (center) - Visual workflow design
- Properties (right) - Agent configuration

**Top Metrics** - Real-time KPIs
- Active Agents: 847
- System Uptime: 99.97%
- Token Throughput: 12.4M/day
- Avg Response: 142ms

## 🎯 Build Your First Workflow

1. **Drag Components**
   - Open Web Search from toolbox
   - Drag to canvas

2. **Configure Agent**
   - Set timeout to 30s
   - Adjust confidence to 85%

3. **Add More Agents**
   - Add Content Parser
   - Add AI Analysis

4. **Connect Agents**
   - Connect output port to input port

5. **Deploy**
   - Click "Deploy" button
   - Monitor real-time execution

## 🔧 Common Commands

```bash
# Development
npm run start:dev          # Run with hot-reload
npm run lint              # Check code quality
npm run test              # Run tests

# Building
npm run build             # Compile TypeScript
npm run start:prod        # Run production build

# Docker
docker-compose up -d      # Start full stack
docker-compose down       # Stop services
docker-compose logs -f    # View logs

# Database
npm run migration:generate # Create migration
npm run migration:run      # Run migrations
```

## 📁 Project Structure

```
quantum-orchestrator-platform/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── modules/
│   │   ├── dashboard/          # Dashboard tab system
│   │   ├── agent/              # Agent management
│   │   ├── integration/        # System integration
│   │   └── analytics/          # Metrics & analytics
│   └── public/
│       ├── index.html          # Web UI
│       ├── styles.css          # Styling
│       └── app.js              # Frontend logic
├── docker-compose.yml          # Docker services
├── Dockerfile                  # Container config
└── package.json               # Dependencies
```

## 🌐 API Examples

### Create Workflow
```bash
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Workflow",
    "nodes": [
      {"id": "n1", "name": "Search", "type": "web-search"},
      {"id": "n2", "name": "Parse", "type": "parser"}
    ]
  }'
```

### Get All Workflows
```bash
curl http://localhost:3000/api/workflows
```

### Deploy Workflow
```bash
curl -X POST http://localhost:3000/api/workflows/workflow-id/deploy
```

### Get KPIs
```bash
curl http://localhost:3000/api/dashboard/kpi
```

## 🎨 Customize Theme

Click the theme button in top-right corner:
- **Dark** - Default dark theme (Recommended)
- **Light** - Clean light theme
- **Blue** - Modern blue theme

Theme selection is saved automatically.

## 🔐 Default Credentials

```
Database Admin
- User: postgres
- Password: quantum
- Database: quantum_orchestrator

PgAdmin (Database Management)
- URL: http://localhost:5050
- Email: admin@quantum.local
- Password: admin
```

⚠️ **Change default passwords in production!**

## 📈 Monitoring

### Real-time Metrics
- View live agent status
- Monitor token usage
- Track system uptime
- Analyze performance trends

### Logs
```bash
# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres

# View Redis logs
docker-compose logs -f redis
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env.local
PORT=3001

# Or kill existing process
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Ensure PostgreSQL is running
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- **API Documentation**: [API Docs](./API_DOCS.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)

## 🤖 Next Steps

1. **Explore Dashboard** - Familiarize with all tabs
2. **Build Workflows** - Create custom agent pipelines
3. **Deploy Agents** - Run your first workflow
4. **Monitor Performance** - Check metrics and logs
5. **Integrate Systems** - Connect external services

## ✨ Key Features to Try

- **Visual Workflow Builder** - Drag-drop agent design
- **Real-time Monitoring** - Live performance metrics
- **AI Suggestions** - Get optimization recommendations
- **Multi-theme Support** - Customize your interface
- **REST API** - Programmatic workflow management
- **Docker Deployment** - Production-ready setup

## 🆘 Need Help?

- Check [README.md](./README.md) for full documentation
- Review error logs: `docker-compose logs`
- Create GitHub issue for bugs
- Email: support@quantum-orchestrator.io

---

**Happy orchestrating! 🚀**
