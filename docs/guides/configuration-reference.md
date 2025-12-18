# Configuration Reference Guide

## Overview
This guide provides comprehensive documentation for configuring the terminal-zsh system.

## Configuration Files

### 1. Environment Variables

#### Required Variables
- `NEXUS_ENV` - Environment (development, staging, production)
- `PYTHON_VERSION` - Python version to use (default: 3.11)

#### Optional Variables
- `LOG_LEVEL` - Logging level (DEBUG, INFO, WARNING, ERROR)
- `NEXUS_CONFIG_PATH` - Custom config file path
- `NEXUS_CACHE_ENABLED` - Enable/disable caching (true/false)
- `NEXUS_DEBUG` - Debug mode (true/false)

### 2. setup.cfg

Controls pytest, flake8, mypy, and other tool configurations.

```ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
addopts = -v --cov=. --cov-report=html

[flake8]
max-line-length = 127
exclude = external,node_modules

[mypy]
python_version = 3.9
ignore_missing_imports = True
```

### 3. docker-compose.yml

Defines service configurations for local development.

```yaml
services:
  nexus-api:
    environment:
      - NEXUS_ENV=development
      - LOG_LEVEL=INFO
```

## Configuration Validation

Run the configuration validator:

```bash
python3 config_validator.py
```

## Environment-Based Configuration

### Development
```bash
export NEXUS_ENV=development
export LOG_LEVEL=DEBUG
export NEXUS_DEBUG=true
```

### Production
```bash
export NEXUS_ENV=production
export LOG_LEVEL=INFO
export NEXUS_DEBUG=false
export NEXUS_CACHE_ENABLED=true
```

## Configuration Management

### Loading Configuration
```python
from nexus_config import ConfigManager

config_mgr = ConfigManager()
config = config_mgr.config
```

### Accessing Configuration
```python
# Get specific value
env = config.environment

# Get with default
debug = config.get('debug', False)
```

## Best Practices

1. **Never commit secrets** - Use environment variables
2. **Validate configuration** - Run config_validator.py
3. **Document changes** - Update this guide
4. **Use profiles** - Different configs for different environments
5. **Version control** - Track configuration changes

## Troubleshooting

### Configuration Not Loading
- Check file permissions
- Verify environment variables are set
- Check for syntax errors with validator

### Invalid Configuration
- Run `python3 config_validator.py`
- Check error messages
- Verify against schema

### Environment Mismatch
- Ensure `NEXUS_ENV` is set correctly
- Check docker-compose environment section
- Verify .env files are loaded

## Examples

### Custom Configuration File
```bash
export NEXUS_CONFIG_PATH=/path/to/custom/config.json
```

### Override Cache Settings
```bash
export NEXUS_CACHE_ENABLED=false
```

### Development Mode
```bash
docker-compose up
# Automatically uses development configuration
```

### Production Deployment
```bash
export NEXUS_ENV=production
docker run -e NEXUS_ENV=production terminal-zsh:latest
```
