import { BodyShape } from "@src/types/BodyType";

interface ShapeSectionProps {
  shape: BodyShape;
  isActive: boolean;
}

export function ShapeSection({ shape, isActive }: ShapeSectionProps) {
  return (
    <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">  <h2 className="text-4xl font-bold text-purple-600 mb-6">{shape.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">Key Characteristics:</h3>
            <ul className="list-disc pl-6 space-y-2">
              {shape.characteristics.map((char, index) => (
                <li key={index} className="text-gray-600">{char}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">Styling Tips:</h3>
            <ul className="list-disc pl-6 space-y-2">
              {shape.stylingTips.map((tip, index) => (
                <li key={index} className="text-gray-600">{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-purple-50 rounded-lg">
          <h4 className="text-xl font-semibold text-purple-700">Body Proportion:</h4>
          <p className="text-gray-600 mt-2">{shape.proportion}</p>
        </div>
      </div>
    </div>
  );
}