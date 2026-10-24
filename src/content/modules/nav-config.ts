/** Shared sidebar & OPR hub navigation — keep in sync */
export const DIRECTORATE_NAV = [
  { moduleId: "operations", label: "اجرایه" },
  { moduleId: "archive", label: "آرشیف" },
] as const;

export const DEPARTMENT_NAV = [
  { moduleId: "mali", label: "مالی" },
  { moduleId: "control", label: "کنترول" },
  { moduleId: "sales", label: "فروشات" },
  { moduleId: "storage", label: "تحویلخانه" },
  { moduleId: "items", label: "محاسبه اجناس" },
  { moduleId: "procurement", label: "تدارکات" },
  { moduleId: "hr", label: "منابع بشری" },
  { moduleId: "salaries", label: "معاشات" },
  { moduleId: "planning", label: "پلان و پالیسی" },
  { moduleId: "balance", label: "بیلانس" },
  { moduleId: "properties", label: "جایداد ها" },
  { moduleId: "site", label: "سایت / معدن" },
] as const;
