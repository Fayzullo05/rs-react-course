import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import Modal from './modal';

describe('Modal', () => {
  test('renders modal content through portal', () => {
    render(
      <Modal title="Test Modal" onClose={vi.fn()}>
        <button type="button">Focus content</button>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Focus content')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal title="Test Modal" onClose={handleClose}>
        <button type="button">Focus content</button>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /close modal/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('closes modal when Escape is pressed', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal title="Test Modal" onClose={handleClose}>
        <button type="button">Focus content</button>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('closes modal when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal title="Test Modal" onClose={handleClose}>
        <button type="button">Focus content</button>
      </Modal>
    );

    await user.click(screen.getByTestId('modal-backdrop'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('returns focus to trigger after modal unmounts', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open modal';
    document.body.append(trigger);
    trigger.focus();

    const { unmount } = render(
      <Modal title="Test Modal" onClose={vi.fn()}>
        <button type="button">Focus content</button>
      </Modal>
    );

    unmount();

    expect(trigger).toHaveFocus();

    trigger.remove();
  });
});
