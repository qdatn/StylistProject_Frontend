import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface BodyShape {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  fashionTips: string[];
  image: string;
}

const BodyShapePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState<BodyShape | null>(null);

  // Mock data
  const bodyShapes: BodyShape[] = [
    {
      id: '1',
      name: 'Hourglass',
      description: 'Cân đối với eo thon và hông/vai cân bằng',
      characteristics: ['Vòng 1 và vòng 3 tương đương', 'Eo nhỏ hơn 25cm so với hông'],
      fashionTips: ['Đầm bút chì', 'Thắt lưng rộng', 'Áo crop-top'],
      image: '/hourglass.png'
    },
    {
      id: '2',
      name: 'Rectangle',
      description: 'Tỉ lệ cơ thể thẳng',
      characteristics: ['Vòng eo không quá nhỏ', 'Hông và vai gần bằng nhau'],
      fashionTips: ['Đầm xòe', 'Áo layer', 'Quần ống rộng'],
      image: '/rectangle.png'
    },
    // Thêm các dáng khác
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate API call
    setIsLoading(true);
    setSelectedFile(file);
    
    // Fake detection
    setTimeout(() => {
      setIsLoading(false);
      setDetectionResult(bodyShapes[Math.floor(Math.random() * bodyShapes.length)]);
    }, 2000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Nhận diện dáng cơ thể
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Body Shapes List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Các dáng cơ thể phổ biến
          </h2>
          
          {bodyShapes.map((shape) => (
            <div 
              key={shape.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <img 
                  src={shape.image} 
                  alt={shape.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {shape.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{shape.description}</p>
                  
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-700">Đặc điểm:</h4>
                    <ul className="list-disc pl-5 text-gray-600">
                      {shape.characteristics.map((char, i) => (
                        <li key={i}>{char}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-medium text-gray-700">Gợi ý phong cách:</h4>
                    <ul className="list-disc pl-5 text-gray-600">
                      {shape.fashionTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detection Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm h-fit sticky top-8">
          <div 
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}
          >
            <input {...getInputProps()} />
            
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-64 mx-auto object-cover rounded"
              />
            ) : (
              <div className="space-y-4">
                <div className="text-gray-500 text-4xl">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <p className="text-gray-600">
                  Kéo thả ảnh vào đây hoặc click để chọn
                </p>
                <p className="text-sm text-gray-500">
                  Định dạng hỗ trợ: JPEG, PNG
                </p>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="mt-6 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 
                rounded-full border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Đang phân tích...</p>
            </div>
          )}

          {detectionResult && !isLoading && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Kết quả nhận diện
              </h3>
              <div className="flex items-start gap-4">
                <img 
                  src={detectionResult.image} 
                  alt={detectionResult.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Dáng {detectionResult.name}
                  </p>
                  <p className="text-gray-600">{detectionResult.description}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-700">Gợi ý phong cách:</h4>
                <ul className="list-disc pl-5 text-gray-600">
                  {detectionResult.fashionTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyShapePage;