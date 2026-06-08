import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  FormSubmission,
  FormSubmissionInput,
  FormsState,
} from '../../types/form';

const countries = [
  'Uzbekistan',
  'Kazakhstan',
  'Kyrgyzstan',
  'Tajikistan',
  'Turkmenistan',
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Japan',
  'South Korea',
  'China',
  'India',
] as const;

const initialState: FormsState = {
  submissions: [],
  countries: [...countries],
  latestSubmissionId: null,
};

const createSubmissionId = (): string => crypto.randomUUID();

export const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addSubmission: (
      state,
      action: PayloadAction<FormSubmissionInput>
    ): void => {
      const submission: FormSubmission = {
        ...action.payload,
        id: createSubmissionId(),
        createdAt: Date.now(),
      };

      state.submissions.unshift(submission);
      state.latestSubmissionId = submission.id;
    },

    clearLatestSubmissionId: (state): void => {
      state.latestSubmissionId = null;
    },
  },
});

export const { addSubmission, clearLatestSubmissionId } = formsSlice.actions;

export default formsSlice.reducer;
