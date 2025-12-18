# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 7.x.x   | :white_check_mark: |
| < 7.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Publicly Disclose
Please do not open a public GitHub issue for security vulnerabilities.

### 2. Report Privately
Send details to the repository maintainers via:
- GitHub Security Advisories (preferred)
- Private email to maintainers

### 3. Include Details
Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 4. Response Timeline
- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-3 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Best effort

## Security Measures

### Automated Security Scanning

We employ multiple security scanning tools in our CI/CD pipeline:

1. **Trivy** - Vulnerability scanning
   - Scans for known CVEs
   - Checks Docker images
   - Analyzes dependencies

2. **CodeQL** - Static code analysis
   - Identifies security patterns
   - Detects common vulnerabilities
   - Weekly automated scans

3. **ShellCheck** - Shell script analysis
   - Identifies unsafe patterns
   - Prevents common mistakes

### Docker Security

Our Docker images follow security best practices:

1. **Multi-stage Builds**
   - Minimal attack surface
   - No build tools in production images

2. **Non-Root User**
   - All containers run as non-root user `nexus`
   - Reduced privilege escalation risk

3. **Health Checks**
   - Automated health monitoring
   - Early detection of issues

4. **Image Scanning**
   - Trivy scans on every build
   - No critical vulnerabilities allowed

### Code Security

1. **Dependency Management**
   - Regular dependency updates
   - Security patches prioritized
   - Automated vulnerability alerts

2. **Input Validation**
   - Pydantic models for API validation
   - Type checking with mypy
   - Schema validation

3. **Error Handling**
   - Secure error messages
   - No sensitive data in logs
   - Global exception handling

## Security Best Practices

### For Users

1. **Keep Updated**
   ```bash
   git pull origin main
   docker pull ghcr.io/q-t0nly/terminal-zsh:latest
   ```

2. **Environment Variables**
   - Never commit secrets
   - Use .env files (gitignored)
   - Rotate credentials regularly

3. **Docker Security**
   ```bash
   # Run as non-root
   docker run --user nexus terminal-zsh:latest
   
   # Limit resources
   docker run --memory=512m --cpus=1 terminal-zsh:latest
   ```

4. **Network Security**
   - Use HTTPS for API calls
   - Implement rate limiting
   - Use firewall rules

### For Developers

1. **Code Review**
   - All PRs require review
   - Security-focused review for sensitive code
   - Automated checks must pass

2. **Testing**
   - Include security tests
   - Test error handling
   - Validate input sanitization

3. **Logging**
   - No sensitive data in logs
   - Use appropriate log levels
   - Sanitize user input

4. **Dependencies**
   - Review new dependencies
   - Check for known vulnerabilities
   - Pin versions in production

## Vulnerability Disclosure

When we fix a security vulnerability:

1. **Private Fix**
   - Develop fix privately
   - Test thoroughly

2. **Coordinate Disclosure**
   - Notify affected users
   - Allow time for updates

3. **Public Disclosure**
   - Publish security advisory
   - Credit reporter (if desired)
   - Update CHANGELOG

## Security Checklist

Before deploying:

- [ ] All dependencies updated
- [ ] Security scans pass (Trivy, CodeQL)
- [ ] No secrets in code or configs
- [ ] Docker image scanned
- [ ] Health checks configured
- [ ] Logging configured properly
- [ ] Input validation in place
- [ ] Error handling tested
- [ ] Documentation updated

## Compliance

This security policy aligns with:
- OWASP Top 10
- CIS Docker Benchmark
- Container security best practices
- Secure coding standards

## Contact

For security concerns:
- GitHub Security Advisories: [Create Advisory](https://github.com/Q-T0NLY/terminal-zsh/security/advisories/new)
- Check GitHub Issues (for non-security bugs)

---

**Last Updated**: December 2024
**Next Review**: March 2025
