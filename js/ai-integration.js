// AI Integration for Intelligent 3D Modeling
class AIIntegration {
    constructor(threeManager, modelingTools) {
        this.threeManager = threeManager;
        this.modelingTools = modelingTools;
        this.apiKey = null;
        this.isProcessing = false;
        this.cache = new Map();
        this.loadAPIKey();
    }

    async loadAPIKey() {
        // In a real implementation, this would come from chrome.storage
        // For demo purposes, we'll use a placeholder
        try {
            const result = await chrome.storage.sync.get(['openai_api_key']);
            this.apiKey = result.openai_api_key;
        } catch (error) {
            console.log('API key not found, using simulation mode');
        }
    }

    async generateFromPrompt(prompt) {
        if (this.isProcessing) {
            this.updateStatus('AI is already processing...', 'loading');
            return;
        }

        this.isProcessing = true;
        this.updateStatus('AI generating model...', 'loading');

        try {
            // Check cache first
            const cacheKey = this.generateCacheKey(prompt);
            if (this.cache.has(cacheKey)) {
                const cachedResult = this.cache.get(cacheKey);
                this.executeGenerationPlan(cachedResult);
                this.updateStatus('Model generated from cache', 'success');
                return;
            }

            // Simulate AI processing or use real API
            let generationPlan;
            if (this.apiKey) {
                generationPlan = await this.callOpenAI(prompt);
            } else {
                generationPlan = this.simulateAIGeneration(prompt);
            }

            // Cache the result
            this.cache.set(cacheKey, generationPlan);

            // Execute the generation plan
            this.executeGenerationPlan(generationPlan);
            this.updateStatus('AI model generated successfully', 'success');

        } catch (error) {
            console.error('AI generation error:', error);
            this.updateStatus('AI generation failed', 'error');
        } finally {
            this.isProcessing = false;
        }
    }

