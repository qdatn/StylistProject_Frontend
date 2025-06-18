import { BodyShape } from "@src/types/BodyType";

interface ShapeSectionProps {
  shape: BodyShape;
  isActive: boolean;
}

export function ShapeSection({ shape, isActive }: ShapeSectionProps) {
  return (
    <div className={`transition-opacity duration-100 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
      <div className="max-w-4xl mx-auto bg-violet-300 rounded-2xl shadow-2xl shadow-gray-800 p-6 md:p-8">
        <h2 className="text-4xl font-bold text-purple-950 mb-6">{shape.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-3 space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">Key Characteristics:</h3>
            <ul className="list-disc pl-6 space-y-2">
              {shape.characteristics.map((char, index) => (
                <li key={index} className="text-gray-900">{char}</li>
              ))}
            </ul>
            <h3 className="text-2xl font-semibold text-gray-900">Styling Tips:</h3>
            <ul className="list-disc pl-6 space-y-2">
              {shape.stylingTips.map((tip, index) => (
                <li key={index} className="text-gray-900">{tip}</li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 flex justify-center items-start">
            <img
              src={shape.imageUrl}
              alt={`${shape.name} body shape`}
              className="max-w-full h-auto max-h-80 rounded-lg shadow-lg shadow-slate-700"
            />
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