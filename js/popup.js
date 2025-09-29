// Main Popup Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('AnyModel 3D Studio initializing...');
    
    // Initialize all components
    initializeApp();
});

function initializeApp() {
    try {
        // Initialize Three.js manager
        threeManager = new ThreeJSManager();
        
        // Initialize modeling tools
        modelingTools = new ModelingTools(threeManager);
        
        // Initialize AI integration
        aiIntegration = new AIIntegration(threeManager, modelingTools);
        
        // Initialize export tools
        exportTools = new ExportTools(threeManager);
        
        // Setup event listeners
        setupEventListeners();
        
        // Initial status update
        updateStatus('AnyModel 3D Studio ready', 'success');
        
        console.log('All components initialized successfully');
        
    } catch (error) {
        console.error('Initialization error:', error);
        updateStatus('Initialization failed', 'error');
    }
}

function setupEventListeners() {
    // Header buttons
    document.getElementById('newProject').addEventListener('click', newProject);
    document.getElementById('saveProject').addEventListener('click', saveProject);
    document.getElementById('loadProject').addEventListener('click', loadProject);
    
    // Manual tool buttons
    document.getElementById('addCube').addEventListener('click', () => {
        modelingTools.createCube();
        setActiveTool('addCube');
    });
    
    document.getElementById('addSphere').addEventListener('click', () => {
        modelingTools.createSphere();
        setActiveTool('addSphere');
    });
    
    document.getElementById('addCylinder').addEventListener('click', () => {
        modelingTools.createCylinder();
        setActiveTool('addCylinder');
    });
    
    document.getElementById('addCone').addEventListener('click', () => {
        modelingTools.createCone();
        setActiveTool('addCone');
    });
    
    document.getElementById('addTorus').addEventListener('click', () => {
        modelingTools.createTorus();
        setActiveTool('addTorus');
    });
    
    // Transform tools
    document.getElementById('selectTool').addEventListener('click', () => {
        setActiveTool('selectTool');
    });
    
    document.getElementById('moveTool').addEventListener('click', () => {
        setActiveTool('moveTool');
    });
    
    document.getElementById('rotateTool').addEventListener('click', () => {
        setActiveTool('rotateTool');
    });
    
    document.getElementById('scaleTool').addEventListener('click', () => {
        setActiveTool('scaleTool');
    });
    
    // AI tool buttons
    document.getElementById('aiGenerate').addEventListener('click', () => {
        const prompt = document.getElementById('aiPrompt').value;
        if (prompt.trim()) {
            aiIntegration.generateFromPrompt(prompt);
        } else {
            updateStatus('Enter a description to generate with AI', 'error');
        }
    });
    
    document.getElementById('aiEdit').addEventListener('click', () => {
        const prompt = document.getElementById('aiPrompt').value;
        if (prompt.trim()) {
            aiIntegration.editSelected(prompt);
        } else {
            updateStatus('Enter editing instructions for AI', 'error');
        }
    });
    
    document.getElementById('aiOptimize').addEventListener('click', () => {
        aiIntegration.optimizeModel();
    });
    
    // AI prompt execution
    document.getElementById('executeAI').addEventListener('click', () => {
        const prompt = document.getElementById('aiPrompt').value;
        if (prompt.trim()) {
            aiIntegration.generateFromPrompt(prompt);
        } else {
            updateStatus('Enter a description to generate with AI', 'error');
        }
    });
    
    // AI prompt enter key
    document.getElementById('aiPrompt').addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const prompt = event.target.value;
            if (prompt.trim()) {
                aiIntegration.generateFromPrompt(prompt);
            }
        }
    });
    
    // Export buttons
    document.getElementById('exportSTL').addEventListener('click', () => {
        exportTools.exportSTL();
    });
    
    document.getElementById('exportOBJ').addEventListener('click', () => {
        exportTools.exportOBJ();
    });
    
    document.getElementById('exportGLTF').addEventListener('click', () => {
        exportTools.exportGLTF();
    });
    
    document.getElementById('exportPLY').addEventListener('click', () => {
        exportTools.exportPLY();
    });
    
    // Viewport controls
    document.getElementById('resetView').addEventListener('click', () => {
        threeManager.resetView();
    });
    
    document.getElementById('wireframe').addEventListener('click', () => {
        threeManager.toggleWireframe();
    });
    
    document.getElementById('lighting').addEventListener('click', () => {
        threeManager.toggleLighting();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // File drag and drop
    setupDragAndDrop();
    
    console.log('Event listeners setup complete');
}

function setActiveTool(toolId) {
    // Remove active class from all tools
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected tool
    document.getElementById(toolId).classList.add('active');
    
    updateStatus(`Tool: ${toolId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`, 'info');
}

function handleKeyboardShortcuts(event) {
    // Prevent shortcuts when typing in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (event.key.toLowerCase()) {
        case '1':
            document.getElementById('addCube').click();
            break;
        case '2':
            document.getElementById('addSphere').click();
            break;
        case '3':
            document.getElementById('addCylinder').click();
            break;
        case '4':
            document.getElementById('addCone').click();
            break;
        case '5':
            document.getElementById('addTorus').click();
            break;
        case 'delete':
        case 'backspace':
            event.preventDefault();
            threeManager.deleteSelected();
            break;
        case 'd':
            if (event.ctrlKey) {
                event.preventDefault();
                modelingTools.duplicateSelected();
            }
            break;
        case 's':
            if (event.ctrlKey) {
                event.preventDefault();
                saveProject();
            }
            break;
        case 'o':
            if (event.ctrlKey) {
                event.preventDefault();
                loadProject();
            }
            break;
        case 'n':
            if (event.ctrlKey) {
                event.preventDefault();
                newProject();
            }
            break;
        case 'r':
            document.getElementById('resetView').click();
            break;
        case 'w':
            document.getElementById('wireframe').click();
            break;
        case 'l':
            document.getElementById('lighting').click();
            break;
    }
}

