// Export Tools for Multiple 3D Formats
class ExportTools {
    constructor(threeManager) {
        this.threeManager = threeManager;
        this.supportedFormats = ['stl', 'obj', 'gltf', 'ply', 'json'];
    }

    // Export to STL format
    exportSTL(filename = null) {
        try {
            const exporter = new THREE.STLExporter();
            const objects = this.threeManager.getObjects();
            
            if (objects.length === 0) {
                this.updateStatus('No objects to export', 'error');
                return;
            }

            // Create a group containing all objects
            const exportGroup = new THREE.Group();
            objects.forEach(object => {
                const clone = object.clone();
                exportGroup.add(clone);
            });

            const stlString = exporter.parse(exportGroup);
            const blob = new Blob([stlString], { type: 'application/sla' });
            
            const downloadFilename = filename || `anymodel_export_${new Date().toISOString().split('T')[0]}.stl`;
            this.downloadBlob(blob, downloadFilename);
            
            this.updateStatus('STL export completed', 'success');
            console.log('STL exported successfully');
            
        } catch (error) {
            console.error('STL export error:', error);
            this.updateStatus('STL export failed', 'error');
        }
    }

    // Export to OBJ format
    exportOBJ(filename = null) {
        try {
            const exporter = new THREE.OBJExporter();
            const objects = this.threeManager.getObjects();
            
            if (objects.length === 0) {
                this.updateStatus('No objects to export', 'error');
                return;
            }

            // Create a group containing all objects
            const exportGroup = new THREE.Group();
            objects.forEach(object => {
                const clone = object.clone();
                exportGroup.add(clone);
            });

            const objString = exporter.parse(exportGroup);
            const blob = new Blob([objString], { type: 'text/plain' });
            
            const downloadFilename = filename || `anymodel_export_${new Date().toISOString().split('T')[0]}.obj`;
            this.downloadBlob(blob, downloadFilename);
            
            this.updateStatus('OBJ export completed', 'success');
            console.log('OBJ exported successfully');
            
        } catch (error) {
            console.error('OBJ export error:', error);
            this.updateStatus('OBJ export failed', 'error');
        }
    }

    // Export to GLTF format
    exportGLTF(filename = null, binary = false) {
        try {
            const exporter = new THREE.GLTFExporter();
            const objects = this.threeManager.getObjects();
            
            if (objects.length === 0) {
                this.updateStatus('No objects to export', 'error');
                return;
            }

            // Create a group containing all objects
            const exportGroup = new THREE.Group();
            objects.forEach(object => {
                const clone = object.clone();
                exportGroup.add(clone);
            });

            const options = {
                binary: binary,
                embedImages: true,
                includeCustomExtensions: false
            };

            exporter.parse(
                exportGroup,
                (result) => {
                    if (binary) {
                        const blob = new Blob([result], { type: 'application/octet-stream' });
                        const downloadFilename = filename || `anymodel_export_${new Date().toISOString().split('T')[0]}.glb`;
                        this.downloadBlob(blob, downloadFilename);
                    } else {
                        const jsonString = JSON.stringify(result, null, 2);
                        const blob = new Blob([jsonString], { type: 'application/json' });
                        const downloadFilename = filename || `anymodel_export_${new Date().toISOString().split('T')[0]}.gltf`;
                        this.downloadBlob(blob, downloadFilename);
                    }
                    
                    this.updateStatus('GLTF export completed', 'success');
                    console.log('GLTF exported successfully');
                },
                (error) => {
                    console.error('GLTF export error:', error);
                    this.updateStatus('GLTF export failed', 'error');
                },
                options
            );
            
        } catch (error) {
            console.error('GLTF export error:', error);
            this.updateStatus('GLTF export failed', 'error');
        }
    }

    // Export to PLY format
    exportPLY(filename = null) {
        try {
            const objects = this.threeManager.getObjects();
            
            if (objects.length === 0) {
                this.updateStatus('No objects to export', 'error');
                return;
            }

            const plyString = this.generatePLY(objects);
            const blob = new Blob([plyString], { type: 'text/plain' });
            
            const downloadFilename = filename || `anymodel_export_${new Date().toISOString().split('T')[0]}.ply`;
            this.downloadBlob(blob, downloadFilename);
            
            this.updateStatus('PLY export completed', 'success');
            console.log('PLY exported successfully');
            
        } catch (error) {
            console.error('PLY export error:', error);
            this.updateStatus('PLY export failed', 'error');
        }
    }

