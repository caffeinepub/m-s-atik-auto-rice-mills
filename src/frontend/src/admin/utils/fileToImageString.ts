/**
 * Converts a File object to a data URL string for storage
 * @param file The image file to convert
 * @returns Promise resolving to a data URL string
 * @throws Error if file type is unsupported or read fails
 */
export async function fileToImageString(file: File): Promise<string> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Unsupported file type. Please upload a JPEG, PNG, GIF, WebP, or SVG image.');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB. Please choose a smaller image.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file. Please try again.'));
    };

    reader.readAsDataURL(file);
  });
}
