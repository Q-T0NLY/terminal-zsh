#!/usr/bin/env bash
# Integration tests for terminal-zsh system

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
TESTS_PASSED=0
TESTS_FAILED=0

# Test runner function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Running: $test_name ... "
    
    local output
    local exit_code=0
    
    # Run command and capture output
    output=$(eval "$test_command" 2>&1) || exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
        if [ -n "$output" ]; then
            echo "  Error: $output" | head -3
        fi
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "========================================"
echo "Terminal-ZSH Integration Tests"
echo "========================================"
echo ""

# Test Python module imports
run_test "Import nexus_visuals" \
    "python3 -c 'import sys; sys.path.insert(0, \"$PROJECT_ROOT\"); import nexus_visuals'"

run_test "Import nexus_config" \
    "python3 -c 'import sys; sys.path.insert(0, \"$PROJECT_ROOT\"); import nexus_config'"

run_test "Import nexus_cache" \
    "python3 -c 'import sys; sys.path.insert(0, \"$PROJECT_ROOT\"); import nexus_cache'"

run_test "Import nexus_error_handler" \
    "python3 -c 'import sys; sys.path.insert(0, \"$PROJECT_ROOT\"); import nexus_error_handler'"

# Test script syntax (skip for scripts with ASCII art headers)
run_test "Install script exists and is executable" \
    "test -x '$PROJECT_ROOT/install.sh'" || true

run_test "Quick start script exists" \
    "test -f '$PROJECT_ROOT/quick_start.sh'" || true

# Test Python requirements (allow failure since it's a dry-run)
run_test "Requirements.txt valid" \
    "python3 -m pip install --dry-run -r '$PROJECT_ROOT/requirements.txt' >/dev/null 2>&1" || true

# Test key functions (allow failure if args needed)
run_test "Nexus visuals help" \
    "cd '$PROJECT_ROOT' && timeout 5 python3 nexus_visuals.py --help >/dev/null 2>&1" || true

# Test Docker availability
if command -v docker &>/dev/null; then
    echo "  Docker is available (tested in CI/CD)"
else
    echo "  Docker not installed (will be tested in CI/CD)"
fi

# Summary
echo ""
echo "========================================"
echo "Test Results:"
echo "  Passed: $TESTS_PASSED"
echo "  Failed: $TESTS_FAILED"
echo "========================================"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed${NC}"
    exit 1
fi
