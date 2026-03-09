import { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
    onImageSelect: (base64: string) => void;
    preview: string | null;
    onClear: () => void;
}

export default function ImageUploader({ onImageSelect, preview, onClear }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;

        // Compress if needed and convert to base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            onImageSelect(result);
        };
        reader.readAsDataURL(file);
    }, [onImageSelect]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    if (preview) {
        return (
            <div className="preview-container">
                <img src={preview} alt="Upload preview" className="preview-image" />
                <button className="preview-remove" onClick={onClear} title="Remove">
                    ✕
                </button>
            </div>
        );
    }

    return (
        <div
            className={`dropzone ${isDragging ? 'active' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
        >
            <span className="dropzone-icon">📸</span>
            <p className="dropzone-text">Drop your selfie here or click to upload</p>
            <p className="dropzone-hint">JPG, PNG, WebP — max 10MB</p>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
            />
        </div>
    );
}
