import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, expect, test, vi } from 'vitest';
import formsReducer from '../../store/forms/formsSlice';
import type { FormSubmission, FormsState } from '../../types/form';
import SubmissionsList from './submissionsList';

const countries = ['Uzbekistan', 'Germany'];

const mockSubmission: FormSubmission = {
  id: 'submission-1',
  createdAt: 1000,
  name: 'Fayzullo',
  age: 20,
  email: 'fayzullo@example.com',
  gender: 'male',
  termsAccepted: true,
  imageBase64: 'data:image/png;base64,test',
  password: 'Password1!',
  country: 'Uzbekistan',
  source: 'uncontrolled',
};

const createTestStore = (formsState?: FormsState) =>
  configureStore({
    reducer: {
      forms: formsReducer,
    },
    preloadedState: formsState
      ? {
          forms: formsState,
        }
      : undefined,
  });

const renderSubmissionsList = (formsState?: FormsState) => {
  const store = createTestStore(formsState);

  render(
    <Provider store={store}>
      <SubmissionsList />
    </Provider>
  );

  return store;
};

describe('SubmissionsList', () => {
  test('shows empty message when there are no submissions', () => {
    renderSubmissionsList();

    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument();
  });

  test('renders submitted profile card', () => {
    renderSubmissionsList({
      submissions: [mockSubmission],
      countries,
      latestSubmissionId: null,
    });

    expect(screen.getByText('Fayzullo')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('fayzullo@example.com')).toBeInTheDocument();
    expect(screen.getByText('Uzbekistan')).toBeInTheDocument();
    expect(screen.getByText('uncontrolled')).toBeInTheDocument();

    expect(
      screen.getByRole('img', { name: /fayzullo profile/i })
    ).toHaveAttribute('src', mockSubmission.imageBase64);
  });

  test('shows and clears new submission indicator', () => {
    vi.useFakeTimers();

    renderSubmissionsList({
      submissions: [mockSubmission],
      countries,
      latestSubmissionId: mockSubmission.id,
    });

    expect(screen.getByText(/new submission/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText(/new submission/i)).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
