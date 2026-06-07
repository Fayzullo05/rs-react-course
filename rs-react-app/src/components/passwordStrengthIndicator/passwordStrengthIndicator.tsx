import { PasswordRequirement } from '../../constants/form';
import type { PasswordStrength } from '../../utils/passwordStrength';
import styles from './passwordStrengthIndicator.module.css';

type PasswordStrengthIndicatorProps = Readonly<{
  strength: PasswordStrength;
}>;

function PasswordStrengthIndicator({
  strength,
}: PasswordStrengthIndicatorProps) {
  return (
    <div className={styles.container} aria-live="polite">
      <p className={styles.title}>Password strength: {strength.score}/4</p>

      <ul className={styles.list}>
        <li>
          {strength.hasNumber ? '✅' : '❌'} {PasswordRequirement.number}
        </li>
        <li>
          {strength.hasUppercase ? '✅' : '❌'} {PasswordRequirement.uppercase}
        </li>
        <li>
          {strength.hasLowercase ? '✅' : '❌'} {PasswordRequirement.lowercase}
        </li>
        <li>
          {strength.hasSpecialCharacter ? '✅' : '❌'}{' '}
          {PasswordRequirement.specialCharacter}
        </li>
      </ul>
    </div>
  );
}

export default PasswordStrengthIndicator;
