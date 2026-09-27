import React from "react";

interface FloorProps {
    width: number;
    length: number;
    color?: string;
}

export const Floor: React.FC<FloorProps> = ({ width, length, color = "#F8FAFC" }) => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[width, length]} />
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
        </mesh>
    );
};
