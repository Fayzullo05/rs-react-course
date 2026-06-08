import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, test, vi } from 'vitest';
import formsReducer from '../../store/forms/formsSlice';
import HookForm from './hookForm';

const validImage = new File(['image-content'], 'avatar.png', {
  type: 'image/png',
});

const createTestStore = () =>
  configureStore({
    reducer: {
      forms: formsReducer,
    },
  });

const renderHookForm = () => {
  const store = createTestStore();
  const handleSuccess = vi.fn();

  render(
    <Provider store={store}>
      <HookForm onSuccess={handleSuccess} />
    </Provider>
  );

  return {
    store,
    handleSuccess,
  };
};

const fillValidHookForm = async (
  user: ReturnType<typeof userEvent.setup>,
  country = 'Uzbekistan'
): Promise<void> => {
  await user.type(screen.getByLabelText(/^name$/i), 'Fayzullo');
  await user.type(screen.getByLabelText(/^age$/i), '20');
  await user.type(screen.getByLabelText(/^email$/i), 'fayzullo@example.com');
  await user.selectOptions(screen.getByLabelText(/^gender$/i), 'male');
  await user.upload(screen.getByLabelText(/profile image/i), validImage);
  await user.type(screen.getByLabelText(/^password$/i), 'Password1!');
  await user.type(screen.getByLabelText(/confirm password/i), 'Password1!');
  await user.type(screen.getByLabelText(/^country$/i), country);
  await user.click(screen.getByLabelText(/i accept terms and conditions/i));
};

describe('HookForm', () => {
  test('renders all required fields with labels', () => {
    renderHookForm();

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^gender$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^country$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/i accept terms and conditions/i)
    ).toBeInTheDocument();
  });

  test('submit button is disabled when form is invalid', () => {
    renderHookForm();

    expect(
      screen.getByRole('button', { name: /submit react hook form/i })
    ).toBeDisabled();
  });

  test('shows live validation errors', async () => {
    const user = userEvent.setup();

    renderHookForm();

    await user.type(screen.getByLabelText(/^name$/i), 'fayzullo');
    await user.tab();

    expect(
      await screen.findByText(/name must start with an uppercase letter/i)
    ).toBeInTheDocument();
  });

  test('shows password strength while typing password', async () => {
    const user = userEvent.setup();

    renderHookForm();

    await user.type(screen.getByLabelText(/^password$/i), 'Password1!');

    expect(screen.getByText(/password strength: 4\/4/i)).toBeInTheDocument();
  });

  test('submits valid data to store and calls success callback', async () => {
    const user = userEvent.setup();
    const { store, handleSuccess } = renderHookForm();

    await fillValidHookForm(user);

    const submitButton = screen.getByRole('button', {
      name: /submit react hook form/i,
    });

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledTimes(1);
    });

    const state = store.getState();

    expect(state.forms.submissions).toHaveLength(1);
    expect(state.forms.submissions[0]).toMatchObject({
      name: 'Fayzullo',
      age: 20,
      email: 'fayzullo@example.com',
      gender: 'male',
      termsAccepted: true,
      password: 'Password1!',
      country: 'Uzbekistan',
      source: 'react-hook-form',
    });

    expect(state.forms.submissions[0].imageBase64).toContain('base64');
  });

  test('keeps submit button disabled for invalid country', async () => {
    const user = userEvent.setup();

    renderHookForm();

    await fillValidHookForm(user, 'InvalidCountry');

    expect(
      await screen.findByText(/country must be selected from the list/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /submit react hook form/i })
    ).toBeDisabled();
  });
});
