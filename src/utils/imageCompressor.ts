/**
 * Client-Side Image Compression Pipeline
 * Uses HTML5 Canvas to resize high-resolution camera photos (often 3MB - 12MB)
 * to a crisp, high-fashion aspect ratio (max 800px) and converts to WebP or JPEG (~50KB - 85KB).
 * Stored 100% locally in user's on-device private sandbox.
 */

export interface CompressionResult {
  base64: string;
  sizeKb: number;
  originalSizeKb: number;
  format: string;
  dimensions: { width: number; height: number };
}

export async function compressWardrobeImage(file: File, maxDimension = 800, quality = 0.78): Promise<CompressionResult> {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error('Unsupported image format. Please upload JPG, PNG, or WebP.');
  }

  // Max raw input: 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File exceeds the 10MB raw photo limit. Please select a smaller photo.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file.'));

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid or corrupted image data.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while clamping to maxDimension
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not access canvas rendering context.'));
          return;
        }

        // High quality bicubic image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported, fallback to JPEG
        let compressedBase64 = canvas.toDataURL('image/webp', quality);
        let format = 'image/webp';

        // Check if browser actually produced WebP or fell back to png
        if (!compressedBase64.startsWith('data:image/webp')) {
          compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          format = 'image/jpeg';
        }

        const stringLength = compressedBase64.length - 'data:image/webp;base64,'.length;
        const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383;
        const sizeKb = Math.round(sizeInBytes / 1024);

        resolve({
          base64: compressedBase64,
          sizeKb,
          originalSizeKb: Math.round(file.size / 1024),
          format,
          dimensions: { width, height }
        });
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
