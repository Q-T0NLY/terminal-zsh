#!/bin/zsh
################################################################################
#                   DEVELOPMENT TOOLS INTEGRATION MODULE                       #
#                Integration of Git, Docker, K8s, Cloud CLIs, Runtimes        #
################################################################################
#
# PURPOSE: Integrate and configure development tools
# DEPENDENCIES: pkgmgr.module, path.module
# STATUS: Production Ready
#
# This module:
# - Configures Git with best practices
# - Sets up Docker integration
# - Configures Kubernetes tools
# - Manages cloud CLI configuration
# - Integrates language runtimes
#
################################################################################

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 1. GIT CONFIGURATION                                                        ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Configure Git environment
setup_git() {
    if ! command -v git &>/dev/null; then
        log_message "WARN" "Git not found in PATH"
        return 1
    fi
    
    # Git configuration defaults (if not already set)
    if [[ -z "$(git config --global user.name)" ]]; then
        log_message "INFO" "Git user name not configured"
    fi
    
    if [[ -z "$(git config --global user.email)" ]]; then
        log_message "INFO" "Git user email not configured"
    fi
    
    # Enable useful Git settings
    git config --global core.ignorecase false 2>/dev/null
    git config --global init.defaultBranch main 2>/dev/null
    git config --global pull.rebase false 2>/dev/null
    git config --global core.pager "less -R" 2>/dev/null
    
    # Performance settings
    git config --global feature.manyFiles true 2>/dev/null
    
    # GPG signing (if available)
    if command -v gpg &>/dev/null; then
        git config --global commit.gpgSign false 2>/dev/null
    fi
    
    log_message "INFO" "Git environment configured"
}

