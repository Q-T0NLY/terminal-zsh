# Universal Plugin Registry

## Overview

The Universal Plugin Registry is a comprehensive system for managing plugins across the Enterprise AI Development Platform. It provides plugin registration, discovery, validation, lifecycle management, and hot-reload capabilities.

## Architecture

### Components

1. **UniversalRegistry** - Core registry engine
2. **PluginInterface** - Base plugin interfaces and types
3. **PluginLoader** - Dynamic plugin loading with hot reload
4. **PluginValidator** - Comprehensive validation system
5. **PluginStorage** - Persistence layer with caching

### Plugin Categories

- **AI_MODELS** - AI and ML model plugins
- **TOOLS** - Utility and tool plugins
- **PROCESSORS** - Data processing plugins
- **STORAGE** - Storage backend plugins
- **UI_COMPONENTS** - User interface components

## Plugin Development Guide

### Creating a Custom Plugin

```typescript
import { BasePlugin, PluginCategory } from './registry/PluginInterface';

export class MyCustomPlugin extends BasePlugin {
  constructor() {
    super({
      id: 'my-custom-plugin',
      name: 'My Custom Plugin',
      version: '1.0.0',
      category: PluginCategory.TOOLS,
      capabilities: ['custom-feature', 'data-processing'],
      dependencies: [],
      config: {
        apiKey: process.env.API_KEY,
        enabled: true
      }
    });
  }

  async init() {
    await super.init();
    // Initialize your plugin
    console.log('Plugin initialized');
  }

  async start() {
    await super.start();
    // Start your plugin
    console.log('Plugin started');
  }

  async stop() {
    await super.stop();
    // Stop your plugin
    console.log('Plugin stopped');
  }

  async destroy() {
    // Cleanup resources
    await super.destroy();
  }

  async healthCheck() {
    return {
      status: 'HEALTHY',
      timestamp: new Date(),
      metrics: {
        uptime: Date.now() - this.startTime?.getTime()
      }
    };
  }
}
```

### Plugin Lifecycle

1. **REGISTERED** - Plugin is registered in the system
2. **INITIALIZED** - Plugin init() method called
3. **RUNNING** - Plugin start() method called and actively running
4. **STOPPED** - Plugin stop() method called
5. **ERROR** - Plugin encountered an error
6. **DESTROYED** - Plugin resources cleaned up

### Testing Plugins

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { MyCustomPlugin } from './MyCustomPlugin';

describe('MyCustomPlugin', () => {
  let plugin: MyCustomPlugin;

  beforeEach(() => {
    plugin = new MyCustomPlugin();
  });

  it('should initialize successfully', async () => {
    await plugin.init();
    expect(plugin.getStatus()).toBe('INITIALIZED');
  });

  it('should start successfully', async () => {
    await plugin.init();
    await plugin.start();
    expect(plugin.getStatus()).toBe('RUNNING');
  });

  it('should pass health check', async () => {
    await plugin.init();
    await plugin.start();
    const health = await plugin.healthCheck();
    expect(health.status).toBe('HEALTHY');
  });
});
```

## API Reference

### Register Plugin

**POST** `/api/registry/plugins`

Register a new plugin in the system.

```bash
curl -X POST http://localhost:3000/api/registry/plugins \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Plugin",
    "version": "1.0.0",
    "category": "TOOLS",
    "capabilities": ["data-processing"],
    "dependencies": [],
    "config": {}
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "my-plugin-abc123",
    "name": "My Plugin",
    "version": "1.0.0",
    "status": "REGISTERED",
    "enabled": true
  }
}
```

### List Plugins

**GET** `/api/registry/plugins?category=TOOLS&enabled=true`

List all plugins with optional filters.

```bash
curl http://localhost:3000/api/registry/plugins
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### Get Plugin Details

**GET** `/api/registry/plugins/:id`

Get detailed information about a specific plugin.

```bash
curl http://localhost:3000/api/registry/plugins/my-plugin-abc123
```

### Update Plugin

**PUT** `/api/registry/plugins/:id`

Update plugin metadata.

```bash
curl -X PUT http://localhost:3000/api/registry/plugins/my-plugin-abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "config": { "newSetting": true }
  }'
```

