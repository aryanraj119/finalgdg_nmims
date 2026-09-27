import React from "react";

interface WallsProps {
    width: number;
    length: number;
    height: number;
    wallThickness?: number;
    wallColor?: string;
}

export const Walls: React.FC<WallsProps> = ({
    width,
    length,
    height,
    wallThickness = 0.15,
    wallColor = "#F1F5F9"
}) => {
    const halfW = width / 2;
    const halfL = length / 2;
    const halfH = height / 2;

    return (
        <group>
            {/* Back Wall */}
            <mesh position={[0, halfH, -halfL - wallThickness / 2]} receiveShadow castShadow>
                <boxGeometry args={[width + wallThickness * 2, height, wallThickness]} />
                <meshStandardMaterial color={wallColor} roughness={0.7} transparent opacity={0.85} />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-halfW - wallThickness / 2, halfH, 0]} receiveShadow castShadow>
                <boxGeometry args={[wallThickness, height, length]} />
                <meshStandardMaterial color={wallColor} roughness={0.7} transparent opacity={0.65} />
            </mesh>

            {/* Right Wall */}
            <mesh position={[halfW + wallThickness / 2, halfH, 0]} receiveShadow castShadow>
                <boxGeometry args={[wallThickness, height, length]} />
                <meshStandardMaterial color={wallColor} roughness={0.7} transparent opacity={0.65} />
            </mesh>

            {/* Front Low Base Border Guide */}
            <mesh position={[0, 0.05, halfL + wallThickness / 2]}>
                <boxGeometry args={[width, 0.1, wallThickness]} />
                <meshStandardMaterial color="#CBD5E1" />
            </mesh>
        </group>
    );
};
