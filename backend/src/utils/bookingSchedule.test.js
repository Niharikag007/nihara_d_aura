import test from 'node:test';
import assert from 'node:assert/strict';
import { hasScheduleConflict, timeToMinutes } from './bookingSchedule.js';

test('parses both 12-hour and 24-hour appointment times', () => {
  assert.equal(timeToMinutes('01:00 PM'), 780);
  assert.equal(timeToMinutes('00:30'), 30);
  assert.equal(timeToMinutes('13:00 PM'), null);
});

test('detects overlapping appointment durations for the same stylist', () => {
  const existing = [{
    id: 'existing',
    date: '2026-11-02',
    timeSlot: '10:00 AM',
    duration: 90,
    artist: 'Ananya Verma',
    status: 'Confirmed'
  }];
  assert.equal(hasScheduleConflict(existing, {
    date: '2026-11-02',
    time: '11:00',
    duration: 30,
    artist: 'Ananya Verma'
  }), true);
  assert.equal(hasScheduleConflict(existing, {
    date: '2026-11-02',
    time: '11:30',
    duration: 30,
    artist: 'Ananya Verma'
  }), false);
  assert.equal(hasScheduleConflict(existing, {
    date: '2026-11-02',
    time: '11:00',
    duration: 30,
    artist: 'Riya Sharma'
  }), false);
});

test('ignores cancelled and current appointments and reserves unassigned stylist slots', () => {
  const existing = [
    { id: 'cancelled', date: '2026-11-02', time: '10:00', duration: 60, artist: 'Any Senior Specialist', status: 'Cancelled' },
    { id: 'current', date: '2026-11-02', time: '10:00', duration: 60, artist: 'Ananya Verma', status: 'Confirmed' }
  ];
  assert.equal(hasScheduleConflict(existing, {
    date: '2026-11-02',
    time: '10:15',
    duration: 30,
    artist: 'Ananya Verma'
  }, 'current'), false);
  assert.equal(hasScheduleConflict(existing, {
    date: '2026-11-02',
    time: '10:15',
    duration: 30,
    artist: 'Any Senior Specialist'
  }), true);
});
