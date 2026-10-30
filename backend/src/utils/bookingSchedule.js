export const timeToMinutes = (value) => {
  if (typeof value !== 'string') return null;
  const time = value.trim();
  const twelveHour = time.match(/^(1[0-2]|0?[1-9]):([0-5]\d)\s*(AM|PM)$/i);
  if (twelveHour) {
    let hours = Number(twelveHour[1]) % 12;
    if (twelveHour[3].toUpperCase() === 'PM') hours += 12;
    return hours * 60 + Number(twelveHour[2]);
  }
  const twentyFourHour = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!twentyFourHour) return null;
  return Number(twentyFourHour[1]) * 60 + Number(twentyFourHour[2]);
};

const isUnassignedArtist = (artist) => {
  const value = typeof artist === 'string' ? artist.trim().toLowerCase() : '';
  return !value || value === 'unassigned' || value === 'any senior specialist' || value === 'any stylist';
};

export const hasScheduleConflict = (appointments, candidate, ignoreId = null) => {
  const candidateDate = String(candidate.date || '').slice(0, 10);
  const candidateStart = timeToMinutes(candidate.time || candidate.timeSlot);
  if (!candidateDate || candidateStart === null) return false;
  const candidateDuration = Math.max(1, Number(candidate.duration) || 60);
  const candidateEnd = candidateStart + candidateDuration;

  return appointments.some((appointment) => {
    if (appointment.status === 'Cancelled') return false;
    if (ignoreId && [appointment.id, appointment._id?.toString()].includes(ignoreId)) return false;
    if (String(appointment.date || '').slice(0, 10) !== candidateDate) return false;

    const sameArtist = isUnassignedArtist(candidate.artist)
      || isUnassignedArtist(appointment.artist)
      || candidate.artist.trim().toLowerCase() === appointment.artist.trim().toLowerCase();
    if (!sameArtist) return false;
    const existingStart = timeToMinutes(appointment.time || appointment.timeSlot);
    if (existingStart === null) return true;
    const existingEnd = existingStart + Math.max(1, Number(appointment.duration) || 60);
    return candidateStart < existingEnd && existingStart < candidateEnd;
  });
};
