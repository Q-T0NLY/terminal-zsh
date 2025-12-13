// Quantum Orchestrator Dashboard - Application Logic
class QuantumDashboard {
    constructor() {
        this.nodeCounter = 0;
        this.nodes = new Map();
        this.connections = [];
        this.selectedNode = null;
        this.initializeUI();
        this.setupEventListeners();
    }

    initializeUI() {
        // Theme switching
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                document.body.className = theme;
                localStorage.setItem('theme', theme);
            });
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'theme-dark';
        document.body.className = savedTheme;

        // Setup drag and drop
        this.setupDragAndDrop();

        // Update slider values in real-time
        this.setupSliders();
    }

    setupEventListeners() {
        // Canvas drop zone
        const dropZone = document.getElementById('dropZone');
        const canvas = document.getElementById('canvas');

        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('active');
        });

        canvas.addEventListener('dragleave', (e) => {
            if (e.target === canvas) {
                dropZone.classList.remove('active');
            }
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('active');
            
            const componentName = e.dataTransfer.getData('text/plain');
            const componentType = e.dataTransfer.getData('type');
            
            this.addNodeToCanvas(componentName, componentType, e.offsetX, e.offsetY);
        });

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    setupDragAndDrop() {
        const toolItems = document.querySelectorAll('.tool-item');

        toolItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const componentName = item.querySelector('span').textContent;
                const componentType = item.getAttribute('data-type');
                
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', componentName);
                e.dataTransfer.setData('type', componentType);
                
                document.getElementById('dropZone').classList.add('active');
            });

            item.addEventListener('dragend', () => {
                document.getElementById('dropZone').classList.remove('active');
            });
        });
    }

    setupSliders() {
        document.querySelectorAll('.slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                const valueSpan = e.target.parentElement.querySelector('.slider-value');
                
                if (e.target.id === 'confidence') {
                    valueSpan.textContent = value + '%';
                } else if (e.target.id === 'timeout') {
                    valueSpan.textContent = value + 's';
                } else {
                    valueSpan.textContent = value;
                }
            });
        });
    }

    addNodeToCanvas(name, type, x, y) {
        const nodeId = `node-${++this.nodeCounter}`;
        
        const node = document.createElement('div');
        node.className = 'agent-node fade-in';
        node.id = nodeId;
        node.style.top = y + 'px';
        node.style.left = x + 'px';

        const nodeTypeLabel = this.getNodeTypeLabel(type);
        const nodeIcon = this.getNodeIcon(type);
        const nodeDescription = this.getNodeDescription(name);

        node.innerHTML = `
            <div class="node-header">
                <div class="node-title">${name}</div>
                <div class="node-type">${nodeTypeLabel}</div>
            </div>
            <div class="node-body" style="font-size: 12px; color: var(--text-secondary); margin-bottom: 10px;">
                ${nodeDescription}
            </div>
            <div class="node-ports">
                <div class="port input" title="Input port"></div>
                <div class="port output" title="Output port"></div>
            </div>
            <button class="close-btn" style="position: absolute; top: 5px; right: 5px; background: var(--danger); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px;">×</button>
        `;

        // Make node draggable
        this.makeDraggable(node);

        // Add click handler
        node.addEventListener('click', () => {
            document.querySelectorAll('.agent-node').forEach(n => n.classList.remove('active'));
            node.classList.add('active');
            this.selectedNode = { id: nodeId, name, type };
            this.updatePropertiesPanel(name, type);
        });

        // Add close button handler
        node.querySelector('.close-btn').addEventListener('click', () => {
            node.remove();
            this.nodes.delete(nodeId);
        });

        // Add to canvas
        const canvas = document.getElementById('canvas');
        canvas.appendChild(node);
        this.nodes.set(nodeId, { name, type, element: node });

        // Hide drop zone if this is the first node
        if (this.nodes.size > 0) {
            document.getElementById('dropZone').style.display = 'none';
        }

        // Select the new node
        node.click();
    }

    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('close-btn')) return;
            
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;

            const moveHandler = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                element.style.top = (element.offsetTop - pos2) + 'px';
                element.style.left = (element.offsetLeft - pos1) + 'px';
            };

            const upHandler = () => {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            };

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        });
    }

    getNodeTypeLabel(type) {
        const labels = {
            'orchestrator': 'Orchestrator',
            'router': 'Router',
            'balancer': 'Balancer',
            'scheduler': 'Scheduler',
            'data-processing': 'Processor',
            'api-gateway': 'Gateway',
            'security': 'Security',
            'ml-training': 'Training',
            'ml-inference': 'Inference',
            'ml-analysis': 'Analysis',
            'text-generation': 'Generator',
            'code-generation': 'CodeGen',
            'conversation': 'Chat'
        };
        return labels[type] || 'Agent';
    }

    getNodeIcon(type) {
        const icons = {
            'orchestrator': 'fas fa-compass',
            'router': 'fas fa-route',
            'balancer': 'fas fa-weight-hanging',
            'scheduler': 'fas fa-calendar-alt'
        };
        return icons[type] || 'fas fa-robot';
    }

    getNodeDescription(name) {
        const descriptions = {
            'Orchestrator': 'Coordinates workflow execution and task distribution',
            'Router': 'Routes messages and requests intelligently',
            'Load Balancer': 'Distributes load across available resources',
            'Scheduler': 'Manages task scheduling and execution timing',
            'Data Processing': 'Processes and transforms data streams',
            'API Gateway': 'Manages API traffic and rate limiting',
            'Security': 'Enforces security policies and encryption',
            'Model Training': 'Trains machine learning models',
            'Model Inference': 'Runs inference with trained models',
            'Analysis': 'Analyzes patterns and insights',
            'Text Generation': 'Generates natural language text',
            'Code Generator': 'Generates code from specifications',
            'Conversational AI': 'Handles natural language conversations'
        };
        return descriptions[name] || 'Specialized agent component';
    }

    updatePropertiesPanel(name, type) {
        document.getElementById('agent-name').value = name;
        document.getElementById('agent-type').value = this.getNodeTypeLabel(type).toLowerCase();

        // Update other properties based on type
        const typeSelect = document.getElementById('agent-type');
        if (type === 'orchestrator' || type === 'router' || type === 'balancer') {
            typeSelect.value = 'orchestrator';
        } else if (type.includes('ml') || type.includes('generation') || type === 'conversation') {
            typeSelect.value = 'processor';
        }
    }

    // Export workflow configuration
    exportWorkflow() {
        const workflow = {
            name: 'Custom Workflow',
            created: new Date().toISOString(),
            nodes: Array.from(this.nodes.entries()).map(([id, data]) => ({
                id,
                name: data.name,
                type: data.type,
                position: {
                    top: data.element.style.top,
                    left: data.element.style.left
                }
            })),
            connections: this.connections
        };

        console.log('Workflow exported:', workflow);
        return workflow;
    }

    // Validate workflow
    validateWorkflow() {
        if (this.nodes.size === 0) {
            alert('Workflow is empty!');
            return false;
        }

        console.log('Workflow validation passed');
        return true;
    }

    // Deploy workflow
    async deployWorkflow() {
        if (!this.validateWorkflow()) return;

        const workflow = this.exportWorkflow();
        console.log('Deploying workflow:', workflow);

        try {
            const response = await fetch('/api/workflows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workflow)
            });

            if (response.ok) {
                alert('Workflow deployed successfully!');
            } else {
                alert('Failed to deploy workflow');
            }
        } catch (error) {
            console.error('Deployment error:', error);
            alert('Deployment error: ' + error.message);
        }
    }
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new QuantumDashboard();

    // Setup button handlers
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            window.dashboard.deployWorkflow();
        });
    });

    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            const workflow = window.dashboard.exportWorkflow();
            const dataStr = JSON.stringify(workflow, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `workflow-${Date.now()}.json`;
            link.click();
        });
    });

    console.log('✨ Quantum Orchestrator Dashboard initialized');
});
