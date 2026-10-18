"use client";

import { useRef } from "react";
import { Printer } from "lucide-react";

const SAMPLE = {
  attendance_id: "ATT-1405/03",
  title: "حاضری ماه حوت 1405",
  hijri_year: "1405",
  hijri_month: "03",
  date_from: "1405/03/01",
  date_to: "1405/03/30",
  lines: [
    {
      no: 1,
      employee: "EMP-0045 — Mohammad بن رحیم",
      department: "Operations",
      days_present: 20,
      days_absent: 1,
      leave_required: 2,
      holiday_leave: 2,
      makul: 0,
      khademati: 1,
    },
    {
      no: 2,
      employee: "EMP-0048 — Fatima بن احمد",
      department: "HR",
      days_present: 22,
      days_absent: 0,
      leave_required: 0,
      holiday_leave: 2,
      makul: 0,
      khademati: 0,
    },
    {
      no: 3,
      employee: "EMP-0051 — Karim بن نور",
      department: "Commercial",
      days_present: 19,
      days_absent: 2,
      leave_required: 1,
      holiday_leave: 2,
      makul: 1,
      khademati: 0,
    },
    {
      no: 4,
      employee: "EMP-0055 — Hassan بن علی",
      department: "Operations",
      days_present: 21,
      days_absent: 1,
      leave_required: 0,
      holiday_leave: 2,
      makul: 0,
      khademati: 1,
    },
    {
      no: 5,
      employee: "EMP-0060 — Zainab بن کریم",
      department: "Finance",
      days_present: 20,
      days_absent: 0,
      leave_required: 3,
      holiday_leave: 2,
      makul: 0,
      khademati: 0,
    },
  ],
};

function totals(lines: typeof SAMPLE.lines) {
  return lines.reduce(
    (acc, l) => ({
      days_present: acc.days_present + l.days_present,
      days_absent: acc.days_absent + l.days_absent,
      leave_required: acc.leave_required + l.leave_required,
      holiday_leave: acc.holiday_leave + l.holiday_leave,
      makul: acc.makul + l.makul,
      khademati: acc.khademati + l.khademati,
    }),
    {
      days_present: 0,
      days_absent: 0,
      leave_required: 0,
      holiday_leave: 0,
      makul: 0,
      khademati: 0,
    },
  );
}

const PRINT_STYLES = `
  @page { size: A4 landscape; margin: 10mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 10px; color: #111; margin: 0; }
  .doc { width: 100%; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
  .org { font-size: 14px; font-weight: 700; }
  .org-dari { font-size: 13px; margin-top: 2px; }
  .meta { text-align: left; font-size: 10px; line-height: 1.5; }
  .title { text-align: center; font-size: 13px; font-weight: 700; margin: 10px 0 4px; }
  .title-dari { text-align: center; font-size: 12px; margin-bottom: 10px; }
  .period { text-align: center; font-size: 10px; margin-bottom: 12px; color: #333; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #333; padding: 4px 6px; text-align: center; }
  th { background: #f0f0f0; font-weight: 600; font-size: 9px; }
  td.name { text-align: right; font-size: 9px; }
  td.dept { text-align: right; font-size: 9px; color: #444; }
  tfoot td { font-weight: 700; background: #f5f5f5; }
  .signatures { display: flex; justify-content: space-between; margin-top: 28px; gap: 16px; }
  .sig { flex: 1; text-align: center; }
  .sig-line { border-top: 1px solid #111; margin-top: 36px; padding-top: 4px; font-size: 9px; }
  .sig-role { font-size: 8px; color: #555; margin-top: 2px; }
  .footer { margin-top: 12px; font-size: 8px; color: #666; text-align: center; }
`;

