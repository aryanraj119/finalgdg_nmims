import React from "react";

interface GridProps {
    width: number;
    length: number;
}

export const Grid: React.FC<GridProps> = ({ width, length }) => {
    return (
        <group position={[0, 0.001, 0]}>
            <gridHelper
                args={[Math.max(width, length) * 1.5, Math.max(width, length) * 2, "#94A3B8", "#E2E8F0"]}
            />
        </group>
    );
};
