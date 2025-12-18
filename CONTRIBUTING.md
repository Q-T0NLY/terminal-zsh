# Contributing to Terminal-ZSH

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Documentation](#documentation)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/terminal-zsh.git
   cd terminal-zsh
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Q-T0NLY/terminal-zsh.git
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites
- Python 3.9+
- ZSH 5.0+
- Docker (optional)
- Git

### Install Dependencies

```bash
# Python dependencies
pip install -r requirements.txt

# Development dependencies
pip install pytest pytest-cov flake8 pylint black isort mypy

# Shell testing (optional)
# Ubuntu/Debian
sudo apt-get install bats

# macOS
brew install bats-core
```

### Local Development

```bash
# Run with docker-compose
docker-compose up

# Or run locally
python3 nexus_api.py

# Run tests
pytest tests/

# Run linters
flake8 .
pylint *.py
black --check .
shellcheck scripts/*.sh
```

## Making Changes

### Best Practices

1. **Keep changes focused** - One feature/fix per PR
2. **Write tests** - Add tests for new functionality
3. **Update documentation** - Keep docs in sync with code
4. **Follow style guide** - Use provided linters
5. **Commit messages** - Clear and descriptive

### Commit Message Format

```
type(scope): brief description

Detailed explanation if needed

Fixes #issue_number
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(api): add health check endpoint

Added /health endpoint for container orchestration.
Returns status, version, and uptime.

Fixes #123
```

## Testing

### Run Tests

```bash
# All tests
pytest tests/

# Specific test file
pytest tests/unit/test_python_modules.py

# With coverage
pytest --cov=. --cov-report=html

# Shell tests
bats tests/unit/test_basics.bats

# Integration tests
bash tests/integration_test.sh
```

### Writing Tests

**Python tests** - Use pytest:
```python
def test_feature():
    """Test description"""
    result = my_function()
    assert result == expected
```

**Shell tests** - Use BATS:
```bash
@test "description" {
    run command
    [ "$status" -eq 0 ]
}
```

### Test Coverage

- Aim for >70% coverage
- Test happy paths and edge cases
- Include error handling tests

## Submitting Changes

### Before Submitting

1. **Run all checks**
   ```bash
   # Linting
   flake8 .
   pylint *.py
   black --check .
   shellcheck scripts/*.sh
   
   # Tests
   pytest tests/
   
   # Configuration validation
   python3 config_validator.py
   ```

2. **Update documentation**
   - Update README if needed
   - Add/update docstrings
   - Update CHANGELOG.md

3. **Ensure clean git history**
   ```bash
   git rebase -i main
   # Squash fixup commits
   ```

### Pull Request Process

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Clear title and description
   - Reference related issues
   - Include test results
   - Add screenshots for UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests
   - [ ] Updated documentation
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No new warnings
   ```

4. **Review Process**
   - Maintainers will review
   - Address feedback
   - CI/CD must pass
   - At least one approval required

## Code Style

### Python

Follow PEP 8 with these tools:
```bash
# Format code
black .
isort .

# Check style
flake8 .
pylint *.py

# Type checking
mypy *.py
```

**Key points:**
- Max line length: 127 characters
- Use type hints
- Write docstrings
- Use f-strings for formatting

Example:
```python
def process_data(items: List[str]) -> Dict[str, int]:
    """
    Process items and return counts.
    
    Args:
        items: List of items to process
        
    Returns:
        Dictionary mapping items to counts
    """
    return {item: items.count(item) for item in set(items)}
```

### Shell Scripts

Follow ShellCheck recommendations:
```bash
shellcheck -x script.sh
```

**Key points:**
- Use `#!/usr/bin/env bash` shebang
- Quote variables: `"$var"`
- Use arrays for lists
- Check exit codes
- Add error handling

Example:
```bash
#!/usr/bin/env bash
set -euo pipefail

function process_file() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        echo "Error: File not found" >&2
        return 1
    fi
    
    # Process file
}
```

### Documentation

- Use Markdown for docs
- Include code examples
- Keep it concise and clear
- Update when changing code

## Project Structure

```
terminal-zsh/
├── .github/workflows/    # CI/CD pipelines
├── docs/                 # Documentation
│   ├── adr/             # Architecture decisions
│   ├── guides/          # User guides
│   └── api/             # API documentation
├── src/                  # Source code
├── scripts/              # Utility scripts
├── tests/                # Test files
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
├── requirements.txt      # Python dependencies
├── setup.cfg            # Tool configuration
└── docker-compose.yml   # Local development
```

## Need Help?

- Check [documentation](docs/)
- Read [troubleshooting guide](docs/guides/troubleshooting.md)
- Open a discussion on GitHub
- Review existing issues and PRs

## Recognition

Contributors will be:
- Listed in release notes
- Credited in commits
- Recognized in project documentation

Thank you for contributing! 🚀
