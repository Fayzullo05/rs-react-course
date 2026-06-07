export const isValidEmail = (email: string): boolean => {
  const parts = email.split('@');

  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  if (!localPart || !domain) {
    return false;
  }

  if (!domain.includes('.')) {
    return false;
  }

  return domain.split('.').every(Boolean);
};
