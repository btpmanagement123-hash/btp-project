export const getCurrentSemester = () => {
  const month = new Date().getMonth() + 1;
  return month >= 7 ? 'odd' : 'even';
};
