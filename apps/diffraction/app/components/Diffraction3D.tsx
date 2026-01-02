"use client";
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { propagateFresnel } from '@/lib/diffraction/fresnel';

const PropagationVolume = ({ aperture, resolution }: { aperture: number[][]; resolution: number }) => {
  // Generate 5 slices of the light field at different Z intervals
  const slices = useMemo(() => {
    return [0.1, 0.5, 1, 2, 5].map(z => ({
      data: propagateFresnel(aperture, z),
      zPos: z * 2 // Scale for 3D space
    }));
  }, [aperture]);

  return (
    <group>
      {/* The Aperture Plate (Source) */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#111" emissive="#10b981" emissiveIntensity={2} />
      </mesh>

      {/* The Volumetric Slices */}
      {slices.map((slice, idx) => (
        <mesh key={idx} position={[0, 0, slice.zPos]}>
          <planeGeometry args={[5, 5, resolution, resolution]} />
          <meshStandardMaterial
            transparent
            opacity={0.2 - idx * 0.03}
            blending={THREE.AdditiveBlending}
            color="#10b981"
            wireframe={idx === slices.length - 1 ? false : true}
          />
        </mesh>
      ))}
    </group>
  );
};

export default function Diffraction3D({ aperture }: { aperture: number[][] }) {
  return (
    <div className="h-[600px] w-full bg-black rounded-xl border border-neutral-800">
      <Canvas>
        <PerspectiveCamera makeDefault position={[10, 5, 15]} />
        <OrbitControls />
        <Stars radius={100} depth={50} count={5000} factor={4} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#10b981" />

        <PropagationVolume aperture={aperture} resolution={64} />
      </Canvas>
    </div>
  );
}