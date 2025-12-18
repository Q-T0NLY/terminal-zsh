# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### Issue: Install script fails
**Symptoms:**
- Error messages during `./install.sh`
- Dependencies not found

**Solutions:**
1. Check ZSH installation:
   ```bash
   which zsh
   zsh --version
   ```

2. Install missing dependencies:
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install zsh python3 python3-pip

   # macOS
   brew install zsh python3
   ```

3. Check permissions:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

#### Issue: Python version mismatch
**Symptoms:**
- "Python 3.9+ required" errors

**Solutions:**
```bash
# Check Python version
python3 --version

# Install Python 3.11
# Ubuntu
sudo apt-get install python3.11

# macOS
brew install python@3.11
```

### Docker Issues

#### Issue: Docker build fails
**Symptoms:**
- Build errors during `docker build`
- Layer caching issues

**Solutions:**
1. Clear Docker cache:
   ```bash
   docker builder prune -a
   ```

2. Build without cache:
   ```bash
   docker build --no-cache -t terminal-zsh:latest .
   ```

3. Check Docker version:
   ```bash
   docker --version
   # Requires Docker 20.10+
   ```

#### Issue: Container won't start
**Symptoms:**
- Container exits immediately
- Health check failures

**Solutions:**
1. Check logs:
   ```bash
   docker logs <container-id>
   ```

2. Run interactively:
   ```bash
   docker run -it terminal-zsh:latest /bin/bash
   ```

3. Verify health endpoint:
   ```bash
   docker exec <container-id> curl http://localhost:8080/health
   ```

### CI/CD Issues

#### Issue: Tests failing in CI
**Symptoms:**
- GitHub Actions workflow fails
- Tests pass locally but fail in CI

**Solutions:**
1. Check workflow logs in GitHub Actions

2. Run tests locally with same Python version:
   ```bash
   python3.11 -m pytest tests/
   ```

3. Check for environment differences:
   ```bash
   # Replicate CI environment
   docker run -it python:3.11-slim bash
   ```

#### Issue: Linting failures
**Symptoms:**
- flake8 or pylint errors in CI

**Solutions:**
1. Run linters locally:
   ```bash
   flake8 .
   pylint *.py
   black --check .
   ```

2. Auto-fix formatting:
   ```bash
   black .
   isort .
   ```

### Configuration Issues

#### Issue: Configuration not loading
**Symptoms:**
- Default values used instead of custom config
- Environment variables not recognized

**Solutions:**
1. Validate configuration:
   ```bash
   python3 config_validator.py
   ```

2. Check environment variables:
   ```bash
   env | grep NEXUS
   ```

3. Verify config file path:
   ```bash
   ls -la $NEXUS_CONFIG_PATH
   ```

### Performance Issues

#### Issue: Slow startup
**Symptoms:**
- Long initialization time
- High CPU usage on start

**Solutions:**
1. Enable caching:
   ```bash
   export NEXUS_CACHE_ENABLED=true
   ```

2. Check logs for bottlenecks:
   ```bash
   export LOG_LEVEL=DEBUG
   ```

3. Profile startup:
   ```bash
   time ./install.sh
   ```

### Import Errors

#### Issue: Module not found
**Symptoms:**
- `ImportError` or `ModuleNotFoundError`

**Solutions:**
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Check Python path:
   ```python
   import sys
   print(sys.path)
   ```

3. Verify module exists:
   ```bash
   python3 -c "import nexus_visuals"
   ```

## Getting Help

### Check Documentation
1. [Configuration Reference](./configuration-reference.md)
2. [API Documentation](../api/README.md)
3. Architecture Decision Records in `docs/adr/`

### Debug Mode
Enable debug logging:
```bash
export LOG_LEVEL=DEBUG
export NEXUS_DEBUG=true
```

### Report Issues
If you encounter bugs:
1. Check existing GitHub issues
2. Gather diagnostic information:
   ```bash
   # System info
   uname -a
   python3 --version
   zsh --version
   docker --version

   # Logs
   docker logs <container>
   cat /var/log/nexus/*.log
   ```
3. Create detailed issue report

## Prevention

### Best Practices
1. Always validate configuration before deployment
2. Run tests before committing
3. Use version pinning for dependencies
4. Keep documentation updated
5. Monitor CI/CD pipelines

### Regular Maintenance
```bash
# Update dependencies
pip install --upgrade -r requirements.txt

# Clean cache
docker builder prune
pip cache purge

# Validate setup
python3 config_validator.py
pytest tests/
```
