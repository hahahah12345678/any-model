# AnyModel - 3D Modeling Chrome Extension

A powerful Chrome extension that provides a complete 3D modeling environment with AI-powered features, manual modeling tools, and multi-format export capabilities.

## Features

### 🎯 Manual Modeling Tools
- **Primitive Shapes**: Create cubes, spheres, cylinders, cones, and torus shapes
- **Transform Tools**: Move, rotate, and scale objects with precision
- **Material System**: Apply different materials and colors to objects
- **Scene Management**: Group, duplicate, and organize objects

### 🤖 AI-Powered Modeling
- **AI Generation**: Describe what you want to create and let AI generate 3D models
- **AI Editing**: Use natural language to modify existing objects
- **AI Optimization**: Automatically optimize models for better performance
- **Smart Suggestions**: Get intelligent recommendations for model improvements

### 📁 Export & Import Support
- **STL**: For 3D printing
- **OBJ**: Universal 3D format
- **GLTF/GLB**: Web-optimized 3D format
- **PLY**: Point cloud and mesh format
- **JSON**: Three.js scene format

### 🎨 Professional Interface
- **3D Viewport**: Real-time 3D rendering with orbit controls
- **Properties Panel**: Detailed object properties and transformations
- **Toolbar**: Quick access to modeling tools
- **Status Bar**: Real-time feedback and object information

## Installation

### From Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store for easy installation.

### Manual Installation (Developer Mode)
1. **Download the Extension**
   ```bash
   git clone https://github.com/hahahah12345678/any-model.git
   cd any-model
   ```

2. **Enable Developer Mode in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `any-model` directory
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "AnyModel - 3D Modeling Studio" and click the pin icon

## Usage

### Getting Started
1. Click the AnyModel icon in your Chrome toolbar
2. The 3D modeling interface will open in a popup window
3. Start creating by clicking the shape buttons or using AI generation

### Manual Modeling
- **Add Shapes**: Click the shape buttons (cube, sphere, cylinder, cone, torus)
- **Select Objects**: Click on objects in the 3D viewport
- **Transform**: Use the transform tools to move, rotate, and scale
- **Properties**: Adjust precise values in the properties panel

### AI Modeling
1. **Generate Models**: 
   - Type a description in the AI prompt box (e.g., "Create a house with a red roof")
   - Click "Generate" or press Enter
   - Watch as AI creates your model

2. **Edit with AI**:
   - Select an object in the viewport
   - Type editing instructions (e.g., "make it bigger and blue")
   - Click the AI Edit button

3. **Optimize**:
   - Click the AI Optimize button to improve model performance

### Exporting Models
1. Create your 3D model using manual tools or AI
2. Click one of the export buttons (STL, OBJ, GLTF, PLY)
3. The file will be downloaded to your computer
4. Use the exported file in 3D printing, game engines, or other software

### Keyboard Shortcuts
- `1-5`: Add primitive shapes (cube, sphere, cylinder, cone, torus)
- `Delete/Backspace`: Delete selected object
- `Ctrl+D`: Duplicate selected object
- `Ctrl+S`: Save project
- `Ctrl+O`: Load project
- `Ctrl+N`: New project
- `R`: Reset view
- `W`: Toggle wireframe mode
- `L`: Toggle lighting

## AI Features

### Supported AI Commands
The AI system understands natural language descriptions:

- **Objects**: "Create a house", "Add a car", "Make a tree"
- **Modifications**: "Make it bigger", "Change color to red", "Rotate 45 degrees"
- **Complex Scenes**: "Create a cityscape", "Build a robot", "Design a spaceship"

### AI Examples
```
"Create a simple house with a red roof and blue windows"
"Add a tree next to the house"
"Make a red sports car"
"Design a futuristic robot with glowing eyes"
"Create a wooden table with four legs"
```

## Technical Details

### Built With
- **Three.js**: 3D graphics and rendering
- **Chrome Extension API**: Browser integration
- **AI Integration**: Natural language processing for 3D modeling
- **Modern Web Standards**: ES6+, CSS3, HTML5

### Performance
- Optimized rendering pipeline
- Efficient memory management
- Real-time 3D interactions
- Responsive interface design

### Browser Compatibility
- Chrome 88+ (Manifest V3 support)
- Chromium-based browsers (Edge, Brave, etc.)

## Development

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/hahahah12345678/any-model.git
cd any-model

# Load in Chrome (Developer Mode)
# Go to chrome://extensions/
# Enable Developer Mode
# Click "Load unpacked" and select this directory
```

### File Structure
```
any-model/
├── manifest.json          # Extension configuration
├── popup.html             # Main interface
├── css/
│   └── popup.css         # Styling
├── js/
│   ├── popup.js          # Main application logic
│   ├── three-setup.js    # Three.js scene management
│   ├── modeling-tools.js # Manual modeling tools
│   ├── ai-integration.js # AI features
│   └── export-tools.js   # Export functionality
├── icons/                # Extension icons
└── models/              # Sample models (optional)
```

## Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Areas for Contribution
- Additional 3D primitives and tools
- Enhanced AI capabilities
- New export formats
- UI/UX improvements
- Performance optimizations
- Documentation improvements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

### Version 1.1
- [ ] Advanced materials and textures
- [ ] Animation system
- [ ] Collaborative editing
- [ ] Cloud storage integration

### Version 1.2
- [ ] VR/AR support
- [ ] Advanced AI models
- [ ] Scripting system
- [ ] Plugin architecture

## Support

- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/hahahah12345678/any-model/issues)
- **Discussions**: Join the community on [GitHub Discussions](https://github.com/hahahah12345678/any-model/discussions)

## Acknowledgments

- Three.js community for the excellent 3D library
- Chrome Extensions documentation and examples
- Open source 3D modeling tools for inspiration
- AI research community for natural language processing advances

---

**Made with ❤️ for the 3D modeling community**