    async callOpenAI(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert 3D modeling assistant. Given a description, provide a JSON plan for creating 3D objects. 
                        Response format:
                        {
                            "objects": [
                                {
                                    "type": "cube|sphere|cylinder|cone|torus|custom",
                                    "name": "object_name",
                                    "position": [x, y, z],
                                    "rotation": [x, y, z],
                                    "scale": [x, y, z],
                                    "color": "hex_color",
                                    "parameters": {}
                                }
                            ],
                            "reasoning": "explanation of choices"
                        }`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    }

    simulateAIGeneration(prompt) {
        const lowercasePrompt = prompt.toLowerCase();
        
        // Analyze prompt and generate appropriate objects
        if (lowercasePrompt.includes('house') || lowercasePrompt.includes('building')) {
            return this.generateHousePlan();
        } else if (lowercasePrompt.includes('car') || lowercasePrompt.includes('vehicle')) {
            return this.generateCarPlan();
        } else if (lowercasePrompt.includes('tree') || lowercasePrompt.includes('forest')) {
            return this.generateTreePlan();
        } else if (lowercasePrompt.includes('robot') || lowercasePrompt.includes('android')) {
            return this.generateRobotPlan();
        } else if (lowercasePrompt.includes('spaceship') || lowercasePrompt.includes('rocket')) {
            return this.generateSpaceshipPlan();
        } else if (lowercasePrompt.includes('furniture') || lowercasePrompt.includes('chair') || lowercasePrompt.includes('table')) {
            return this.generateFurniturePlan();
        } else {
            return this.generateGenericPlan(prompt);
        }
    }

    generateHousePlan() {
        return {
            objects: [
                {
                    type: 'cube',
                    name: 'House_Base',
                    position: [0, 2, 0],
                    rotation: [0, 0, 0],
                    scale: [4, 4, 4],
                    color: '#8D6E63',
                    parameters: {}
                },
                {
                    type: 'cone',
                    name: 'House_Roof',
                    position: [0, 5, 0],
                    rotation: [0, 0, 0],
                    scale: [3, 2, 3],
                    color: '#F44336',
                    parameters: {}
                },
                {
                    type: 'cube',
                    name: 'Door',
                    position: [0, 1, 2.1],
                    rotation: [0, 0, 0],
                    scale: [0.8, 2, 0.1],
                    color: '#795548',
                    parameters: {}
                },
                {
                    type: 'cube',
                    name: 'Window_1',
                    position: [1.5, 2.5, 2.1],
                    rotation: [0, 0, 0],
                    scale: [0.8, 0.8, 0.1],
                    color: '#03A9F4',
                    parameters: {}
                },
                {
                    type: 'cube',
                    name: 'Window_2',
                    position: [-1.5, 2.5, 2.1],
                    rotation: [0, 0, 0],
                    scale: [0.8, 0.8, 0.1],
                    color: '#03A9F4',
                    parameters: {}
                }
            ],
            reasoning: 'Created a simple house with base, roof, door, and windows'
        };
    }

    generateCarPlan() {
        return {
            objects: [
                {
                    type: 'cube',
                    name: 'Car_Body',
                    position: [0, 1, 0],
                    rotation: [0, 0, 0],
                    scale: [4, 1, 2],
                    color: '#F44336',
                    parameters: {}
                },
                {
                    type: 'cube',
                    name: 'Car_Cabin',
                    position: [0.5, 2, 0],
                    rotation: [0, 0, 0],
                    scale: [2, 1, 1.8],
                    color: '#1976D2',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Wheel_FL',
                    position: [1.2, 0.5, 1.2],
                    rotation: [Math.PI/2, 0, 0],
                    scale: [0.6, 0.6, 0.3],
                    color: '#424242',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Wheel_FR',
                    position: [1.2, 0.5, -1.2],
                    rotation: [Math.PI/2, 0, 0],
                    scale: [0.6, 0.6, 0.3],
                    color: '#424242',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Wheel_RL',
                    position: [-1.2, 0.5, 1.2],
                    rotation: [Math.PI/2, 0, 0],
                    scale: [0.6, 0.6, 0.3],
                    color: '#424242',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Wheel_RR',
                    position: [-1.2, 0.5, -1.2],
                    rotation: [Math.PI/2, 0, 0],
                    scale: [0.6, 0.6, 0.3],
                    color: '#424242',
                    parameters: {}
                }
            ],
            reasoning: 'Created a simple car with body, cabin, and four wheels'
        };
    }

    generateTreePlan() {
        return {
            objects: [
                {
                    type: 'cylinder',
                    name: 'Tree_Trunk',
                    position: [0, 1.5, 0],
                    rotation: [0, 0, 0],
                    scale: [0.3, 3, 0.3],
                    color: '#8D6E63',
                    parameters: {}
                },
                {
                    type: 'sphere',
                    name: 'Tree_Leaves',
                    position: [0, 4, 0],
                    rotation: [0, 0, 0],
                    scale: [2, 2, 2],
                    color: '#4CAF50',
                    parameters: {}
                }
            ],
            reasoning: 'Created a simple tree with cylindrical trunk and spherical leaves'
        };
    }

    generateRobotPlan() {
        return {
            objects: [
                {
                    type: 'cube',
                    name: 'Robot_Body',
                    position: [0, 2, 0],
                    rotation: [0, 0, 0],
                    scale: [1.5, 2, 1],
                    color: '#607D8B',
                    parameters: {}
                },
                {
                    type: 'cube',
                    name: 'Robot_Head',
                    position: [0, 3.8, 0],
                    rotation: [0, 0, 0],
                    scale: [1, 1, 1],
                    color: '#9E9E9E',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Robot_Arm_L',
                    position: [-1.2, 2.5, 0],
                    rotation: [0, 0, Math.PI/2],
                    scale: [0.3, 1.5, 0.3],
                    color: '#757575',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Robot_Arm_R',
                    position: [1.2, 2.5, 0],
                    rotation: [0, 0, Math.PI/2],
                    scale: [0.3, 1.5, 0.3],
                    color: '#757575',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Robot_Leg_L',
                    position: [-0.5, 0.8, 0],
                    rotation: [0, 0, 0],
                    scale: [0.3, 1.5, 0.3],
                    color: '#616161',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Robot_Leg_R',
                    position: [0.5, 0.8, 0],
                    rotation: [0, 0, 0],
                    scale: [0.3, 1.5, 0.3],
                    color: '#616161',
                    parameters: {}
                },
                {
                    type: 'sphere',
                    name: 'Robot_Eye_L',
                    position: [-0.3, 4, 0.6],
                    rotation: [0, 0, 0],
                    scale: [0.2, 0.2, 0.2],
                    color: '#03A9F4',
                    parameters: {}
                },
                {
                    type: 'sphere',
                    name: 'Robot_Eye_R',
                    position: [0.3, 4, 0.6],
                    rotation: [0, 0, 0],
                    scale: [0.2, 0.2, 0.2],
                    color: '#03A9F4',
                    parameters: {}
                }
            ],
            reasoning: 'Created a humanoid robot with body, head, arms, legs, and glowing eyes'
        };
    }

    generateSpaceshipPlan() {
        return {
            objects: [
                {
                    type: 'cone',
                    name: 'Spaceship_Nose',
                    position: [0, 1, 2],
                    rotation: [Math.PI/2, 0, 0],
                    scale: [0.8, 2, 0.8],
                    color: '#37474F',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Spaceship_Body',
                    position: [0, 1, 0],
                    rotation: [Math.PI/2, 0, 0],
                    scale: [1, 3, 1],
                    color: '#455A64',
                    parameters: {}
                },
                {
                    type: 'cube',
                    name: 'Wing_L',
                    position: [-2, 1, -0.5],
                    rotation: [0, 0, Math.PI/6],
                    scale: [2, 0.2, 1],
                    color: '#546E7A',
                    parameters: {}
                },
                {
                    type: 'cube',
                    name: 'Wing_R',
                    position: [2, 1, -0.5],
                    rotation: [0, 0, -Math.PI/6],
                    scale: [2, 0.2, 1],
                    color: '#546E7A',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Engine_L',
                    position: [-1.5, 0.5, -1.5],
                    rotation: [Math.PI/2, 0, 0],
                    scale: [0.3, 1, 0.3],
                    color: '#FF5722',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Engine_R',
                    position: [1.5, 0.5, -1.5],
                    rotation: [Math.PI/2, 0, 0],
                    scale: [0.3, 1, 0.3],
                    color: '#FF5722',
                    parameters: {}
                }
            ],
            reasoning: 'Created a spaceship with nose cone, body, wings, and engines'
        };
    }

    generateFurniturePlan() {
        return {
            objects: [
                {
                    type: 'cube',
                    name: 'Table_Top',
                    position: [0, 2, 0],
                    rotation: [0, 0, 0],
                    scale: [3, 0.2, 2],
                    color: '#8D6E63',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Table_Leg_1',
                    position: [1.3, 1, 0.8],
                    rotation: [0, 0, 0],
                    scale: [0.1, 2, 0.1],
                    color: '#5D4037',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Table_Leg_2',
                    position: [-1.3, 1, 0.8],
                    rotation: [0, 0, 0],
                    scale: [0.1, 2, 0.1],
                    color: '#5D4037',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Table_Leg_3',
                    position: [1.3, 1, -0.8],
                    rotation: [0, 0, 0],
                    scale: [0.1, 2, 0.1],
                    color: '#5D4037',
                    parameters: {}
                },
                {
                    type: 'cylinder',
                    name: 'Table_Leg_4',
                    position: [-1.3, 1, -0.8],
                    rotation: [0, 0, 0],
                    scale: [0.1, 2, 0.1],
                    color: '#5D4037',
                    parameters: {}
                }
            ],
            reasoning: 'Created a wooden table with rectangular top and four cylindrical legs'
        };
    }

    generateGenericPlan(prompt) {
        // Default plan for unrecognized prompts
        const colors = ['#F44336', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
        const types = ['cube', 'sphere', 'cylinder', 'cone'];
        
        return {
            objects: [
                {
                    type: types[Math.floor(Math.random() * types.length)],
                    name: 'AI_Generated_Object',
                    position: [0, 1, 0],
                    rotation: [0, Math.random() * Math.PI, 0],
                    scale: [1, 1, 1],
                    color: colors[Math.floor(Math.random() * colors.length)],
                    parameters: {}
                }
            ],
            reasoning: `Generated a random object based on prompt: "${prompt}"`
        };
    }

    executeGenerationPlan(plan) {
        // Clear existing objects if requested
        // this.clearScene();

        plan.objects.forEach(objectPlan => {
            const object = this.createObjectFromPlan(objectPlan);
            if (object) {
                // Set position, rotation, and scale
                object.position.set(...objectPlan.position);
                object.rotation.set(...objectPlan.rotation);
                object.scale.set(...objectPlan.scale);
                
                // Set color
                if (objectPlan.color) {
                    const color = new THREE.Color(objectPlan.color);
                    object.material.color = color;
                }
            }
        });

        console.log('AI Generation Plan:', plan);
    }

    createObjectFromPlan(objectPlan) {
        switch (objectPlan.type) {
            case 'cube':
                return this.modelingTools.createCube(1);
            case 'sphere':
                return this.modelingTools.createSphere(1);
            case 'cylinder':
                return this.modelingTools.createCylinder(1, 1, 2);
            case 'cone':
                return this.modelingTools.createCone(1, 2);
            case 'torus':
                return this.modelingTools.createTorus(1, 0.4);
            default:
                return this.modelingTools.createCube(1);
        }
    }

    async editSelected(prompt) {
        if (!this.threeManager.selectedObject) {
            this.updateStatus('No object selected for AI editing', 'error');
            return;
        }

        this.updateStatus('AI editing object...', 'loading');

        try {
            // Simulate AI editing suggestions
            const editPlan = this.simulateAIEdit(prompt, this.threeManager.selectedObject);
            this.executeEditPlan(editPlan);
            this.updateStatus('AI editing completed', 'success');
        } catch (error) {
            console.error('AI editing error:', error);
            this.updateStatus('AI editing failed', 'error');
        }
    }

    simulateAIEdit(prompt, object) {
        const lowercasePrompt = prompt.toLowerCase();
        const editPlan = { operations: [] };

        if (lowercasePrompt.includes('bigger') || lowercasePrompt.includes('larger')) {
            editPlan.operations.push({
                type: 'scale',
                factor: [1.5, 1.5, 1.5]
            });
        } else if (lowercasePrompt.includes('smaller') || lowercasePrompt.includes('shrink')) {
            editPlan.operations.push({
                type: 'scale',
                factor: [0.7, 0.7, 0.7]
            });
        }

        if (lowercasePrompt.includes('red')) {
            editPlan.operations.push({
                type: 'color',
                color: '#F44336'
            });
        } else if (lowercasePrompt.includes('blue')) {
            editPlan.operations.push({
                type: 'color',
                color: '#2196F3'
            });
        } else if (lowercasePrompt.includes('green')) {
            editPlan.operations.push({
                type: 'color',
                color: '#4CAF50'
            });
        }

        if (lowercasePrompt.includes('rotate') || lowercasePrompt.includes('spin')) {
            editPlan.operations.push({
                type: 'rotation',
                rotation: [0, Math.PI/4, 0]
            });
        }

        if (lowercasePrompt.includes('move up')) {
            editPlan.operations.push({
                type: 'translate',
                translation: [0, 2, 0]
            });
        } else if (lowercasePrompt.includes('move down')) {
            editPlan.operations.push({
                type: 'translate',
                translation: [0, -2, 0]
            });
        }

        return editPlan;
    }

    executeEditPlan(editPlan) {
        const object = this.threeManager.selectedObject;
        if (!object) return;

        editPlan.operations.forEach(operation => {
            switch (operation.type) {
                case 'scale':
                    object.scale.multiply(new THREE.Vector3(...operation.factor));
                    break;
                case 'color':
                    object.material.color = new THREE.Color(operation.color);
                    break;
                case 'rotation':
                    object.rotation.x += operation.rotation[0];
                    object.rotation.y += operation.rotation[1];
                    object.rotation.z += operation.rotation[2];
                    break;
                case 'translate':
                    object.position.x += operation.translation[0];
                    object.position.y += operation.translation[1];
                    object.position.z += operation.translation[2];
                    break;
            }
        });

        // Update properties panel
        this.threeManager.updatePropertiesPanel(object);
    }

    async optimizeModel() {
        this.updateStatus('AI optimizing model...', 'loading');

        try {
            // Simulate optimization
            await this.simulateOptimization();
            this.updateStatus('Model optimized by AI', 'success');
        } catch (error) {
            console.error('AI optimization error:', error);
            this.updateStatus('AI optimization failed', 'error');
        }
    }

    async simulateOptimization() {
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate optimization operations
                this.threeManager.objects.forEach(object => {
                    if (object.geometry && object.geometry.attributes) {
                        // Simulate geometry optimization
                        object.geometry.computeBoundingSphere();
                        object.geometry.computeBoundingBox();
                    }
                });
                resolve();
            }, 2000);
        });
    }

    generateCacheKey(prompt) {
        return prompt.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }

    updateStatus(message, type = 'info') {
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

    clearScene() {
        // Remove all objects from scene
        const objectsToRemove = [...this.threeManager.objects];
        objectsToRemove.forEach(object => {
            this.threeManager.removeObject(object);
        });
    }
}

// Global AI integration instance
let aiIntegration = null;