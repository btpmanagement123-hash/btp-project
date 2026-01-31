export const getSemesterFromDates = (cfg) => {
  if (!cfg) return 'unknown';

  const { oddStart, oddEnd, evenStart, evenEnd } = cfg;
  if (!oddStart || !oddEnd || !evenStart || !evenEnd) {
    return 'unknown';
  }

  const now = new Date();

  const inRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return now >= s && now <= e;
  };

  if (inRange(oddStart, oddEnd)) return 'odd';
  if (inRange(evenStart, evenEnd)) return 'even';

  return 'vacation';
};
