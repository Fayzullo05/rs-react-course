export type Gender = 'male' | 'female' | 'other';

export type FormSource = 'uncontrolled' | 'react-hook-form';

export type FormSubmissionInput = {
  name: string;
  age: number;
  email: string;
  gender: Gender;
  termsAccepted: boolean;
  imageBase64: string;
  password: string;
  country: string;
  source: FormSource;
};

export type FormSubmission = FormSubmissionInput & {
  id: string;
  createdAt: number;
};

export type FormsState = {
  submissions: FormSubmission[];
  countries: string[];
  latestSubmissionId: string | null;
};