    // Generate PLY format string
    generatePLY(objects) {
        let vertices = [];
        let faces = [];
        let vertexOffset = 0;
        let colors = [];

        objects.forEach(object => {
            if (object.geometry && object.geometry.attributes.position) {
                const geometry = object.geometry;
                const positionAttribute = geometry.attributes.position;
                const colorAttribute = geometry.attributes.color;
                
                // Apply object transformations
                object.updateMatrixWorld();
                const matrix = object.matrixWorld;
                
                // Extract vertices
                for (let i = 0; i < positionAttribute.count; i++) {
                    const vertex = new THREE.Vector3();
                    vertex.fromBufferAttribute(positionAttribute, i);
                    vertex.applyMatrix4(matrix);
                    
                    vertices.push(vertex);
                    
                    // Extract color if available, otherwise use material color
                    if (colorAttribute) {
                        const color = new THREE.Color();
                        color.fromBufferAttribute(colorAttribute, i);
                        colors.push(color);
                    } else if (object.material && object.material.color) {
                        colors.push(object.material.color.clone());
                    } else {
                        colors.push(new THREE.Color(0.5, 0.5, 0.5));
                    }
                }
                
                // Extract faces
                if (geometry.index) {
                    const indexAttribute = geometry.index;
                    for (let i = 0; i < indexAttribute.count; i += 3) {
                        faces.push([
                            indexAttribute.getX(i) + vertexOffset,
                            indexAttribute.getX(i + 1) + vertexOffset,
                            indexAttribute.getX(i + 2) + vertexOffset
                        ]);
                    }
                } else {
                    // Non-indexed geometry
                    for (let i = 0; i < positionAttribute.count; i += 3) {
                        faces.push([
                            i + vertexOffset,
                            i + 1 + vertexOffset,
                            i + 2 + vertexOffset
                        ]);
                    }
                }
                
                vertexOffset += positionAttribute.count;
            }
        });

        // Generate PLY header
        let plyString = 'ply\n';
        plyString += 'format ascii 1.0\n';
        plyString += `element vertex ${vertices.length}\n`;
        plyString += 'property float x\n';
        plyString += 'property float y\n';
        plyString += 'property float z\n';
        plyString += 'property uchar red\n';
        plyString += 'property uchar green\n';
        plyString += 'property uchar blue\n';
        plyString += `element face ${faces.length}\n`;
        plyString += 'property list uchar int vertex_indices\n';
        plyString += 'end_header\n';

        // Add vertices with colors
        vertices.forEach((vertex, index) => {
            const color = colors[index] || new THREE.Color(0.5, 0.5, 0.5);
            plyString += `${vertex.x.toFixed(6)} ${vertex.y.toFixed(6)} ${vertex.z.toFixed(6)} `;
            plyString += `${Math.floor(color.r * 255)} ${Math.floor(color.g * 255)} ${Math.floor(color.b * 255)}\n`;
        });

        // Add faces
        faces.forEach(face => {
            plyString += `3 ${face[0]} ${face[1]} ${face[2]}\n`;
        });

        return plyString;
    }

    // Export to JSON format (Three.js scene format)
    exportJSON(filename = null) {
        try {
            const scene = this.threeManager.getScene();
            const sceneJSON = scene.toJSON();
            
            // Add metadata
            sceneJSON.metadata = {
                version: 4.5,
                type: 'Object',
                generator: 'AnyModel 3D Studio',
                exportTime: new Date().toISOString()
            };
            
            const jsonString = JSON.stringify(sceneJSON, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            
            const downloadFilename = filename || `anymodel_scene_${new Date().toISOString().split('T')[0]}.json`;
            this.downloadBlob(blob, downloadFilename);
            
            this.updateStatus('JSON export completed', 'success');
            console.log('JSON exported successfully');
            
        } catch (error) {
            console.error('JSON export error:', error);
            this.updateStatus('JSON export failed', 'error');
        }
    }

    // Export selected object only
    exportSelected(format, filename = null) {
        const selectedObject = this.threeManager.selectedObject;
        if (!selectedObject) {
            this.updateStatus('No object selected for export', 'error');
            return;
        }

        // Temporarily store all objects and replace with selected one
        const allObjects = [...this.threeManager.objects];
        this.threeManager.objects = [selectedObject];

        switch (format.toLowerCase()) {
            case 'stl':
                this.exportSTL(filename);
                break;
            case 'obj':
                this.exportOBJ(filename);
                break;
            case 'gltf':
                this.exportGLTF(filename);
                break;
            case 'ply':
                this.exportPLY(filename);
                break;
            case 'json':
                this.exportJSON(filename);
                break;
            default:
                this.updateStatus(`Unsupported format: ${format}`, 'error');
        }

        // Restore all objects
        this.threeManager.objects = allObjects;
    }

    // Batch export in multiple formats
    exportMultipleFormats(formats = ['stl', 'obj', 'gltf']) {
        this.updateStatus('Exporting multiple formats...', 'loading');
        
        const timestamp = new Date().toISOString().split('T')[0];
        
        formats.forEach((format, index) => {
            setTimeout(() => {
                const filename = `anymodel_export_${timestamp}.${format}`;
                
                switch (format.toLowerCase()) {
                    case 'stl':
                        this.exportSTL(filename);
                        break;
                    case 'obj':
                        this.exportOBJ(filename);
                        break;
                    case 'gltf':
                        this.exportGLTF(filename);
                        break;
                    case 'ply':
                        this.exportPLY(filename);
                        break;
                    case 'json':
                        this.exportJSON(filename);
                        break;
                }
                
                if (index === formats.length - 1) {
                    this.updateStatus('All formats exported successfully', 'success');
                }
            }, index * 500); // Stagger exports to avoid overwhelming the browser
        });
    }

    // Import functionality
    importFile(file) {
        const filename = file.name.toLowerCase();
        const fileExtension = filename.split('.').pop();
        
        this.updateStatus(`Importing ${fileExtension.toUpperCase()} file...`, 'loading');
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                switch (fileExtension) {
                    case 'json':
                        this.importJSON(event.target.result);
                        break;
                    case 'obj':
                        this.importOBJ(event.target.result);
                        break;
                    case 'gltf':
                    case 'glb':
                        this.importGLTF(event.target.result, fileExtension === 'glb');
                        break;
                    default:
                        this.updateStatus(`Import not supported for ${fileExtension.toUpperCase()}`, 'error');
                        return;
                }
            } catch (error) {
                console.error('Import error:', error);
                this.updateStatus('Import failed', 'error');
            }
        };
        
