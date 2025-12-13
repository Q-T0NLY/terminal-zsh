#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# NEXUSPRO ZSHRC VERIFICATION & DIAGNOSTIC TOOL
# ═══════════════════════════════════════════════════════════════════════════════

set -e

RESET='\033[0m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'

# ═══════════════════════════════════════════════════════════════════════════════
# VERIFICATION FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

check_zsh() {
    echo -e "${BLUE}🔍 Checking ZSH Installation...${RESET}"
    
    if command -v zsh &>/dev/null; then
        ZSH_VERSION=$(zsh --version)
        echo -e "${GREEN}✅ ZSH installed: $ZSH_VERSION${RESET}"
    else
        echo -e "${RED}❌ ZSH not found${RESET}"
        return 1
    fi
}

check_syntax() {
    echo -e "\n${BLUE}🔍 Checking .zshrc Syntax...${RESET}"
    
    if zsh -n ~/.zshrc 2>/dev/null; then
        echo -e "${GREEN}✅ .zshrc syntax valid${RESET}"
    else
        echo -e "${RED}❌ .zshrc has syntax errors${RESET}"
        zsh -n ~/.zshrc 2>&1 | head -20
        return 1
    fi
}

check_docker() {
    echo -e "\n${BLUE}🔍 Checking Docker Symlinks...${RESET}"
    
    if [[ -L /usr/local/bin/docker ]]; then
        DOCKER_TARGET=$(readlink /usr/local/bin/docker)
        if [[ -e "$DOCKER_TARGET" ]]; then
            echo -e "${GREEN}✅ Docker symlink valid: $DOCKER_TARGET${RESET}"
        else
            echo -e "${RED}❌ Docker symlink broken: $DOCKER_TARGET${RESET}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  No Docker symlink found${RESET}"
    fi
}

check_homebrew() {
    echo -e "\n${BLUE}🔍 Checking Homebrew...${RESET}"
    
    if command -v brew &>/dev/null; then
        BREW_VERSION=$(brew --version)
        echo -e "${GREEN}✅ Homebrew installed: $BREW_VERSION${RESET}"
        
        # Check for issues
        if brew doctor 2>&1 | grep -q "Warning"; then
            echo -e "${YELLOW}⚠️  Homebrew warnings found:${RESET}"
            brew doctor 2>&1 | grep "Warning" | head -5
        else
            echo -e "${GREEN}✅ No Homebrew issues${RESET}"
        fi
    else
        echo -e "${RED}❌ Homebrew not installed${RESET}"
        return 1
    fi
}

check_path() {
    echo -e "\n${BLUE}🔍 Checking PATH Configuration...${RESET}"
    
    # Check if /opt/homebrew/bin is first (for Apple Silicon)
    FIRST_PATH=$(echo $PATH | cut -d: -f1)
    
    if [[ "$FIRST_PATH" == "/opt/homebrew/bin" ]] || [[ "$FIRST_PATH" == "/usr/local/bin" ]]; then
        echo -e "${GREEN}✅ PATH order correct: $FIRST_PATH${RESET}"
    else
        echo -e "${YELLOW}⚠️  PATH first entry: $FIRST_PATH${RESET}"
    fi
}

check_powerlevel10k() {
    echo -e "\n${BLUE}🔍 Checking Powerlevel10k...${RESET}"
    
    if [[ -d ~/.p10k.zsh ]]; then
        echo -e "${GREEN}✅ Powerlevel10k config found${RESET}"
    elif [[ -f ~/.p10k.zsh ]]; then
        echo -e "${GREEN}✅ Powerlevel10k config file exists${RESET}"
    else
        echo -e "${YELLOW}⚠️  Powerlevel10k config not found${RESET}"
    fi
}

check_required_tools() {
    echo -e "\n${BLUE}🔍 Checking Required Tools...${RESET}"
    
    local tools=("git" "curl" "wget" "grep" "sed" "awk")
    local missing=0
    
    for tool in "${tools[@]}"; do
        if command -v "$tool" &>/dev/null; then
            echo -e "${GREEN}✅ $tool${RESET}"
        else
            echo -e "${RED}❌ $tool missing${RESET}"
            ((missing++))
        fi
    done
    
    [[ $missing -eq 0 ]] && return 0 || return 1
}

check_extensions() {
    echo -e "\n${BLUE}🔍 Checking Custom Extensions...${RESET}"
    
    if [[ -f ~/.zshrc_custom ]]; then
        echo -e "${GREEN}✅ Custom extensions file exists${RESET}"
        
        # Count functions
        FUNC_COUNT=$(grep -c "^[a-z_]*() {" ~/.zshrc_custom 2>/dev/null || echo 0)
        echo -e "   Functions defined: $FUNC_COUNT"
    else
        echo -e "${YELLOW}⚠️  Custom extensions not found${RESET}"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}════════════════════════════════════════════════════════════════════════${RESET}"
echo -e "${BLUE}     NEXUSPRO AI STUDIO v50.0 - ZSHRC VERIFICATION SUITE${RESET}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════════════${RESET}\n"

FAILED=0

check_zsh || ((FAILED++))
check_syntax || ((FAILED++))
check_docker || ((FAILED++))
check_homebrew || ((FAILED++))
check_path || ((FAILED++))
check_powerlevel10k || ((FAILED++))
check_required_tools || ((FAILED++))
check_extensions || ((FAILED++))

# ═══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════════════════════

echo -e "\n${BLUE}════════════════════════════════════════════════════════════════════════${RESET}"

if [[ $FAILED -eq 0 ]]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED - ZSHRC READY FOR PRODUCTION${RESET}"
    exit 0
else
    echo -e "${RED}❌ $FAILED CHECK(S) FAILED - REVIEW OUTPUT ABOVE${RESET}"
    exit 1
fi
