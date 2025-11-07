/**
 * Example usage of BlenderModel component
 * 
 * This file demonstrates how to use the BlenderModel component
 * to display 3D models exported from Blender.
 */

'use client';

import { BlenderModel } from '@/components/3d';

export function BlenderModelExample() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold mb-8">3D Model Examples</h1>

      {/* Basic usage */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Model</h2>
        <div className="h-[500px] w-full rounded-lg overflow-hidden border">
          <BlenderModel 
            modelPath="your-model.glb"
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Auto-rotating model */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Auto-Rotating Model</h2>
        <div className="h-[500px] w-full rounded-lg overflow-hidden border">
          <BlenderModel 
            modelPath="your-model.glb"
            className="h-full w-full"
            autoRotate
            autoRotateSpeed={2}
          />
        </div>
      </div>

      {/* Custom scale and position */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Custom Transform</h2>
        <div className="h-[500px] w-full rounded-lg overflow-hidden border">
          <BlenderModel 
            modelPath="your-model.glb"
            className="h-full w-full"
            scale={1.5}
            position={[0, -1, 0]}
            rotation={[0, Math.PI / 4, 0]}
          />
        </div>
      </div>

      {/* Without controls */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Static Model (No Controls)</h2>
        <div className="h-[500px] w-full rounded-lg overflow-hidden border">
          <BlenderModel 
            modelPath="your-model.glb"
            className="h-full w-full"
            controls={false}
            autoRotate
          />
        </div>
      </div>

      {/* Custom background */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Custom Background</h2>
        <div className="h-[500px] w-full rounded-lg overflow-hidden border">
          <BlenderModel 
            modelPath="your-model.glb"
            className="h-full w-full"
            background="#1a1a1a"
          />
        </div>
      </div>
    </div>
  );
}

