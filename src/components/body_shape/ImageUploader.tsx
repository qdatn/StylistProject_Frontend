// components/ImageUploader.tsx
import { useCallback, useEffect, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';

export interface ImageUploaderProps {
    onUpload: (file: File) => Promise<void> | void;
    isLoading: boolean;
    onCancel?: () => void;
}

export function ImageUploader({ onUpload, isLoading, onCancel }: ImageUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            setError(null);
            const file = acceptedFiles[0];
            if (file) {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onload = () => setPreviewUrl(reader.result as string);
                reader.readAsDataURL(file);
            }

            if (fileRejections.length > 0) {
                const isSizeError = fileRejections.some(rejection =>
                    rejection.errors.some(e => e.code === 'file-too-large')
                );
                if (isSizeError) {
                    setError('File size exceeds 5MB limit.');
                    const errors = fileRejections.flatMap(rejection =>
                        rejection.errors.map(error => error.message)
                    );
                    setError(errors.join(', '));
                }
                return;
            }
        },
        []
    );
    // useEffect(() => {
    //     console.log("-----------------Error",error)
    //   }, [error]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: false,
        maxSize: 5 * 1024 * 1024

    });

    const handleAnalyze = async () => {
        if (selectedFile) {
            try {
                await onUpload(selectedFile);
                console.log('----------------------------------------------------------------------')
                // xử lý ảnh
            } catch (err) {
                setError('Error analyzing image. Please try again.');
            }
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);
        onCancel?.();
    };

    return (
        <div className="sticky top-20 z-40b backdrop-blur-sm py-6 border-b border-purple-100">
            <div className="max-w-4xl mx-auto px-4">
                <div
                    {...getRootProps()}
                    className={`rounded-xl p-8 transition-all cursor-pointer
            ${isDragActive
                            ? 'bg-purple-600 border-2 border-dashed border-purple-700'
                            : 'bg-purple-50 border-2 border-dashed border-purple-300 hover:border-purple-500'
                        }
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center justify-center space-y-4">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-h-64 w-full object-contain rounded-lg"
                            />
                        ) : (
                            <>
                                <div className="text-purple-600">
                                    <svg
                                        className={`w-12 h-12 transition-colors ${isDragActive ? 'text-white' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                </div>

                                <div
                                    className={`text-center ${isDragActive ? 'text-white' : 'text-gray-600'
                                        }`}
                                >
                                    <p className="text-lg font-medium">
                                        {isDragActive
                                            ? 'Drop image to upload'
                                            : 'Drag and drop or click to select image'}
                                    </p>
                                    <p className="text-sm mt-1">Supported formats: JPG, PNG, WEBP</p>
                                    <p className="text-sm text-purple-400 mt-1">
                                        Maximum size: 5MB
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mt-4 text-center text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {(selectedFile && !isLoading) && (
                    <div className="mt-4 flex justify-center gap-3">
                        <button
                            onClick={handleAnalyze}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Analyze Image
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {isLoading && (
                    <div className="mt-4 flex flex-col items-center space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                        <p className="text-gray-600 text-sm">Analyzing image...</p>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}