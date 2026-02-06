"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Slow-moving particle cloud
function Particles() {
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const count = 400;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.02;
            ref.current.rotation.x += delta * 0.01;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.08}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
            />
        </Points>
    );
}

// Robotic cursor component
function RoboticCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isHovered, setIsHovered] = useState(false);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === "a" ||
                target.tagName.toLowerCase() === "button" ||
                target.closest("a") ||
                target.closest("button") ||
                target.getAttribute("role") === "button" ||
                target.classList.contains("cursor-pointer")
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        // Rotation animation
        const rotationInterval = setInterval(() => {
            setRotation(prev => prev + 2);
        }, 50);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            clearInterval(rotationInterval);
        };
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 99999,
            }}
            className="hidden md:block"
        >
            {/* Outer rotating ring */}
            <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                style={{
                    position: "absolute",
                    left: position.x - 25,
                    top: position.y - 25,
                    transform: `rotate(${rotation}deg) scale(${isHovered ? 1.3 : 1})`,
                    transition: "transform 0.2s ease-out",
                }}
            >
                {/* Outer dashed circle */}
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke={isHovered ? "#FF003C" : "#00F0FF"}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.6"
                />
                {/* Corner brackets */}
                <path
                    d="M25 5 L25 12"
                    stroke={isHovered ? "#FF003C" : "#00F0FF"}
                    strokeWidth="2"
                />
                <path
                    d="M25 38 L25 45"
                    stroke={isHovered ? "#FF003C" : "#00F0FF"}
                    strokeWidth="2"
                />
                <path
                    d="M5 25 L12 25"
                    stroke={isHovered ? "#FF003C" : "#00F0FF"}
                    strokeWidth="2"
                />
                <path
                    d="M38 25 L45 25"
                    stroke={isHovered ? "#FF003C" : "#00F0FF"}
                    strokeWidth="2"
                />
            </svg>

            {/* Small corner indicators */}
            <div
                style={{
                    position: "absolute",
                    left: position.x - 15,
                    top: position.y - 15,
                    width: 30,
                    height: 30,
                    opacity: isHovered ? 1 : 0.4,
                    transition: "opacity 0.2s",
                }}
            >
                {/* Top-left corner */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 6,
                    height: 6,
                    borderTop: `2px solid ${isHovered ? "#FF003C" : "#00F0FF"}`,
                    borderLeft: `2px solid ${isHovered ? "#FF003C" : "#00F0FF"}`,
                }} />
                {/* Top-right corner */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 6,
                    height: 6,
                    borderTop: `2px solid ${isHovered ? "#FF003C" : "#00F0FF"}`,
                    borderRight: `2px solid ${isHovered ? "#FF003C" : "#00F0FF"}`,
                }} />
                {/* Bottom-left corner */}
                <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 6,
                    height: 6,
                    borderBottom: `2px solid ${isHovered ? "#FF003C" : "#00F0FF"}`,
                    borderLeft: `2px solid ${isHovered ? "#FF003C" : "#00F0FF"}`,
                }} />
                {/* Bottom-right corner */}
                <div style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 6,
                    height: 6,
                    borderBottom: `2px solid ${isHovered ? "#FF003C" : "#00F0FF"}`,
                    borderRight: `2px solid ${isHovered ? "#FF003C" : "#00F0FF"}`,
                }} />
            </div>
        </div>
    );
}

export default function ParticleBackground() {
    return (
        <>
            <style jsx global>{`
                * {
                    cursor: none !important;
                }
                @media (max-width: 768px) {
                    * {
                        cursor: auto !important;
                    }
                }
            `}</style>

            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 0,
                    pointerEvents: "none",
                    overflow: "hidden",
                }}
            >
                {/* Base dark background */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "#000000",
                    }}
                />

                {/* Central gradient blob */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80vw",
                        height: "80vh",
                        background: `
                            radial-gradient(
                                ellipse at 50% 50%,
                                rgba(0, 240, 255, 0.08) 0%,
                                rgba(255, 0, 60, 0.04) 35%,
                                rgba(0, 0, 0, 0) 70%
                            )
                        `,
                        filter: "blur(80px)",
                    }}
                />

                {/* Particle Canvas */}
                <Canvas
                    camera={{ position: [0, 0, 15], fov: 60 }}
                    gl={{ alpha: true, antialias: true }}
                    style={{ position: "absolute", inset: 0, zIndex: 2 }}
                >
                    <Particles />
                </Canvas>
            </div>

            {/* Robotic Cursor */}
            <RoboticCursor />
        </>
    );
}
