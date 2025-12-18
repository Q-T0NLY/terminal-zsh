#!/usr/bin/env bats
# Unit tests for shell script functions

setup() {
    # Load any common test helpers
    export TEST_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")" && pwd)"
    export PROJECT_ROOT="$(cd "$TEST_DIR/../.." && pwd)"
}

teardown() {
    # Cleanup after each test
    :
}

@test "verify bash version" {
    run bash --version
    [ "$status" -eq 0 ]
}

@test "verify zsh is available" {
    run which zsh
    [ "$status" -eq 0 ]
}

@test "verify python3 is available" {
    run which python3
    [ "$status" -eq 0 ]
}

@test "verify python version is 3.9+" {
    run python3 -c "import sys; assert sys.version_info >= (3, 9)"
    [ "$status" -eq 0 ]
}

@test "can source install script without errors" {
    # Test that install.sh has valid syntax
    run bash -n "$PROJECT_ROOT/install.sh"
    [ "$status" -eq 0 ]
}

@test "shellcheck passes on install.sh" {
    if ! command -v shellcheck &> /dev/null; then
        skip "shellcheck not installed"
    fi
    run shellcheck -x "$PROJECT_ROOT/install.sh"
    [ "$status" -eq 0 ]
}

@test "verify core directories exist" {
    [ -d "$PROJECT_ROOT/src" ]
    [ -d "$PROJECT_ROOT/scripts" ]
}

@test "verify key files exist" {
    [ -f "$PROJECT_ROOT/README.md" ]
    [ -f "$PROJECT_ROOT/install.sh" ]
    [ -f "$PROJECT_ROOT/requirements.txt" ]
}

@test "requirements.txt is valid" {
    run python3 -m pip install --dry-run -r "$PROJECT_ROOT/requirements.txt"
    [ "$status" -eq 0 ]
}
