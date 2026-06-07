import { useState, type FormEvent } from 'react';
import { addSubmission } from '../../store/forms/formsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createFormSchema } from '../../validation/formSchema';
import { convertImageToBase64 } from '../../utils/image';
import { getPasswordStrength } from '../../utils/passwordStrength';
import PasswordStrengthIndicator from '../passwordStrengthIndicator/passwordStrengthIndicator';
import styles from './uncontrolledForm.module.css';

type UncontrolledFormProps = Readonly<{
  onSuccess: () => void;
}>;

const formErrorKeys = [
  'name',
  'age',
  'email',
  'gender',
  'termsAccepted',
  'image',
  'password',
  'confirmPassword',
  'country',
] as const;

type FormErrorKey = (typeof formErrorKeys)[number];

type FormErrors = Partial<Record<FormErrorKey, string>>;

const emptyPasswordStrength = getPasswordStrength('');

const isFormErrorKey = (value: unknown): value is FormErrorKey =>
  typeof value === 'string' &&
  (formErrorKeys as readonly string[]).includes(value);

const getStringValue = (formData: FormData, key: string): string => {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
};

const getImageFile = (formData: FormData): File | null => {
  const value = formData.get('image');

  if (value instanceof File && value.size > 0) {
    return value;
  }

  return null;
};

function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.forms.countries);

  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(
    emptyPasswordStrength
  );

  const schema = createFormSchema(countries);

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPasswordStrength(getPasswordStrength(event.target.value));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const rawValues = {
      name: getStringValue(formData, 'name'),
      age: getStringValue(formData, 'age'),
      email: getStringValue(formData, 'email'),
      gender: getStringValue(formData, 'gender'),
      termsAccepted: formData.get('termsAccepted') === 'on',
      image: getImageFile(formData),
      password: getStringValue(formData, 'password'),
      confirmPassword: getStringValue(formData, 'confirmPassword'),
      country: getStringValue(formData, 'country'),
    };

    const validationResult = schema.safeParse(rawValues);

    if (!validationResult.success) {
      const nextErrors: FormErrors = {};

      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (isFormErrorKey(fieldName) && !nextErrors[fieldName]) {
          nextErrors[fieldName] = issue.message;
        }
      });

      setErrors(nextErrors);
      return;
    }

    const imageBase64 = await convertImageToBase64(validationResult.data.image);

    dispatch(
      addSubmission({
        name: validationResult.data.name,
        age: validationResult.data.age,
        email: validationResult.data.email,
        gender: validationResult.data.gender,
        termsAccepted: validationResult.data.termsAccepted,
        imageBase64,
        password: validationResult.data.password,
        country: validationResult.data.country,
        source: 'uncontrolled',
      })
    );

    form.reset();
    setErrors({});
    setPasswordStrength(emptyPasswordStrength);
    onSuccess();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="uncontrolled-name">Name</label>
        <input id="uncontrolled-name" name="name" type="text" />
        <p className={styles.error}>{errors.name ?? '\u00A0'}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="uncontrolled-age">Age</label>
        <input id="uncontrolled-age" name="age" type="number" />
        <p className={styles.error}>{errors.age ?? '\u00A0'}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="uncontrolled-email">Email</label>
        <input id="uncontrolled-email" name="email" type="email" />
        <p className={styles.error}>{errors.email ?? '\u00A0'}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="uncontrolled-gender">Gender</label>
        <select id="uncontrolled-gender" name="gender" defaultValue="">
          <option value="" disabled>
            Select gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <p className={styles.error}>{errors.gender ?? '\u00A0'}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="uncontrolled-image">Profile image</label>
        <input
          id="uncontrolled-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
        />
        <p className={styles.error}>{errors.image ?? '\u00A0'}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="uncontrolled-password">Password</label>
        <input
          id="uncontrolled-password"
          name="password"
          type="password"
          onChange={handlePasswordChange}
        />
        <p className={styles.error}>{errors.password ?? '\u00A0'}</p>
      </div>

      <PasswordStrengthIndicator strength={passwordStrength} />

      <div className={styles.field}>
        <label htmlFor="uncontrolled-confirm-password">Confirm password</label>
        <input
          id="uncontrolled-confirm-password"
          name="confirmPassword"
          type="password"
        />
        <p className={styles.error}>{errors.confirmPassword ?? '\u00A0'}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="uncontrolled-country">Country</label>
        <input
          id="uncontrolled-country"
          name="country"
          type="text"
          list="uncontrolled-countries"
        />
        <datalist id="uncontrolled-countries">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        <p className={styles.error}>{errors.country ?? '\u00A0'}</p>
      </div>

      <div className={styles.checkboxField}>
        <input id="uncontrolled-terms" name="termsAccepted" type="checkbox" />
        <label htmlFor="uncontrolled-terms">
          I accept terms and conditions
        </label>
      </div>
      <p className={styles.error}>{errors.termsAccepted ?? '\u00A0'}</p>

      <button type="submit">Submit uncontrolled form</button>
    </form>
  );
}

export default UncontrolledForm;
