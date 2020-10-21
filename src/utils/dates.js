export function getDate() {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const hrs = dateObj.getHours();
  const mins = dateObj.getMinutes();
  const secs = dateObj.getSeconds();
  const hrsFix = hrs < 10 ? `0${hrs}` : hrs;
  const minsFix = mins < 10 ? `0${mins}` : mins;
  const secsFix = secs < 10 ? `0${secs}` : secs;
  return `${year}-${month}-${day} ${hrsFix}:${minsFix}:${secsFix}`;
  // return `${year}-${month}-${day}`;
}