function AttendanceDocument({ data }: { data: typeof SAMPLE }) {
  const t = totals(data.lines);

  return (
    <div className="doc">
      <div className="header">
        <div>
          <div className="org">ENCC</div>
          <div className="org-dari">شرکت استخراج و فرآوری زغال سنگ شمال افغانستان</div>
          <div style={{ fontSize: "9px", color: "#555", marginTop: "4px" }}>
            منابع بشری — Human Resources
          </div>
        </div>
        <div className="meta">
          <div>
            <strong>شناسه / ID:</strong> {data.attendance_id}
          </div>
          <div>
            <strong>سال / Year:</strong> {data.hijri_year}
          </div>
          <div>
            <strong>ماه / Month:</strong> {data.hijri_month}
          </div>
        </div>
      </div>

      <div className="title">{data.title}</div>
      <div className="title-dari">Monthly Attendance Register — Permanent Employees</div>
      <div className="period">
        از تاریخ / From: {data.date_from} &nbsp;|&nbsp; تا تاریخ / To: {data.date_to}
      </div>

      <table>
        <thead>
          <tr>
            <th rowSpan={2}>#</th>
            <th rowSpan={2}>کارمند / Employee</th>
            <th rowSpan={2}>ریاست / Dept</th>
            <th colSpan={6}>روزها / Days</th>
          </tr>
          <tr>
            <th>حاضر<br />Present</th>
            <th>غیرحاضر<br />Absent</th>
            <th>رخصتی مورد نیاز<br />Leave Req.</th>
            <th>رخصتی تعطیلات<br />Holiday</th>
            <th>مکول<br />Makul</th>
            <th>خدمتی<br />Khademati</th>
          </tr>
        </thead>
        <tbody>
          {data.lines.map((row) => (
            <tr key={row.no}>
              <td>{row.no}</td>
              <td className="name">{row.employee}</td>
              <td className="dept">{row.department}</td>
              <td>{row.days_present}</td>
              <td>{row.days_absent}</td>
              <td>{row.leave_required}</td>
              <td>{row.holiday_leave}</td>
              <td>{row.makul}</td>
              <td>{row.khademati}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>مجموع / Totals ({data.lines.length} employees)</td>
            <td>{t.days_present}</td>
            <td>{t.days_absent}</td>
            <td>{t.leave_required}</td>
            <td>{t.holiday_leave}</td>
            <td>{t.makul}</td>
            <td>{t.khademati}</td>
          </tr>
        </tfoot>
      </table>

      <div className="signatures">
        <div className="sig">
          <div className="sig-line">امضاء — Signature</div>
          <div className="sig-role">تهیه کننده / Prepared by — HR Clerk</div>
          <div className="sig-role">تاریخ / Date: _______________</div>
        </div>
        <div className="sig">
          <div className="sig-line">امضاء — Signature</div>
          <div className="sig-role">مدیر منابع بشری / HR Manager</div>
          <div className="sig-role">تاریخ / Date: _______________</div>
        </div>
        <div className="sig">
          <div className="sig-line">مهر و امضاء — Stamp & Signature</div>
          <div className="sig-role">مهر و امضاء — Stamp & Signature / ENCC</div>
          <div className="sig-role">تاریخ / Date: _______________</div>
        </div>
      </div>

      <div className="footer">
        Generated from ENCC ERP — حاضری کارمندان دائمی | Print anytime — sign on paper
      </div>
    </div>
  );
}

export function EmployeeAttendancePrintDemo() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;

    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;

    w.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="utf-8" />
  <title>${SAMPLE.title} — ENCC Attendance</title>
  <style>${PRINT_STYLES}</style>
</head>
<body>${content}</body>
</html>`);
    w.document.close();
    w.focus();
    w.onload = () => {
      w.print();
    };
  };

  return (
    <div className="space-y-4 no-print-root">
      <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
        <strong>Printable sample</strong> — print anytime (draft or approved). One PDF: header,
        employees, totals, sign-off blocks. No approval required to print.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
        <span className="text-xs text-slate-500">
          Opens print dialog — choose &quot;Save as PDF&quot; to download
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div ref={printRef} className="attendance-print-preview mx-auto max-w-5xl text-[10px] text-slate-900">
          <AttendanceDocument data={SAMPLE} />
        </div>
      </div>

      <style jsx global>{`
        .attendance-print-preview .doc {
          width: 100%;
        }
        .attendance-print-preview .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .attendance-print-preview .org {
          font-size: 14px;
          font-weight: 700;
        }
        .attendance-print-preview .org-dari {
          font-size: 13px;
          margin-top: 2px;
        }
        .attendance-print-preview .meta {
          text-align: left;
          font-size: 10px;
          line-height: 1.5;
        }
        .attendance-print-preview .title {
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          margin: 10px 0 4px;
        }
        .attendance-print-preview .title-dari {
          text-align: center;
          font-size: 12px;
          margin-bottom: 10px;
        }
        .attendance-print-preview .period {
          text-align: center;
          font-size: 10px;
          margin-bottom: 12px;
          color: #475569;
        }
        .attendance-print-preview table {
          width: 100%;
          border-collapse: collapse;
        }
        .attendance-print-preview th,
        .attendance-print-preview td {
          border: 1px solid #334155;
          padding: 4px 6px;
          text-align: center;
        }
        .attendance-print-preview th {
          background: #f1f5f9;
          font-weight: 600;
          font-size: 9px;
        }
        .attendance-print-preview td.name,
        .attendance-print-preview td.dept {
          text-align: right;
          font-size: 9px;
        }
        .attendance-print-preview tfoot td {
          font-weight: 700;
          background: #f8fafc;
        }
        .attendance-print-preview .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 28px;
          gap: 16px;
        }
        .attendance-print-preview .sig {
          flex: 1;
          text-align: center;
        }
        .attendance-print-preview .sig-line {
          border-top: 1px solid #0f172a;
          margin-top: 36px;
          padding-top: 4px;
          font-size: 9px;
        }
        .attendance-print-preview .sig-role {
          font-size: 8px;
          color: #64748b;
          margin-top: 2px;
        }
        .attendance-print-preview .footer {
          margin-top: 12px;
          font-size: 8px;
          color: #94a3b8;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
