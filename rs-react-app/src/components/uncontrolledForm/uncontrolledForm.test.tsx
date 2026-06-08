import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, test, vi } from 'vitest';
import formsReducer from '../../store/forms/formsSlice';
import UncontrolledForm from './uncontrolledForm';

const fillValidUncontrolledForm = async (
  user: ReturnType<typeof userEvent.setup>,
  country = 'Uzbekistan'
): Promise<void> => {
  await user.type(screen.getByLabelText(/^name$/i), 'Fayzullo');
  await user.type(screen.getByLabelText(/^age$/i), '20');
  await user.type(screen.getByLabelText(/^email$/i), 'fayzullo@example.com');
  await user.selectOptions(screen.getByLabelText(/^gender$/i), 'male');
  await uploadValidImage(user);
  await user.type(screen.getByLabelText(/^password$/i), 'Password1!');
  await user.type(screen.getByLabelText(/confirm password/i), 'Password1!');
  await user.type(screen.getByLabelText(/^country$/i), country);
  await user.click(screen.getByLabelText(/i accept terms and conditions/i));
};

const createTestStore = () =>
  configureStore({
    reducer: {
      forms: formsReducer,
    },
  });

const renderUncontrolledForm = () => {
  const store = createTestStore();
  const handleSuccess = vi.fn();

  render(
    <Provider store={store}>
      <UncontrolledForm onSuccess={handleSuccess} />
    </Provider>
  );

  return {
    store,
    handleSuccess,
  };
};

const validImage = new File(['image-content'], 'avatar.png', {
  type: 'image/png',
});

const uploadValidImage = async (
  user: ReturnType<typeof userEvent.setup>
): Promise<void> => {
  const imageInput = screen.getByLabelText(
    /profile image/i
  ) as HTMLInputElement;

  await user.upload(imageInput, validImage);

  Object.defineProperty(imageInput, 'files', {
    value: [validImage],
    configurable: true,
  });
};

describe('UncontrolledForm', () => {
  test('renders all required fields with labels', () => {
    renderUncontrolledForm();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/i accept terms and conditions/i)
    ).toBeInTheDocument();
  });

  test('shows validation errors only after submit', async () => {
    const user = userEvent.setup();

    renderUncontrolledForm();

    expect(
      screen.queryByText(/name must start with an uppercase letter/i)
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /submit uncontrolled form/i })
    );

    expect(
      await screen.findByText(/^Name is required\.$/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/^Age is required\.$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Email is required\.$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Gender is required\.$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Image is required\.$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Password is required\.$/i)).toBeInTheDocument();
    expect(
      screen.getByText(/^Confirm password is required\.$/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/^Country is required\.$/i)).toBeInTheDocument();
    expect(
      screen.getByText(/^You must accept Terms and Conditions\.$/i)
    ).toBeInTheDocument();
  });

  test('shows password strength while typing password', async () => {
    const user = userEvent.setup();

    renderUncontrolledForm();

    await user.type(screen.getByLabelText(/^password$/i), 'Password1!');

    expect(screen.getByText(/password strength: 4\/4/i)).toBeInTheDocument();
  });

  test('submits valid data to store and calls success callback', async () => {
    const user = userEvent.setup();
    const { store, handleSuccess } = renderUncontrolledForm();

    await fillValidUncontrolledForm(user);

    await user.click(
      screen.getByRole('button', { name: /submit uncontrolled form/i })
    );

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
      source: 'uncontrolled',
    });

    expect(state.forms.submissions[0].imageBase64).toContain('base64');
  });

  test('shows validation error for invalid country', async () => {
    const user = userEvent.setup();

    renderUncontrolledForm();

    await fillValidUncontrolledForm(user, 'InvalidCountry');

    await user.click(
      screen.getByRole('button', { name: /submit uncontrolled form/i })
    );

    expect(
      await screen.findByText(/country must be selected from the list/i)
    ).toBeInTheDocument();
  });
});
