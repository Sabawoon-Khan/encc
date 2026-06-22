/** Solar Hijri (Shamsi) year — approximate; Naw-Ruz ≈ 21 March. */
export function currentSolarHijriYear(date = new Date()): number {
  const gYear = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  let year = gYear - 621;
  if (month < 2 || (month === 2 && day < 21)) year -= 1;
  return year;
}

/** ENCC rule: mali_year select lists current year ± span (default 5 → 11 years). */
export function maliYearOptions(span = 5, date = new Date()): number[] {
  const current = currentSolarHijriYear(date);
  const years: number[] = [];
  for (let y = current - span; y <= current + span; y += 1) {
    years.push(y);
  }
  return years;
}

export const MALI_YEAR_SELECT_SPAN = 5;
