# Documentation Index

Welcome to the Terminal-ZSH documentation! This index will help you find the information you need.

## 📚 Getting Started

- **[README](../README.md)** - Project overview and quick start
- **[Installation](../install.sh)** - Installation instructions
- **[Quick Start](../quick_start.sh)** - Get up and running quickly
- **[Contributing](../CONTRIBUTING.md)** - How to contribute to the project

## 🏗️ Architecture

### Architecture Decision Records (ADRs)
- **[001 - CI/CD Pipeline](adr/001-cicd-pipeline.md)** - Comprehensive CI/CD implementation
- **[002 - Docker Optimization](adr/002-docker-optimization.md)** - Multi-stage builds and security
- **[003 - Testing Infrastructure](adr/003-testing-infrastructure.md)** - Testing framework and strategy

## 📖 User Guides

- **[Configuration Reference](guides/configuration-reference.md)** - Complete configuration guide
- **[Troubleshooting](guides/troubleshooting.md)** - Common issues and solutions

## 🔒 Security

- **[Security Policy](../SECURITY.md)** - Security practices and reporting vulnerabilities
- **[Changelog](../CHANGELOG.md)** - Version history and changes

## 🛠️ Development

### Setup
- **[Development Setup](../CONTRIBUTING.md#development-setup)** - Local development environment
- **[Docker Compose](../docker-compose.yml)** - Local development with Docker
- **[Testing](../CONTRIBUTING.md#testing)** - Running and writing tests

### Code Quality
- **[Code Style Guide](../CONTRIBUTING.md#code-style)** - Python and Shell style guidelines
- **[Linting](../setup.cfg)** - Linter configurations
- **[Testing](../tests/)** - Test suite

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `setup.cfg` | Tool configuration (pytest, flake8, mypy) |
| `docker-compose.yml` | Local development environment |
| `Dockerfile` | Production container image |
| `.dockerignore` | Docker build context exclusions |
| `.gitignore` | Git ignore patterns |
| `requirements.txt` | Python dependencies |

## 🚀 CI/CD

### GitHub Actions Workflows
- **[CI Pipeline](.github/workflows/ci.yml)** - Automated testing and quality checks
- **[CodeQL Analysis](.github/workflows/codeql.yml)** - Security scanning
- **[Release Management](.github/workflows/release.yml)** - Automated releases

## 📊 API Documentation

### REST API
- **[API Server](../nexus_api.py)** - FastAPI REST API
- **Endpoints:**
  - `GET /` - Service information
  - `GET /health` - Health check
  - `GET /registry` - List registry entries
  - `POST /registry` - Register new entry
  - `GET /config` - Get configuration

## 🧪 Testing

### Test Organization
```
tests/
├── unit/              # Unit tests
│   ├── test_basics.bats          # Shell script tests
│   └── test_python_modules.py    # Python module tests
└── integration_test.sh            # Integration tests
```

### Running Tests
```bash
# Python tests
pytest tests/

# Shell tests
bats tests/unit/test_basics.bats

# Integration tests
bash tests/integration_test.sh

# All tests with coverage
pytest --cov=. --cov-report=html
```

## 📦 Deployment

### Docker
```bash
# Build image
docker build -t terminal-zsh:latest .

# Run container
docker run -p 8080:8080 terminal-zsh:latest

# Using docker-compose
docker-compose up
```

### Production
- See [Docker Optimization ADR](adr/002-docker-optimization.md)
- Multi-stage builds for minimal images
- Non-root user execution
- Health checks enabled

## 🔍 Code Organization

```
terminal-zsh/
├── .github/           # GitHub Actions workflows
├── docs/              # Documentation
│   ├── adr/          # Architecture decisions
│   ├── guides/       # User guides
│   └── api/          # API documentation
├── src/               # Source code
│   ├── core/         # Core functionality
│   ├── ui/           # User interface
│   ├── integrations/ # External integrations
│   └── modules/      # Modular components
├── scripts/           # Utility scripts
├── tests/             # Test suite
├── nexus_*.py         # Main Python modules
├── requirements.txt   # Dependencies
└── install.sh         # Installation script
```

## 🎯 Key Features

- **Quantum Visuals Engine** - 3D rendering and animations
- **AI/LLM Integration** - Code generation and analysis
- **Theme Management** - Customizable color schemes
- **Production Ready** - Docker, CI/CD, monitoring
- **Comprehensive Testing** - Unit, integration, and coverage
- **Security Hardened** - Scanning, validation, best practices

## 🔗 External Resources

- **GitHub Repository**: [Q-T0NLY/terminal-zsh](https://github.com/Q-T0NLY/terminal-zsh)
- **Issue Tracker**: [GitHub Issues](https://github.com/Q-T0NLY/terminal-zsh/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Q-T0NLY/terminal-zsh/discussions)

## 📝 Contributing

We welcome contributions! Please read:
1. [Contributing Guide](../CONTRIBUTING.md)
2. [Code of Conduct](../CONTRIBUTING.md#code-of-conduct)
3. [Security Policy](../SECURITY.md)

## 🆘 Support

- **Documentation**: Start here!
- **Troubleshooting**: [Troubleshooting Guide](guides/troubleshooting.md)
- **Issues**: [GitHub Issues](https://github.com/Q-T0NLY/terminal-zsh/issues)
- **Security**: [Security Policy](../SECURITY.md)

---

**Last Updated**: December 2024  
**Version**: 7.0.0+  
**Status**: Active Development
