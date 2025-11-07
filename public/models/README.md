# 3D Models Directory

Place your exported Blender models (GLTF/GLB format) in this directory.

## Exporting from Blender

1. Open your `.blend` file in Blender
2. Select the objects you want to export
3. Go to `File > Export > glTF 2.0 (.glb/.gltf)`
4. Choose settings:
   - **Format**: GLB (binary, recommended) or GLTF (text-based)
   - **Include**: Selected Objects (or All if you want everything)
   - **Transform**: +Y Up (default)
   - **Geometry**: Apply Modifiers, UVs, Normals, Vertex Colors
   - **Compression**: Draco (optional, for smaller file size)
5. Save to this directory (`/public/models/`)

## Recommended Settings

- **Format**: GLB (smaller file size, single file)
- **Compression**: Enable Draco for large models
- **Textures**: Include if your model has materials
- **Animations**: Include if your model has animations

## Usage Example

```tsx
import { BlenderModel } from '@/components/3d';

export default function MyPage() {
  return (
    <div className="h-screen">
      <BlenderModel 
        modelPath="my-model.glb"
        className="h-full w-full"
        autoRotate
        controls
      />
    </div>
  );
}
```

## File Structure

```
public/
  models/
    my-model.glb          ← Your Blender model
    my-model.gltf        ← Alternative format
    textures/            ← Optional: texture files if using GLTF
      texture.png
```