# Git aliases for productivity
setup_git_aliases() {
    # Common git aliases
    git config --global alias.st "status" 2>/dev/null
    git config --global alias.co "checkout" 2>/dev/null
    git config --global alias.br "branch" 2>/dev/null
    git config --global alias.ci "commit" 2>/dev/null
    git config --global alias.unstage "reset HEAD --" 2>/dev/null
    git config --global alias.last "log -1 HEAD" 2>/dev/null
    git config --global alias.visual "log --graph --oneline --all" 2>/dev/null
    
    log_message "INFO" "Git aliases configured"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 2. DOCKER CONFIGURATION                                                     ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Setup Docker environment
setup_docker() {
    if ! command -v docker &>/dev/null; then
        log_message "INFO" "Docker not found in PATH"
        return 1
    fi
    
    # Docker configuration directory
    export DOCKER_CONFIG="${XDG_CONFIG_HOME}/docker"
    mkdir -p "$DOCKER_CONFIG"
    
    # Performance optimizations
    export DOCKER_BUILDKIT=1
    export COMPOSE_DOCKER_CLI_BUILD=1
    
    log_message "INFO" "Docker environment configured"
}

# Docker aliases for productivity
setup_docker_aliases() {
    alias d="docker"
    alias dc="docker compose"
    alias di="docker image"
    alias dps="docker ps"
    alias dpsa="docker ps -a"
    alias dpl="docker pull"
    alias dpsh="docker push"
    alias dbuild="docker build"
    alias drun="docker run"
    alias drmi="docker rmi"
    alias drm="docker rm"
    
    log_message "INFO" "Docker aliases configured"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 3. KUBERNETES CONFIGURATION                                                 ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Setup Kubernetes environment
setup_kubernetes() {
    if ! command -v kubectl &>/dev/null; then
        log_message "INFO" "kubectl not found in PATH"
        return 1
    fi
    
    # Kubernetes config directory
    export KUBECONFIG="${HOME}/.kube/config"
    
    # Enable kubectl auto-completion
    if command -v kubectl &>/dev/null; then
        source <(kubectl completion zsh) 2>/dev/null || true
    fi
    
    # Enable helm completion if available
    if command -v helm &>/dev/null; then
        source <(helm completion zsh) 2>/dev/null || true
    fi
    
    log_message "INFO" "Kubernetes environment configured"
}

# Kubernetes aliases for productivity
setup_kubernetes_aliases() {
    alias k="kubectl"
    alias kg="kubectl get"
    alias kd="kubectl describe"
    alias ka="kubectl apply"
    alias kdel="kubectl delete"
    alias klogs="kubectl logs"
    alias kexec="kubectl exec"
    alias kpf="kubectl port-forward"
    alias kctx="kubectl config current-context"
    alias kns="kubectl config set-context --current --namespace"
    
    log_message "INFO" "Kubernetes aliases configured"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 4. CLOUD CLI CONFIGURATION                                                  ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Setup AWS CLI
setup_aws_cli() {
    if ! command -v aws &>/dev/null; then
        log_message "INFO" "AWS CLI not found in PATH"
        return 1
    fi
    
    # AWS configuration
    export AWS_CONFIG_FILE="${HOME}/.aws/config"
    export AWS_CREDENTIALS_FILE="${HOME}/.aws/credentials"
    
    # Enable auto-completion
    source <(aws_completer) 2>/dev/null || true
    
    log_message "INFO" "AWS CLI environment configured"
}

# Setup Google Cloud SDK
setup_gcloud() {
    if [[ ! -d "${HOME}/google-cloud-sdk" ]]; then
        log_message "INFO" "Google Cloud SDK not found"
        return 1
    fi
    
    # Initialize gcloud environment
    source "${HOME}/google-cloud-sdk/path.zsh.inc" 2>/dev/null || true
    source "${HOME}/google-cloud-sdk/completion.zsh.inc" 2>/dev/null || true
    
    log_message "INFO" "Google Cloud SDK environment configured"
}

# Setup Azure CLI
setup_azure_cli() {
    if ! command -v az &>/dev/null; then
        log_message "INFO" "Azure CLI not found in PATH"
        return 1
    fi
    
    # Enable auto-completion
    source <(az completion script -l zsh) 2>/dev/null || true
    
    log_message "INFO" "Azure CLI environment configured"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 5. LANGUAGE RUNTIME CONFIGURATION                                           ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Setup Python environment
setup_python() {
    if [[ -d "${HOME}/.pyenv" ]]; then
        export PYENV_ROOT="${HOME}/.pyenv"
        eval "$(pyenv init -)" 2>/dev/null || true
        eval "$(pyenv virtualenv-init -)" 2>/dev/null || true
        log_message "INFO" "Python (pyenv) environment configured"
    elif command -v python3 &>/dev/null; then
        log_message "INFO" "Python environment configured"
    fi
}

# Setup Node.js environment
setup_nodejs() {
    if [[ -d "${HOME}/.nvm" ]]; then
        export NVM_DIR="${HOME}/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 2>/dev/null || true
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 2>/dev/null || true
        log_message "INFO" "Node.js (nvm) environment configured"
    elif command -v node &>/dev/null; then
        log_message "INFO" "Node.js environment configured"
    fi
}

# Setup Ruby environment
setup_ruby() {
    if [[ -d "${HOME}/.rbenv" ]]; then
        export RBENV_ROOT="${HOME}/.rbenv"
        eval "$(rbenv init -)" 2>/dev/null || true
        log_message "INFO" "Ruby (rbenv) environment configured"
    elif command -v ruby &>/dev/null; then
        log_message "INFO" "Ruby environment configured"
    fi
}

# Setup Rust environment
setup_rust() {
    if [[ -f "${HOME}/.cargo/env" ]]; then
        source "${HOME}/.cargo/env" 2>/dev/null || true
        log_message "INFO" "Rust environment configured"
    elif command -v rustc &>/dev/null; then
        log_message "INFO" "Rust environment configured"
    fi
}

# Setup Go environment
setup_go() {
    if command -v go &>/dev/null; then
        export GOPATH="${HOME}/go"
        mkdir -p "$GOPATH"
        log_message "INFO" "Go environment configured"
    fi
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 6. IDE INTEGRATION                                                           ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# VS Code configuration
setup_vscode() {
    if ! command -v code &>/dev/null; then
        log_message "INFO" "VS Code not found in PATH"
        return 1
    fi
    
    # VS Code configuration directory
    export VSCODE_USER_DIR="${HOME}/Library/Application Support/Code/User"
    
    log_message "INFO" "VS Code environment configured"
}

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║ 7. INITIALIZATION SEQUENCE                                                  ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Initialize all development tools
setup_git
setup_git_aliases
setup_docker && setup_docker_aliases
setup_kubernetes && setup_kubernetes_aliases
setup_aws_cli
setup_gcloud
setup_azure_cli
setup_python
setup_nodejs
setup_ruby
setup_rust
setup_go
setup_vscode

log_message "INFO" "Development tools module initialized"

################################################################################
# END OF DEVTOOLS.MODULE.ZSH
################################################################################
