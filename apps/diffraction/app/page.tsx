'use client';

import { useEffect, useState, Suspense } from 'react';
import { doubleSlit, smileyFace, singleSlit, circle, square, triangle, grating, annulus } from '@/lib/diffraction/apertures';
import { diffractionPattern } from '@/lib/diffraction/fft';
import { DiffractionCanvas } from './components/DiffractionCanvas';
import dynamic from 'next/dynamic';

const Diffraction3D = dynamic(() => import('./components/Diffraction3D'), { ssr: false });

export default function DiffractionPage() {
    const [pattern, setPattern] = useState<number[][] | null>(null);
    const [aperture, setAperture] = useState<number[][] | null>(null);
    const [shape, setShape] = useState('smiley');
    const [slitWidth, setSlitWidth] = useState(10);
    const [slitSeparation, setSlitSeparation] = useState(25);
    const [loading, setLoading] = useState(false);
    const [compareMode, setCompareMode] = useState(false);
    const [pattern2, setPattern2] = useState<number[][] | null>(null);
    const [aperture2, setAperture2] = useState<number[][] | null>(null);
    const [shape2, setShape2] = useState('doubleSlit');
    const [slitWidth2, setSlitWidth2] = useState(10);
    const [slitSeparation2, setSlitSeparation2] = useState(25);
    const [loading2, setLoading2] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => { // Simulate async for UI feedback
            let ap: number[][];
            if (shape === 'doubleSlit') {
                ap = doubleSlit(64, slitWidth, slitSeparation);
            } else if (shape === 'smiley') {
                ap = smileyFace(64);
            } else if (shape === 'singleSlit') {
                ap = singleSlit(64, slitWidth);
            } else if (shape === 'circle') {
                ap = circle(64);
            } else if (shape === 'square') {
                ap = square(64);
            } else if (shape === 'triangle') {
                ap = triangle(64);
            } else if (shape === 'grating') {
                ap = grating(64);
            } else if (shape === 'annulus') {
                ap = annulus(64);
            } else {
                ap = doubleSlit(64, slitWidth, slitSeparation); // default
            }
            setAperture(ap);
            const result = diffractionPattern(ap);
            setPattern(result);
            setLoading(false);
        }, 100);
    }, [shape, slitWidth, slitSeparation]);

    useEffect(() => {
        if (!compareMode) return;
        setLoading2(true);
        setTimeout(() => {
            let ap: number[][];
            if (shape2 === 'doubleSlit') {
                ap = doubleSlit(64, slitWidth2, slitSeparation2);
            } else if (shape2 === 'smiley') {
                ap = smileyFace(64);
            } else if (shape2 === 'singleSlit') {
                ap = singleSlit(64, slitWidth2);
            } else if (shape2 === 'circle') {
                ap = circle(64);
            } else if (shape2 === 'square') {
                ap = square(64);
            } else if (shape2 === 'triangle') {
                ap = triangle(64);
            } else if (shape2 === 'grating') {
                ap = grating(64);
            } else if (shape2 === 'annulus') {
                ap = annulus(64);
            } else {
                ap = doubleSlit(64, slitWidth2, slitSeparation2); // default
            }
            setAperture2(ap);
            const result = diffractionPattern(ap);
            setPattern2(result);
            setLoading2(false);
        }, 100);
    }, [compareMode, shape2, slitWidth2, slitSeparation2]);

    return (
        <section className="max-w-6xl mx-auto px-6 py-20">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">
                    Diffraction Visualiser
                </h1>
                <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
                    Light propagation through apertures: Watch how light fills the space after passing through different shapes.
                </p>
                 {/* <div className="mt-6">
                     <a
                         href="/diffraction/3d"
                         className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition"
                     >
                         View 3D Animation →
                     </a>
                 </div> */}
            </div>

            <div className="space-y-8">
                {/* Primary Focus: 3D Volumetric View */}
                {aperture && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">3D Volumetric Propagation</h2>
                        <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
                            <Suspense fallback={<div className="text-white">Loading 3D...</div>}>
                                <Diffraction3D aperture={aperture} />
                            </Suspense>
                        </div>
                    </div>
                )}

                {/* Secondary Focus: 2D Intensity Map */}
                <div className="border-t border-neutral-800 pt-12">
                    <h2 className="text-xl font-semibold mb-4 text-neutral-400">2D Cross-Section Analysis</h2>
                </div>
                <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
                    <div className="flex flex-wrap gap-4 items-center mb-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={compareMode}
                                onChange={e => setCompareMode(e.target.checked)}
                                className="rounded"
                            />
                            Compare Mode
                        </label>

                        <div className="flex items-center gap-2">
                            <span>Aperture Shape:</span>
                            <select
                                value={shape}
                                onChange={e => setShape(e.target.value)}
                                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-1 text-white"
                            >
                                <option value="smiley">Smiley Face</option>
                                <option value="doubleSlit">Double Slit</option>
                                <option value="singleSlit">Single Slit</option>
                                <option value="circle">Circle</option>
                                <option value="square">Square</option>
                                <option value="triangle">Triangle</option>
                                <option value="grating">Grating</option>
                                <option value="annulus">Annulus</option>
                            </select>
                        </div>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={animate}
                                onChange={e => setAnimate(e.target.checked)}
                                className="rounded"
                            />
                            Animate Propagation
                        </label>
                    </div>

                    {shape === 'doubleSlit' && (
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Slit Width: {slitWidth}</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={slitWidth}
                                    onChange={e => setSlitWidth(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Slit Separation: {slitSeparation}</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="40"
                                    value={slitSeparation}
                                    onChange={e => setSlitSeparation(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-8">
                        {aperture && (
                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">Aperture</h3>
                                <div className="bg-neutral-800 rounded-lg p-4">
                                    <DiffractionCanvas data={aperture} isAperture={true} animate={false} />
                                </div>
                            </div>
                        )}
                        {pattern && (
                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">Diffraction Pattern</h3>
                                <div className="bg-neutral-800 rounded-lg p-4">
                                    <DiffractionCanvas data={pattern} isAperture={false} animate={animate} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {compareMode && (
                    <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
                        <h3 className="text-lg font-medium text-white mb-4">Compare Mode - Second Aperture</h3>

                        <div className="flex flex-wrap gap-4 items-center mb-6">
                            <div className="flex items-center gap-2">
                                <span>Shape:</span>
                                <select
                                    value={shape2}
                                    onChange={e => setShape2(e.target.value)}
                                    className="bg-neutral-800 border border-neutral-700 rounded px-3 py-1 text-white"
                                >
                                    <option value="smiley">Smiley Face</option>
                                    <option value="doubleSlit">Double Slit</option>
                                    <option value="singleSlit">Single Slit</option>
                                    <option value="circle">Circle</option>
                                    <option value="square">Square</option>
                                    <option value="triangle">Triangle</option>
                                    <option value="grating">Grating</option>
                                    <option value="annulus">Annulus</option>
                                </select>
                            </div>
                        </div>

                        {shape2 === 'doubleSlit' && (
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Slit Width: {slitWidth2}</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={slitWidth2}
                                        onChange={e => setSlitWidth2(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Slit Separation: {slitSeparation2}</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="40"
                                        value={slitSeparation2}
                                        onChange={e => setSlitSeparation2(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid lg:grid-cols-2 gap-8">
                            {aperture2 && (
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-4">Aperture 2</h3>
                                    <div className="bg-neutral-800 rounded-lg p-4">
                                        <DiffractionCanvas data={aperture2} isAperture={true} animate={false} />
                                    </div>
                                </div>
                            )}
                            {pattern2 && (
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-4">Diffraction Pattern 2</h3>
                                    <div className="bg-neutral-800 rounded-lg p-4">
                                        <DiffractionCanvas data={pattern2} isAperture={false} animate={animate} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}