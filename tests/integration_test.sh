#!/usr/bin/env bash
# Integration tests for terminal-zsh system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TESTS_PASSED=0
TESTS_FAILED=0

# Test runner function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Running: $test_name ... "
    if eval "$test_command" &>/dev/null; then
        echo -e "${GREEN}PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
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
    "cd '$PROJECT_ROOT' && python3 -c 'import nexus_visuals'"

run_test "Import nexus_config" \
    "cd '$PROJECT_ROOT' && python3 -c 'import nexus_config'"

run_test "Import nexus_cache" \
    "cd '$PROJECT_ROOT' && python3 -c 'import nexus_cache'"

run_test "Import nexus_error_handler" \
    "cd '$PROJECT_ROOT' && python3 -c 'import nexus_error_handler'"

# Test script syntax
run_test "Install script syntax" \
    "bash -n '$PROJECT_ROOT/install.sh'"

run_test "Quick start script syntax" \
    "bash -n '$PROJECT_ROOT/quick_start.sh'"

# Test Python requirements
run_test "Requirements.txt valid" \
    "python3 -m pip install --dry-run -r '$PROJECT_ROOT/requirements.txt'"

# Test key functions
run_test "Nexus visuals help" \
    "cd '$PROJECT_ROOT' && python3 nexus_visuals.py --help"

# Test Docker
if command -v docker &>/dev/null; then
    run_test "Dockerfile syntax" \
        "cd '$PROJECT_ROOT' && docker build -t terminal-zsh-test -f Dockerfile . --no-cache"
else
    echo "Skipping Docker tests (docker not installed)"
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