        if (fileExtension === 'glb') {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    }

    importJSON(jsonString) {
        try {
            const sceneData = JSON.parse(jsonString);
            const loader = new THREE.ObjectLoader();
            const loadedScene = loader.parse(sceneData);
            
            // Add loaded objects to the scene
            loadedScene.traverse((child) => {
                if (child.isMesh) {
                    child.userData.name = child.name || `Imported_${Date.now()}`;
                    child.userData.type = 'Imported';
                    this.threeManager.addObject(child);
                }
            });
            
            this.updateStatus('JSON import completed', 'success');
        } catch (error) {
            console.error('JSON import error:', error);
            this.updateStatus('JSON import failed', 'error');
        }
    }

    importOBJ(objString) {
        try {
            const loader = new THREE.OBJLoader();
            const loadedObject = loader.parse(objString);
            
            loadedObject.traverse((child) => {
                if (child.isMesh) {
                    child.userData.name = child.name || `Imported_OBJ_${Date.now()}`;
                    child.userData.type = 'Imported OBJ';
                    child.material = this.threeManager.createMaterial();
                    this.threeManager.addObject(child);
                }
            });
            
            this.updateStatus('OBJ import completed', 'success');
        } catch (error) {
            console.error('OBJ import error:', error);
            this.updateStatus('OBJ import failed', 'error');
        }
    }

    importGLTF(data, isBinary = false) {
        try {
            const loader = new THREE.GLTFLoader();
            
            const onLoad = (gltf) => {
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.userData.name = child.name || `Imported_GLTF_${Date.now()}`;
                        child.userData.type = 'Imported GLTF';
                        this.threeManager.addObject(child);
                    }
                });
                
                this.updateStatus('GLTF import completed', 'success');
            };
            
            const onError = (error) => {
                console.error('GLTF import error:', error);
                this.updateStatus('GLTF import failed', 'error');
            };
            
            if (isBinary) {
                loader.parse(data, '', onLoad, onError);
            } else {
                const gltfData = JSON.parse(data);
                loader.parse(gltfData, '', onLoad, onError);
            }
            
        } catch (error) {
            console.error('GLTF import error:', error);
            this.updateStatus('GLTF import failed', 'error');
        }
    }

    // Utility function to download blob
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    // Get export statistics
    getExportStats() {
        const objects = this.threeManager.getObjects();
        let totalVertices = 0;
        let totalFaces = 0;
        
        objects.forEach(object => {
            if (object.geometry && object.geometry.attributes.position) {
                totalVertices += object.geometry.attributes.position.count;
                
                if (object.geometry.index) {
                    totalFaces += object.geometry.index.count / 3;
                } else {
                    totalFaces += object.geometry.attributes.position.count / 3;
                }
            }
        });
        
        return {
            objectCount: objects.length,
            vertexCount: totalVertices,
            faceCount: Math.floor(totalFaces),
            estimatedFileSize: this.estimateFileSize(totalVertices, totalFaces)
        };
    }

    estimateFileSize(vertices, faces) {
        // Rough estimates in KB
        const stlSize = (faces * 50) / 1024; // ~50 bytes per triangle in ASCII STL
        const objSize = (vertices * 30 + faces * 20) / 1024; // ~30 bytes per vertex, 20 per face
        const plySize = (vertices * 40 + faces * 15) / 1024; // ~40 bytes per vertex, 15 per face
        
        return {
            stl: Math.max(1, Math.round(stlSize)),
            obj: Math.max(1, Math.round(objSize)),
            ply: Math.max(1, Math.round(plySize))
        };
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
}

// Global export tools instance
let exportTools = null;