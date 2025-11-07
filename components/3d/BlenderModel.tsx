'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei';
import { cn } from '@/lib/utils';

export interface BlenderModelProps {
  /**
   * Path to the GLTF/GLB model file (relative to /public/models/)
   * Example: "my-model.glb" or "folder/model.gltf"
   */
  modelPath: string;
  /**
   * Additional className for the container
   */
  className?: string;
  /**
   * Enable camera controls (default: true)
   */
  controls?: boolean;
  /**
   * Enable environment lighting (default: true)
   */
  environment?: boolean;
  /**
   * Camera position [x, y, z]
   */
  cameraPosition?: [number, number, number];
  /**
   * Model scale
   */
  scale?: number | [number, number, number];
  /**
   * Model rotation [x, y, z] in radians
   */
  rotation?: [number, number, number];
  /**
   * Model position [x, y, z]
   */
  position?: [number, number, number];
  /**
   * Auto-rotate the model
   */
  autoRotate?: boolean;
  /**
   * Auto-rotate speed
   */
  autoRotateSpeed?: number;
  /**
   * Background color or 'transparent'
   */
  background?: string | 'transparent';
  /**
   * Loading fallback component
   */
  fallback?: React.ReactNode;
}

/**
 * Load and display a 3D model from Blender
 * Supports GLTF and GLB formats
 */
function Model({
  modelPath,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}: {
  modelPath: string;
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  position?: [number, number, number];
}) {
  const { scene } = useGLTF(`/models/${modelPath}`);

  return (
    <primitive
      object={scene}
      scale={scale}
      rotation={rotation}
      position={position}
    />
  );
}

/**
 * BlenderModel component - Display 3D models exported from Blender
 * 
 * @example
 * ```tsx
 * <BlenderModel 
 *   modelPath="my-model.glb" 
 *   className="h-[500px] w-full"
 *   autoRotate
 * />
 * ```
 */
export const BlenderModel: React.FC<BlenderModelProps> = ({
  modelPath,
  className,
  controls = true,
  environment = true,
  cameraPosition = [0, 0, 5],
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  autoRotate = false,
  autoRotateSpeed = 1,
  background = 'transparent',
  fallback,
}) => {
  const defaultFallback = (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Loading 3D model...</p>
      </div>
    </div>
  );

  return (
    <div className={cn('relative w-full h-full', className)}>
      <Canvas
        gl={{ antialias: true, alpha: background === 'transparent' }}
        style={{ background: background === 'transparent' ? 'transparent' : background }}
      >
        <Suspense fallback={null}>
          {environment && <Environment preset="sunset" />}
          <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Model
            modelPath={modelPath}
            scale={scale}
            rotation={rotation}
            position={position}
          />
          {controls && (
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={autoRotate}
              autoRotateSpeed={autoRotateSpeed}
            />
          )}
        </Suspense>
      </Canvas>
      {fallback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {fallback}
        </div>
      )}
    </div>
  );
};

// Preload model for better performance (optional)
// Usage: useGLTF.preload('/models/your-model.glb')

export default BlenderModel;

