export type PasswordStrength = {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialCharacter: boolean;
  score: number;
};

const isNumber = (character: string): boolean =>
  character >= '0' && character <= '9';

const isUppercaseLetter = (character: string): boolean =>
  character >= 'A' && character <= 'Z';

const isLowercaseLetter = (character: string): boolean =>
  character >= 'a' && character <= 'z';

const isSpecialCharacter = (character: string): boolean =>
  !isNumber(character) &&
  !isUppercaseLetter(character) &&
  !isLowercaseLetter(character);

export const getPasswordStrength = (password: string): PasswordStrength => {
  const characters = Array.from(password);

  const strength = {
    hasNumber: characters.some(isNumber),
    hasUppercase: characters.some(isUppercaseLetter),
    hasLowercase: characters.some(isLowercaseLetter),
    hasSpecialCharacter: characters.some(isSpecialCharacter),
  };

  const score = Object.values(strength).filter(Boolean).length;

  return {
    ...strength,
    score,
  };
};
