import { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { fileToImageString } from '../utils/fileToImageString';

interface ImageStringUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  id?: string;
}

export function ImageStringUploadField({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder = 'Enter image URL or upload a file',
  id = 'imageUrl',
}: ImageStringUploadFieldProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const dataUrl = await fileToImageString(file);
      onChange(dataUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearImage = () => {
    onChange('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isUploading}
          required={required}
          className="flex-1"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
          aria-label="Upload image file"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClearImage}
            disabled={disabled || isUploading}
            title="Clear image"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}

      {value && (
        <Card className="p-4 mt-2">
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-md bg-muted">
            <img
              src={value}
              alt="Preview"
              className="object-contain w-full h-full"
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.alt = 'Failed to load image';
              }}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
