export const ImageValidation = {
  maxSizeBytes: 1024 * 1024,
  allowedMimeTypes: ['image/png', 'image/jpeg'],
  allowedExtensions: ['png', 'jpg', 'jpeg'],
} as const;

export const PasswordRequirement = {
  number: '1 number',
  uppercase: '1 uppercase letter',
  lowercase: '1 lowercase letter',
  specialCharacter: '1 special character',
} as const;
