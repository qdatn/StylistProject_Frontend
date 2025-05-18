import { BodyShape } from "@src/types/BodyType";
import { useEffect } from "react";

interface NavigationProps {
    shapes: BodyShape[];
    selected: string;
    onSelect: (id: string) => void;
}

export function NavigationBar({ shapes, selected, onSelect }: NavigationProps) {
    return (
        <nav className="sticky top-0 z-50">
            <div className="flex justify-center space-x-8 py-4">
                {shapes.map((shape) => (
                    <button
                        key={shape.id}
                        onClick={() => {
                            onSelect(shape.id);
                            window.dispatchEvent(new Event('scroll'));
                        }}
                        className={`px-4 py-2 transition-all duration-300 w-[180px] ${selected === shape.id
                            ? "text-purple-600 font-semibold border-b-2 border-purple-600"
                            : "hover:text-purple-600 text-gray-600"
                            }`}
                    >
                        {shape.name}
                    </button>
                ))}
            </div>
        </nav>
    );
}