function setupDragAndDrop() {
    const viewport = document.getElementById('viewport');
    
    viewport.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });
    
    viewport.addEventListener('drop', (event) => {
        event.preventDefault();
        
        const files = Array.from(event.dataTransfer.files);
        files.forEach(file => {
            if (file.type === 'application/json' || 
                file.name.toLowerCase().endsWith('.obj') ||
                file.name.toLowerCase().endsWith('.gltf') ||
                file.name.toLowerCase().endsWith('.glb')) {
                exportTools.importFile(file);
            } else {
                updateStatus('Unsupported file format for import', 'error');
            }
        });
    });
}

function newProject() {
    if (confirm('Create new project? This will clear the current scene.')) {
        // Clear all objects
        const objectsToRemove = [...threeManager.objects];
        objectsToRemove.forEach(object => {
            threeManager.removeObject(object);
        });
        
        // Reset camera
        threeManager.resetView();
        
        // Clear AI prompt
        document.getElementById('aiPrompt').value = '';
        
        updateStatus('New project created', 'success');
    }
}

async function saveProject() {
    try {
        const projectData = {
            version: '1.0',
            created: new Date().toISOString(),
            scene: threeManager.getScene().toJSON(),
            metadata: {
                objectCount: threeManager.objects.length,
                generator: 'AnyModel 3D Studio'
            }
        };
        
        const jsonString = JSON.stringify(projectData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        const filename = `anymodel_project_${new Date().toISOString().split('T')[0]}.json`;
        exportTools.downloadBlob(blob, filename);
        
        updateStatus('Project saved successfully', 'success');
        
    } catch (error) {
        console.error('Save project error:', error);
        updateStatus('Failed to save project', 'error');
    }
}

function loadProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const projectData = JSON.parse(e.target.result);
                    
                    // Clear current scene
                    newProject();
                    
                    // Load scene data
                    if (projectData.scene) {
                        const loader = new THREE.ObjectLoader();
                        const loadedScene = loader.parse(projectData.scene);
                        
                        loadedScene.traverse((child) => {
                            if (child.isMesh) {
                                child.userData.name = child.name || `Loaded_${Date.now()}`;
                                child.userData.type = 'Loaded';
                                threeManager.addObject(child);
                            }
                        });
                    }
                    
                    updateStatus('Project loaded successfully', 'success');
                    
                } catch (error) {
                    console.error('Load project error:', error);
                    updateStatus('Failed to load project', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

function updateStatus(message, type = 'info') {
    const statusElement = document.getElementById('statusText');
    statusElement.textContent = message;
    statusElement.className = type;
    
    // Clear status after 3 seconds unless it's an error
    if (type !== 'error') {
        setTimeout(() => {
            statusElement.textContent = 'Ready';
            statusElement.className = '';
        }, 3000);
    }
}

// Demo mode for showing capabilities
function runDemo() {
    updateStatus('Running demo...', 'loading');
    
    setTimeout(() => {
        // Create a house
        aiIntegration.generateFromPrompt('Create a simple house with a red roof');
    }, 500);
    
    setTimeout(() => {
        // Add a tree
        aiIntegration.generateFromPrompt('Add a tree next to the house');
    }, 2000);
    
    setTimeout(() => {
        // Add a car
        aiIntegration.generateFromPrompt('Add a red car in front of the house');
    }, 4000);
    
    setTimeout(() => {
        updateStatus('Demo completed! Try creating your own models.', 'success');
    }, 6000);
}

// Add demo button to UI programmatically
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const headerButtons = document.querySelector('.header-buttons');
        if (headerButtons) {
            const demoButton = document.createElement('button');
            demoButton.textContent = 'Demo';
            demoButton.className = 'btn btn-secondary';
            demoButton.onclick = runDemo;
            headerButtons.appendChild(demoButton);
        }
    }, 1000);
});

// Handle window resize
window.addEventListener('resize', () => {
    if (threeManager) {
        threeManager.onWindowResize();
    }
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any animations or heavy computations
        console.log('Extension hidden, pausing operations');
    } else {
        // Resume operations
        console.log('Extension visible, resuming operations');
    }
});

// Performance monitoring
function monitorPerformance() {
    setInterval(() => {
        if (threeManager && threeManager.renderer) {
            const info = threeManager.renderer.info;
            console.log('Render info:', {
                geometries: info.memory.geometries,
                textures: info.memory.textures,
                calls: info.render.calls,
                triangles: info.render.triangles,
                points: info.render.points
            });
        }
    }, 10000); // Log every 10 seconds
}

// Initialize performance monitoring in development
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'getPerformanceInfo') {
            sendResponse({
                objectCount: threeManager ? threeManager.objects.length : 0,
                renderInfo: threeManager ? threeManager.renderer.info : null
            });
        }
    });
}

console.log('AnyModel 3D Studio popup script loaded');