### Delete Plugin

**DELETE** `/api/registry/plugins/:id`

Unregister a plugin from the system.

```bash
curl -X DELETE http://localhost:3000/api/registry/plugins/my-plugin-abc123
```

### Enable Plugin

**POST** `/api/registry/plugins/:id/enable`

Enable a disabled plugin.

```bash
curl -X POST http://localhost:3000/api/registry/plugins/my-plugin-abc123/enable
```

### Disable Plugin

**POST** `/api/registry/plugins/:id/disable`

Disable an active plugin.

```bash
curl -X POST http://localhost:3000/api/registry/plugins/my-plugin-abc123/disable
```

### Health Check

**GET** `/api/registry/plugins/:id/health`

Check plugin health status.

```bash
curl http://localhost:3000/api/registry/plugins/my-plugin-abc123/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "HEALTHY",
    "timestamp": "2025-12-18T15:00:00.000Z",
    "metrics": {
      "uptime": 3600000
    }
  }
}
```

### List Categories

**GET** `/api/registry/categories`

Get all available plugin categories.

```bash
curl http://localhost:3000/api/registry/categories
```

### Search Plugins

**POST** `/api/registry/search`

Search for plugins by name, category, or capabilities.

```bash
curl -X POST http://localhost:3000/api/registry/search \
  -H "Content-Type: application/json" \
  -d '{
    "name": "data",
    "capabilities": ["processing"]
  }'
```

## Security Best Practices

### Plugin Sandboxing

Plugins run with resource limits:
- **CPU:** Maximum 80% utilization
- **Memory:** Maximum 512MB
- **Network:** Controlled access

### Permissions

Define plugin permissions in metadata:

```typescript
{
  permissions: {
    fileAccess: true,
    networkAccess: true,
    databaseAccess: false
  }
}
```

### Code Signing

Validate plugin integrity with checksums:

```typescript
{
  checksum: "sha256:abc123..."
}
```

### Audit Logging

All plugin operations are logged:
- Registration/Unregistration
- Enable/Disable
- Start/Stop
- Health checks

## Performance Targets

- **Plugin Registration:** < 50ms
- **Plugin Discovery:** < 10ms
- **Plugin Loading:** < 200ms
- **Health Check:** < 5ms

## Code Examples

### Example 1: Simple Plugin

```typescript
import { BasePlugin, PluginCategory } from './registry/PluginInterface';

export class LoggerPlugin extends BasePlugin {
  constructor() {
    super({
      id: 'logger-plugin',
      name: 'Logger',
      version: '1.0.0',
      category: PluginCategory.TOOLS,
      capabilities: ['logging'],
      dependencies: [],
      config: {}
    });
  }

  async start() {
    await super.start();
    console.log('Logger plugin started');
  }
}
```

### Example 2: Plugin with Dependencies

```typescript
export class DatabasePlugin extends BasePlugin {
  constructor() {
    super({
      id: 'db-plugin',
      name: 'Database',
      version: '1.0.0',
      category: PluginCategory.STORAGE,
      capabilities: ['data-storage'],
      dependencies: ['logger-plugin'], // Depends on logger
      config: {
        connectionString: process.env.DB_URL
      }
    });
  }
}
```

### Example 3: Plugin Registration via API

```typescript
import axios from 'axios';

async function registerPlugin() {
  const response = await axios.post('http://localhost:3000/api/registry/plugins', {
    name: 'My Analytics Plugin',
    version: '1.0.0',
    category: 'TOOLS',
    capabilities: ['analytics', 'reporting'],
    config: {
      apiKey: 'secret-key'
    }
  });

  console.log('Plugin registered:', response.data);
}
```

## Troubleshooting

### Plugin Won't Start

1. Check dependencies are registered
2. Verify configuration is valid
3. Check health status
4. Review logs for errors

### Plugin Performance Issues

1. Monitor resource usage
2. Check rate limiting
3. Review health metrics
4. Optimize plugin code

### Dependency Conflicts

1. Use `GET /api/registry/plugins/:id` to check dependencies
2. Ensure all dependencies are registered
3. Check for circular dependencies
4. Update plugin versions if needed
