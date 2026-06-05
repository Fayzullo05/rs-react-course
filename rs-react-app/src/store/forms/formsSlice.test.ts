import { describe, expect, test, vi } from 'vitest';
import formsReducer, {
  addSubmission,
  clearLatestSubmissionId,
} from './formsSlice';
import type { FormsState } from '../../types/form';

const initialState: FormsState = {
  submissions: [],
  countries: ['Uzbekistan'],
  latestSubmissionId: null,
};

const mockSubmission = {
  name: 'Fayzullo',
  age: 20,
  email: 'fayzullo@example.com',
  gender: 'male' as const,
  termsAccepted: true,
  imageBase64: 'data:image/png;base64,test',
  password: 'Password1!',
  country: 'Uzbekistan',
  source: 'uncontrolled' as const,
};

describe('formsSlice', () => {
  test('adds form submission to the beginning of the list', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-id-mock-uuid-format');

    vi.setSystemTime(1000);

    const state = formsReducer(initialState, addSubmission(mockSubmission));

    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0]).toEqual({
      ...mockSubmission,
      id: 'test-id-mock-uuid-format',
      createdAt: 1000,
    });
    expect(state.latestSubmissionId).toBe('test-id-mock-uuid-format');

    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('clears latest submission id', () => {
    const state = formsReducer(
      {
        ...initialState,
        latestSubmissionId: 'test-id-mock-uuid-format',
      },
      clearLatestSubmissionId()
    );

    expect(state.latestSubmissionId).toBeNull();
  });
});
