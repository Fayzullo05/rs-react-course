import { ImageValidation } from '../constants/form';

export const isFileValue = (value: unknown): value is File => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('name' in value) || !('size' in value) || !('type' in value)) {
    return false;
  }

  const fileCandidate = value as {
    name: unknown;
    size: unknown;
    type: unknown;
  };

  return (
    typeof fileCandidate.name === 'string' &&
    typeof fileCandidate.size === 'number' &&
    fileCandidate.size > 0 &&
    typeof fileCandidate.type === 'string'
  );
};

const getFileExtension = (fileName: string): string =>
  fileName.split('.').pop()?.toLowerCase() ?? '';

export const validateImageFile = (file: File): string | null => {
  const allowedMimeTypes: readonly string[] = ImageValidation.allowedMimeTypes;
  const allowedExtensions: readonly string[] =
    ImageValidation.allowedExtensions;

  const fileExtension = getFileExtension(file.name);

  if (
    !allowedMimeTypes.includes(file.type) ||
    !allowedExtensions.includes(fileExtension)
  ) {
    return 'Image must be a PNG or JPEG file.';
  }

  if (file.size > ImageValidation.maxSizeBytes) {
    return 'Image size must be less than 1 MB.';
  }

  return null;
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Failed to convert image to base64.'));
    });

    reader.addEventListener('error', () => {
      reject(new Error('Failed to read image file.'));
    });

    reader.readAsDataURL(file);
  });
};
