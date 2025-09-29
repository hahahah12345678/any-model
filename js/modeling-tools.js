// 3D Modeling Tools and Primitives
class ModelingTools {
    constructor(threeManager) {
        this.threeManager = threeManager;
        this.objectCounter = 1;
    }

    // Create basic primitive shapes
    createCube(size = 1) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = this.threeManager.createMaterial(0x4CAF50);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            name: `Cube_${this.objectCounter++}`,
            type: 'Cube',
            created: new Date().toISOString()
        };
        
        mesh.position.set(0, size/2, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.threeManager.addObject(mesh);
        return mesh;
    }

    createSphere(radius = 1, segments = 32) {
        const geometry = new THREE.SphereGeometry(radius, segments, segments);
        const material = this.threeManager.createMaterial(0x2196F3);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            name: `Sphere_${this.objectCounter++}`,
            type: 'Sphere',
            created: new Date().toISOString()
        };
        
        mesh.position.set(0, radius, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.threeManager.addObject(mesh);
        return mesh;
    }

    createCylinder(radiusTop = 1, radiusBottom = 1, height = 2, segments = 32) {
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
        const material = this.threeManager.createMaterial(0xFF9800);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            name: `Cylinder_${this.objectCounter++}`,
            type: 'Cylinder',
            created: new Date().toISOString()
        };
        
        mesh.position.set(0, height/2, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.threeManager.addObject(mesh);
        return mesh;
    }

    createCone(radius = 1, height = 2, segments = 32) {
        const geometry = new THREE.ConeGeometry(radius, height, segments);
        const material = this.threeManager.createMaterial(0xF44336);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            name: `Cone_${this.objectCounter++}`,
            type: 'Cone',
            created: new Date().toISOString()
        };
        
        mesh.position.set(0, height/2, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.threeManager.addObject(mesh);
        return mesh;
    }

    createTorus(radius = 1, tube = 0.4, radialSegments = 16, tubularSegments = 100) {
        const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        const material = this.threeManager.createMaterial(0x9C27B0);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            name: `Torus_${this.objectCounter++}`,
            type: 'Torus',
            created: new Date().toISOString()
        };
        
        mesh.position.set(0, radius, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.threeManager.addObject(mesh);
        return mesh;
    }

    // Advanced modeling operations
    extrudeShape(shape, extrudeSettings = {}) {
        const defaultSettings = {
            depth: 1,
            bevelEnabled: false,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 0.1,
            bevelThickness: 0.1
        };
        
        const settings = { ...defaultSettings, ...extrudeSettings };
        const geometry = new THREE.ExtrudeGeometry(shape, settings);
        const material = this.threeManager.createMaterial(0x607D8B);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            name: `Extruded_${this.objectCounter++}`,
            type: 'Extruded Shape',
            created: new Date().toISOString()
        };
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.threeManager.addObject(mesh);
        return mesh;
    }

    createText(text = "Hello", font, options = {}) {
        const defaultOptions = {
            size: 1,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        };
        
        const textOptions = { ...defaultOptions, ...options };
        textOptions.font = font;
        
        const geometry = new THREE.TextGeometry(text, textOptions);
        const material = this.threeManager.createMaterial(0xFFEB3B);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            name: `Text_${this.objectCounter++}`,
            type: 'Text',
            text: text,
            created: new Date().toISOString()
        };
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Center the text
        geometry.computeBoundingBox();
        const centerOffsetX = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        const centerOffsetY = -0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y);
        mesh.position.set(centerOffsetX, centerOffsetY, 0);
        
        this.threeManager.addObject(mesh);
        return mesh;
    }

    // Boolean operations (CSG-like)
    unionObjects(objectA, objectB) {
        // This is a simplified union - in practice you'd use a CSG library
        const group = new THREE.Group();
        group.add(objectA.clone());
        group.add(objectB.clone());
        
        group.userData = {
            name: `Union_${this.objectCounter++}`,
            type: 'Union',
            created: new Date().toISOString()
        };
        
        this.threeManager.addObject(group);
        return group;
    }

    // Duplicate selected object
    duplicateSelected() {
        if (!this.threeManager.selectedObject) {
            this.updateStatus('No object selected to duplicate', 'error');
            return null;
        }

        const original = this.threeManager.selectedObject;
        const cloned = original.clone();
        
        // Offset position slightly
        cloned.position.x += 2;
        cloned.userData = {
            ...original.userData,
            name: `${original.userData.name}_Copy`,
            created: new Date().toISOString()
        };
        
        this.threeManager.addObject(cloned);
        this.threeManager.selectObject(cloned);
        
        this.updateStatus('Object duplicated successfully', 'success');
        return cloned;
    }

    // Transform operations
    moveObject(object, x, y, z) {
        if (object) {
            object.position.set(x, y, z);
        }
    }

    rotateObject(object, x, y, z) {
        if (object) {
            object.rotation.set(x, y, z);
        }
    }

    scaleObject(object, x, y, z) {
        if (object) {
            object.scale.set(x, y, z);
        }
    }

    // Group operations
    groupSelected() {
        const selected = this.threeManager.objects.filter(obj => obj.userData.selected);
        if (selected.length < 2) {
            this.updateStatus('Select at least 2 objects to group', 'error');
            return null;
        }

        const group = new THREE.Group();
        selected.forEach(obj => {
            this.threeManager.removeObject(obj);
            group.add(obj);
        });

        group.userData = {
            name: `Group_${this.objectCounter++}`,
            type: 'Group',
            created: new Date().toISOString()
        };

        this.threeManager.addObject(group);
        this.updateStatus('Objects grouped successfully', 'success');
        return group;
    }

    // Material operations
    changeMaterial(object, materialType, color = 0x4CAF50) {
        if (!object) return;

        let material;
        switch (materialType) {
            case 'basic':
                material = new THREE.MeshBasicMaterial({ color });
                break;
            case 'lambert':
                material = new THREE.MeshLambertMaterial({ color });
                break;
            case 'phong':
                material = new THREE.MeshPhongMaterial({ color });
                break;
            case 'standard':
                material = new THREE.MeshStandardMaterial({ color });
                break;
            default:
                material = new THREE.MeshLambertMaterial({ color });
        }

        if (object.material) {
            object.material.dispose();
        }
        object.material = material;
    }

    // Subdivision surface (simplified)
    subdivideGeometry(object, iterations = 1) {
        if (!object || !object.geometry) return;

        // This is a placeholder - real subdivision would require a subdivision surface modifier
        const modifier = new THREE.SubdivisionModifier(iterations);
        const newGeometry = modifier.modify(object.geometry);
        
        object.geometry.dispose();
        object.geometry = newGeometry;
        
        this.updateStatus('Geometry subdivided', 'success');
    }

    // Utility functions
    updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('statusText');
        statusElement.textContent = message;
        statusElement.className = type;
        
        // Clear status after 3 seconds
        setTimeout(() => {
            statusElement.textContent = 'Ready';
            statusElement.className = '';
        }, 3000);
    }

    // Get random position for new objects
    getRandomPosition() {
        return {
            x: (Math.random() - 0.5) * 10,
            y: Math.random() * 3 + 0.5,
            z: (Math.random() - 0.5) * 10
        };
    }

    // Create procedural geometry
    createProceduralMesh(type, parameters = {}) {
        switch (type) {
            case 'terrain':
                return this.createTerrain(parameters);
            case 'tree':
                return this.createTree(parameters);
            case 'building':
                return this.createBuilding(parameters);
            default:
                return this.createCube();
        }
    }

    createTerrain(params = {}) {
        const width = params.width || 10;
        const height = params.height || 10;
        const widthSegments = params.widthSegments || 32;
        const heightSegments = params.heightSegments || 32;
        
        const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
        
        // Add noise to vertices for terrain effect
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 2] = Math.random() * 2 - 1; // Random height
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        
        const material = this.threeManager.createMaterial(0x8BC34A);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            name: `Terrain_${this.objectCounter++}`,
            type: 'Terrain',
            created: new Date().toISOString()
        };
        
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        
        this.threeManager.addObject(mesh);
        return mesh;
    }

    createTree(params = {}) {
        const group = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 8);
        const trunkMaterial = this.threeManager.createMaterial(0x8D6E63);
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        
        // Leaves
        const leavesGeometry = new THREE.SphereGeometry(2, 16, 16);
        const leavesMaterial = this.threeManager.createMaterial(0x4CAF50);
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 4;
        leaves.castShadow = true;
        
        group.add(trunk);
        group.add(leaves);
        
        group.userData = {
            name: `Tree_${this.objectCounter++}`,
            type: 'Tree',
            created: new Date().toISOString()
        };
        
        this.threeManager.addObject(group);
        return group;
    }

    createBuilding(params = {}) {
        const group = new THREE.Group();
        const floors = params.floors || Math.floor(Math.random() * 5) + 2;
        
        for (let i = 0; i < floors; i++) {
            const floorGeometry = new THREE.BoxGeometry(3, 2, 3);
            const floorMaterial = this.threeManager.createMaterial(0x607D8B);
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.y = i * 2 + 1;
            floor.castShadow = true;
            floor.receiveShadow = true;
            group.add(floor);
        }
        
        group.userData = {
            name: `Building_${this.objectCounter++}`,
            type: 'Building',
            created: new Date().toISOString()
        };
        
        this.threeManager.addObject(group);
        return group;
    }
}

// Global modeling tools instance
let modelingTools = null;