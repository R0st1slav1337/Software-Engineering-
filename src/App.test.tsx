// @vitest-environment jsdom
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from '@/App';

afterEach(cleanup);

const roomSelect = () => screen.getByLabelText('Select room') as HTMLSelectElement;
const setTime = (label: RegExp, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
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
    setTime(/^end \(hh:mm\)$/i, '10:45');
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
    setTime(/^end \(hh:mm\)$/i, '11:00');
    check();
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByText(/blocked/i, { selector: 'p.text-red-700' })).toBeTruthy();
  });
});
