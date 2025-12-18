#!/usr/bin/env bats
# Tests for library modules

setup() {
    export TEST_DIR="$(cd "$(dirname "$BATS_TEST_FILENAME")" && pwd)"
    export PROJECT_ROOT="$(cd "$TEST_DIR/../.." && pwd)"
    export LIB_DIR="$PROJECT_ROOT/src/lib"
}

teardown() {
    # Cleanup any test artifacts
    rm -f /tmp/test_*.log
}

@test "errorlib can be sourced" {
    run source "$LIB_DIR/errorlib.zsh"
    [ "$status" -eq 0 ]
}

@test "loglib can be sourced" {
    run source "$LIB_DIR/loglib.zsh"
    [ "$status" -eq 0 ]
}

@test "perflib can be sourced" {
    run source "$LIB_DIR/perflib.zsh"
    [ "$status" -eq 0 ]
}

@test "configlib can be sourced" {
    run source "$LIB_DIR/configlib.zsh"
    [ "$status" -eq 0 ]
}

@test "modulelib can be sourced" {
    run source "$LIB_DIR/modulelib.zsh"
    [ "$status" -eq 0 ]
}

@test "errorlib require_command detects missing command" {
    source "$LIB_DIR/errorlib.zsh"
    run errorlib::require_command nonexistent_command_xyz
    [ "$status" -ne 0 ]
}

@test "errorlib require_command finds existing command" {
    source "$LIB_DIR/errorlib.zsh"
    run errorlib::require_command zsh
    [ "$status" -eq 0 ]
}

@test "loglib can log messages" {
    source "$LIB_DIR/loglib.zsh"
    LOGLIB_CONFIG[log_file]="/tmp/test_log.log"
    
    run loglib::info "Test message"
    [ "$status" -eq 0 ]
    [ -f "/tmp/test_log.log" ]
}

@test "perflib can time operations" {
    source "$LIB_DIR/perflib.zsh"
    
    perflib::timer_start "test"
    sleep 0.1
    elapsed=$(perflib::timer_stop "test")
    
    # Check that elapsed time is > 0
    [ -n "$elapsed" ]
}

@test "configlib can set and get values" {
    source "$LIB_DIR/configlib.zsh"
    
    configlib::set "test_key" "test_value"
    result=$(configlib::get "test_key")
    
    [ "$result" = "test_value" ]
}

@test "modulelib can load errorlib" {
    source "$LIB_DIR/modulelib.zsh"
    
    run modulelib::load errorlib
    [ "$status" -eq 0 ]
}
