/**
 * Parses a LocalDateTime value which could be a JSON array [year, month, day, hour, minute, second]
 * from Spring Boot Jackson serialization, or a standard ISO date string.
 * 
 * @param {any} value The date value to parse.
 * @returns {Date|null} The parsed Date object, or null if invalid.
 */
export const parseLocalDateTime = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value;
    return new Date(year, month - 1, day, hour, minute, second);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Formats a LocalDateTime value to 'DD/MM/YYYY'.
 */
export const formatDateLabel = (value) => {
  const date = parseLocalDateTime(value);
  if (!date) return '';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * Formats a LocalDateTime value to 'HH:MM'.
 */
export const formatTimeLabel = (value) => {
  const date = parseLocalDateTime(value);
  if (!date) return '';
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formats a LocalDateTime value to 'HH:MM, DD/MM/YYYY'.
 */
export const formatDateTimeLabel = (value) => {
  const date = parseLocalDateTime(value);
  if (!date) return '';
  return `${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, ${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
};

/**
 * Builds a time range string 'HH:MM - HH:MM'.
 */
export const buildTimeRange = (startTime, endTime) => {
  const startLabel = formatTimeLabel(startTime);
  const endLabel = formatTimeLabel(endTime);
  if (!startLabel && !endLabel) return '';
  if (!endLabel) return startLabel;
  return `${startLabel} - ${endLabel}`;
};
