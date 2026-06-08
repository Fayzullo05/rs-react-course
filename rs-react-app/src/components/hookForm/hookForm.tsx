import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSubmission } from '../../store/forms/formsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createFormSchema,
  type FormSchemaInput,
  type FormSchemaOutput,
} from '../../validation/formSchema';
import { convertImageToBase64 } from '../../utils/image';
import { getPasswordStrength } from '../../utils/passwordStrength';
import PasswordStrengthIndicator from '../passwordStrengthIndicator/passwordStrengthIndicator';
import styles from './hookForm.module.css';

type HookFormProps = Readonly<{
  onSuccess: () => void;
}>;

function HookForm({ onSuccess }: HookFormProps) {
  const extraSpace = '\u00A0';

  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.forms.countries);

  const schema = useMemo(() => createFormSchema(countries), [countries]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormSchemaInput, unknown, FormSchemaOutput>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: '',
      email: '',
      gender: undefined,
      termsAccepted: false,
      image: undefined,
      password: '',
      confirmPassword: '',
      country: '',
    },
  });

  const password = useWatch({ control, name: 'password' });
  const passwordStrength = getPasswordStrength(password ?? '');

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setValue('image', file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (values: FormSchemaOutput): Promise<void> => {
    const imageBase64 = await convertImageToBase64(values.image);

    dispatch(
      addSubmission({
        name: values.name,
        age: values.age,
        email: values.email,
        gender: values.gender,
        termsAccepted: values.termsAccepted,
        imageBase64,
        password: values.password,
        country: values.country,
        source: 'react-hook-form',
      })
    );

    reset();
    onSuccess();
  };

  return (
    <form
      className={styles.form}
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      <div className={styles.field}>
        <label htmlFor="hook-form-name">Name</label>
        <input id="hook-form-name" type="text" {...register('name')} />
        <p className={styles.error}>{errors.name?.message ?? extraSpace}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="hook-form-age">Age</label>
        <input id="hook-form-age" type="number" {...register('age')} />
        <p className={styles.error}>{errors.age?.message ?? extraSpace}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="hook-form-email">Email</label>
        <input id="hook-form-email" type="email" {...register('email')} />
        <p className={styles.error}>{errors.email?.message ?? extraSpace}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="hook-form-gender">Gender</label>
        <select id="hook-form-gender" defaultValue="" {...register('gender')}>
          <option value="" disabled>
            Select gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <p className={styles.error}>{errors.gender?.message ?? extraSpace}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="hook-form-image">Profile image</label>
        <input
          id="hook-form-image"
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleImageChange}
        />
        <p className={styles.error}>{errors.image?.message ?? extraSpace}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="hook-form-password">Password</label>
        <input
          id="hook-form-password"
          type="password"
          {...register('password')}
        />
        <p className={styles.error}>{errors.password?.message ?? extraSpace}</p>
      </div>

      <PasswordStrengthIndicator strength={passwordStrength} />

      <div className={styles.field}>
        <label htmlFor="hook-form-confirm-password">Confirm password</label>
        <input
          id="hook-form-confirm-password"
          type="password"
          {...register('confirmPassword')}
        />
        <p className={styles.error}>
          {errors.confirmPassword?.message ?? extraSpace}
        </p>
      </div>

      <div className={styles.field}>
        <label htmlFor="hook-form-country">Country</label>
        <input
          id="hook-form-country"
          type="text"
          list="hook-form-countries"
          {...register('country')}
        />
        <datalist id="hook-form-countries">
          {countries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        <p className={styles.error}>{errors.country?.message ?? extraSpace}</p>
      </div>

      <div className={styles.checkboxField}>
        <input
          id="hook-form-terms"
          type="checkbox"
          {...register('termsAccepted')}
        />
        <label htmlFor="hook-form-terms">I accept Terms and Conditions</label>
      </div>
      <p className={styles.error}>
        {errors.termsAccepted?.message ?? extraSpace}
      </p>

      <button type="submit" disabled={!isValid || isSubmitting}>
        Submit React Hook Form
      </button>
    </form>
  );
}

export default HookForm;
