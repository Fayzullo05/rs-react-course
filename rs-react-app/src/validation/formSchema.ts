import { z } from 'zod';
import { isValidEmail } from '../utils/email';
import { validateImageFile } from '../utils/image';

const genders = ['male', 'female', 'other'] as const;

const startsWithUppercase = (value: string): boolean => {
  const firstCharacter = value.trim().charAt(0);

  return (
    firstCharacter.length > 0 &&
    firstCharacter === firstCharacter.toUpperCase() &&
    firstCharacter !== firstCharacter.toLowerCase()
  );
};

export const createFormSchema = (countries: readonly string[]) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, 'Name is required.')
        .refine(startsWithUppercase, {
          message: 'Name must start with an uppercase letter.',
        }),

      age: z
        .string()
        .trim()
        .min(1, 'Age is required.')
        .refine((value) => Number.isFinite(Number(value)), {
          message: 'Age must be a number.',
        })
        .transform(Number)
        .refine((value) => value >= 0, {
          message: 'Age cannot be negative.',
        }),

      email: z
        .string()
        .trim()
        .min(1, 'Email is required.')
        .refine(isValidEmail, {
          message: 'Email must contain one @ and a valid domain.',
        }),

      gender: z.enum(genders, {
        message: 'Gender is required.',
      }),

      termsAccepted: z.boolean().refine((value) => value, {
        message: 'You must accept Terms and Conditions.',
      }),

      image: z
        .custom<File>((value) => value instanceof File, {
          message: 'Image is required.',
        })
        .refine((file) => validateImageFile(file) === null, {
          message: 'Image must be PNG/JPEG and less than 1 MB.',
        }),

      password: z.string().min(1, 'Password is required.'),

      confirmPassword: z.string().min(1, 'Confirm password is required.'),

      country: z
        .string()
        .trim()
        .min(1, 'Country is required.')
        .refine((value) => countries.includes(value), {
          message: 'Country must be selected from the list.',
        }),
    })
    .superRefine((data, context) => {
      if (data.password !== data.confirmPassword) {
        context.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: 'Passwords must match.',
        });
      }
    });

export type FormSchemaValues = z.infer<ReturnType<typeof createFormSchema>>;
