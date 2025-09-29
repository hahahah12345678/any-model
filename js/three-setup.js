// Three.js Scene Setup and Management
class ThreeJSManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.selectedObject = null;
        this.objects = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.gridHelper = null;
        this.axesHelper = null;
        this.ambientLight = null;
        this.directionalLight = null;
        this.wireframeMode = false;
        this.lightingEnabled = true;
        
        this.init();
    }

    init() {
        const canvas = document.getElementById('viewport');
        const container = canvas.parentElement;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotate = false;

        // Lighting
        this.setupLighting();

        // Grid and Axes
        this.setupGrid();

        // Event listeners
        this.setupEventListeners();

        // Start render loop
        this.animate();

        console.log('Three.js setup complete');
    }

    setupLighting() {
        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(this.ambientLight);

        // Directional light
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(10, 10, 5);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 50;
        this.scene.add(this.directionalLight);

        // Light helper (optional, for debugging)
        // const helper = new THREE.DirectionalLightHelper(this.directionalLight, 5);
        // this.scene.add(helper);
    }

    setupGrid() {
        // Grid
        this.gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        this.scene.add(this.gridHelper);

        // Axes
        this.axesHelper = new THREE.AxesHelper(5);
        this.scene.add(this.axesHelper);
    }

    setupEventListeners() {
        // Mouse events for selection
        this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
        this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onMouseClick(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            this.selectObject(intersects[0].object);
        } else {
            this.selectObject(null);
        }
    }

    onMouseMove(event) {
        // Update mouse position for future use
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    onWindowResize() {
        const container = this.renderer.domElement.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    selectObject(object) {
        // Deselect previous object
        if (this.selectedObject) {
            this.selectedObject.material.emissive.setHex(0x000000);
        }

        this.selectedObject = object;

        if (object) {
            // Highlight selected object
            object.material.emissive.setHex(0x444444);
            this.updatePropertiesPanel(object);
            this.updateStatusBar(`Selected: ${object.userData.name || 'Object'}`);
        } else {
            this.updatePropertiesPanel(null);
            this.updateStatusBar('Selected: None');
        }
    }

    updatePropertiesPanel(object) {
        const propertiesContent = document.getElementById('objectProperties');
        
        if (!object) {
            propertiesContent.innerHTML = '<p>Select an object to view properties</p>';
            return;
        }

        const position = object.position;
        const rotation = object.rotation;
        const scale = object.scale;

        propertiesContent.innerHTML = `
            <div class="property-row">
                <span class="property-label">Name:</span>
                <span class="property-value">${object.userData.name || 'Unnamed'}</span>
            </div>
            <div class="property-row">
                <span class="property-label">Type:</span>
                <span class="property-value">${object.userData.type || 'Object'}</span>
            </div>
            <h4 style="margin: 15px 0 10px 0; color: #4CAF50; font-size: 12px;">Position</h4>
            <div class="property-row">
                <span class="property-label">X:</span>
                <input type="number" class="property-input" value="${position.x.toFixed(2)}" data-property="position.x" step="0.1">
            </div>
            <div class="property-row">
                <span class="property-label">Y:</span>
                <input type="number" class="property-input" value="${position.y.toFixed(2)}" data-property="position.y" step="0.1">
            </div>
            <div class="property-row">
                <span class="property-label">Z:</span>
                <input type="number" class="property-input" value="${position.z.toFixed(2)}" data-property="position.z" step="0.1">
            </div>
            <h4 style="margin: 15px 0 10px 0; color: #4CAF50; font-size: 12px;">Rotation</h4>
            <div class="property-row">
                <span class="property-label">X:</span>
                <input type="number" class="property-input" value="${(rotation.x * 180 / Math.PI).toFixed(1)}" data-property="rotation.x" step="1">
            </div>
            <div class="property-row">
                <span class="property-label">Y:</span>
                <input type="number" class="property-input" value="${(rotation.y * 180 / Math.PI).toFixed(1)}" data-property="rotation.y" step="1">
            </div>
            <div class="property-row">
                <span class="property-label">Z:</span>
                <input type="number" class="property-input" value="${(rotation.z * 180 / Math.PI).toFixed(1)}" data-property="rotation.z" step="1">
            </div>
            <h4 style="margin: 15px 0 10px 0; color: #4CAF50; font-size: 12px;">Scale</h4>
            <div class="property-row">
                <span class="property-label">X:</span>
                <input type="number" class="property-input" value="${scale.x.toFixed(2)}" data-property="scale.x" step="0.1" min="0.1">
            </div>
            <div class="property-row">
                <span class="property-label">Y:</span>
                <input type="number" class="property-input" value="${scale.y.toFixed(2)}" data-property="scale.y" step="0.1" min="0.1">
            </div>
            <div class="property-row">
                <span class="property-label">Z:</span>
                <input type="number" class="property-input" value="${scale.z.toFixed(2)}" data-property="scale.z" step="0.1" min="0.1">
            </div>
        `;

        // Add event listeners to property inputs
        const inputs = propertiesContent.querySelectorAll('.property-input');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => this.updateObjectProperty(e.target));
        });
    }

    updateObjectProperty(input) {
        if (!this.selectedObject) return;

        const property = input.dataset.property;
        const value = parseFloat(input.value);
        const [objectProp, axis] = property.split('.');

        if (objectProp === 'rotation') {
            this.selectedObject[objectProp][axis] = value * Math.PI / 180; // Convert to radians
        } else {
            this.selectedObject[objectProp][axis] = value;
        }
    }

    updateStatusBar(selectedText) {
        document.getElementById('selectedObject').textContent = selectedText;
        document.getElementById('objectCount').textContent = `Objects: ${this.objects.length}`;
    }

    addObject(mesh) {
        this.objects.push(mesh);
        this.scene.add(mesh);
        this.updateStatusBar('Selected: None');
        console.log('Added object:', mesh.userData.name);
    }

    removeObject(object) {
        const index = this.objects.indexOf(object);
        if (index > -1) {
            this.objects.splice(index, 1);
            this.scene.remove(object);
            if (this.selectedObject === object) {
                this.selectObject(null);
            }
            this.updateStatusBar('Selected: None');
        }
    }

    deleteSelected() {
        if (this.selectedObject) {
            this.removeObject(this.selectedObject);
        }
    }

    resetView() {
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
    }

    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        this.objects.forEach(object => {
            if (object.material) {
                object.material.wireframe = this.wireframeMode;
            }
        });
    }

    toggleLighting() {
        this.lightingEnabled = !this.lightingEnabled;
        this.ambientLight.visible = this.lightingEnabled;
        this.directionalLight.visible = this.lightingEnabled;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    // Utility method to create material
    createMaterial(color = 0x4CAF50) {
        return new THREE.MeshLambertMaterial({
            color: color,
            transparent: false
        });
    }

    // Get scene for export
    getScene() {
        return this.scene;
    }

    // Get all objects for export
    getObjects() {
        return this.objects;
    }
}

// Initialize Three.js manager globally
let threeManager = null;