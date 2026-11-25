// @vitest-environment jsdom
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from '@/App';

afterEach(cleanup);

const roomSelect = () => screen.getByLabelText('Select room') as HTMLSelectElement;
const setTime = (label: RegExp, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const setDuration = (value: string) =>
  fireEvent.change(screen.getByLabelText(/^duration \(minutes\)$/i), { target: { value } });
const check = () => fireEvent.click(screen.getByRole('button', { name: /check availability/i }));

describe('UI behavior (integration)', () => {
  test('U1 F4: impossible requirements show an empty state and disable the check', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '500' } });
    expect(screen.getByText(/no rooms match your requirements/i)).toBeTruthy();
    expect(screen.queryByLabelText('Select room')).toBeNull();
    const button = screen.getByRole('button', { name: /check availability/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  test('U2 F1+F2: filters reduce the room list', () => {
    render(<App />);
    const all = roomSelect().options.length;
    expect(all).toBeGreaterThanOrEqual(4);
    fireEvent.click(screen.getByLabelText('microphone'));
    expect(roomSelect().options.length).toBe(1);
    expect(roomSelect().options[0].textContent).toContain('Auditorium');
  });

  test('U3 F5: switching the room clears the old result and uses the new room bookings', () => {
    render(<App />);
    // Room A (default) has a booking 10:00-11:00; current time is fixed at 09:00
    setTime(/^start \(hh:mm\)$/i, '10:15');
    setDuration('30');
    check();
    expect(screen.getByText('Unavailable')).toBeTruthy();

    fireEvent.change(roomSelect(), { target: { value: 'room-b' } }); // Room B has no bookings
    expect(screen.queryByText('Unavailable')).toBeNull();
    expect(screen.queryByText('Available')).toBeNull();

    check();
    expect(screen.getByText('Available')).toBeTruthy();
  });

  test('U4 F3: a blocked room is reported as unavailable in the UI', () => {
    render(<App />);
    fireEvent.change(roomSelect(), { target: { value: 'room-c' } });
    setTime(/^start \(hh:mm\)$/i, '10:00');
    setDuration('60');
    check();
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByText(/blocked/i, { selector: 'p.text-red-700' })).toBeTruthy();
  });

  test('R1 AC1: a start time before the fixed current time (09:00) is rejected even when the current time field is changed', () => {
    render(<App />);
    setTime(/^current time \(hh:mm\)$/i, '07:00');
    setTime(/^start \(hh:mm\)$/i, '08:00');
    setDuration('30');
    check();
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByText(/after the current time \(09:00\)/i)).toBeTruthy();
  });

  test('R2: a pending explanation never attaches to a newer result', async () => {
    vi.useFakeTimers();
    try {
      render(<App />);
      fireEvent.change(roomSelect(), { target: { value: 'room-a' } });
      setTime(/^start \(hh:mm\)$/i, '12:00');
      setDuration('60');
      check();
      expect(screen.getByText('Available')).toBeTruthy();

      fireEvent.change(screen.getByLabelText('Mock mode'), {
        target: { value: 'timeout' },
      });
      fireEvent.click(screen.getByRole('button', { name: /explain availability/i }));

      // While the explanation is still pending, switch to Room C (blocked)
      // and run a new check; changing the room clears result and explanation.
      fireEvent.change(roomSelect(), { target: { value: 'room-c' } });
      check();
      expect(screen.getByText('Unavailable')).toBeTruthy();

      // Past the 3s explainer timeout: the stale Room A fallback must not appear.
      await vi.advanceTimersByTimeAsync(3500);

      expect(screen.getByText('Unavailable')).toBeTruthy();
      expect(screen.queryByText(/Room A — Study Hall is available/)).toBeNull();
      expect(screen.queryByText('Standard explanation')).toBeNull();

      // The spinner must not be stuck: the Explain button is usable again.
      const explainButton = screen.getByRole('button', { name: /explain availability/i });
      expect((explainButton as HTMLButtonElement).disabled).toBe(false);

      // A fresh explanation can be produced for the current (Room C) result.
      fireEvent.change(screen.getByLabelText('Mock mode'), { target: { value: 'ok' } });
      fireEvent.click(explainButton);
      await vi.advanceTimersByTimeAsync(0);
      const explanationBox = screen.getByText(/AI-generated explanation \(mock\)/);
      expect(explanationBox).toBeTruthy();
      expect(screen.getByText(/Room C — Auditorium is not available/)).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });
});
