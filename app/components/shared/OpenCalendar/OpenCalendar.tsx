import React from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from '~/utils/date/dayjs';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface OpenCalendarProps {
  allowedDates: Dayjs[];
  selectedDate: Dayjs;
  onDateChange: (date: Dayjs) => void;
}

function getMonthDisabledDates(allowedDates: Dayjs[], currentMonth: Dayjs) {
  const allowedSet = new Set(allowedDates.map(d => d.format('YYYY-MM-DD')));
  const daysInMonth = currentMonth.daysInMonth();
  const disabled: Date[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = currentMonth.date(d);
    if (!allowedSet.has(date.format('YYYY-MM-DD')))
      disabled.push(date.toDate());
  }
  return disabled;
}

const OpenCalendar: React.FC<OpenCalendarProps> = ({ allowedDates, selectedDate, onDateChange }) => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const currentMonth = selectedDate.startOf('month');
  const disabledDates = React.useMemo(() => getMonthDisabledDates(allowedDates, currentMonth), [allowedDates, currentMonth]);
  const allowedSet = React.useMemo(() => new Set(allowedDates.map(d => d.format('YYYY-MM-DD'))), [allowedDates]);

  return (
    <Box sx={{ minWidth: 350, m: 'auto', fontFamily: 'inherit', borderRadius: '10px', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)', bgcolor: 'background.paper', border: '1px solid #e0e0e0', overflow: 'hidden', p: 0 }}>
      <Calendar
        value={selectedDate?.toDate()}
        onChange={e => {
          if (e.value && allowedSet.has(dayjs(e.value).format('YYYY-MM-DD'))) {
            onDateChange(dayjs(e.value));
          }
        }}
        inline
        dateTemplate={(dateObj) => {
          const date = dayjs(new Date(dateObj.year, dateObj.month, dateObj.day));
          const dateStr = date.format('YYYY-MM-DD');
          const isAllowed = allowedSet.has(dateStr);
          return (
            <Typography variant="caption" style={{ color: isAllowed ? undefined : '#bbb', cursor: isAllowed ? 'pointer' : 'not-allowed', fontWeight: 500, fontSize: '0.8125rem', fontFamily: 'inherit' }}>
              {dateObj.day}
            </Typography>
          );
        }}
        disabledDates={disabledDates}
        showIcon={false}
        showTime={false}
        showSeconds={false}
        readOnlyInput
        style={{ width: '100%' }}
        pt={{
          root: { style: { width: '100%' } },
        }}
      />
      <style>{`
        .p-datepicker {
          font-family: inherit !important;
          border-radius: 10px !important;
          box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10) !important;
          border: 1px solid #e0e0e0 !important;
          overflow: hidden !important;
        }
        .p-datepicker-header {
          padding: 0.5rem 1rem !important;
          background: #fafbfc !important;
          border-bottom: 1px solid #f0f0f0 !important;
        }
        .p-datepicker-title {
          font-size: 1rem !important;
          font-weight: 500 !important;
          color: #222 !important;
        }
        .p-datepicker-prev, .p-datepicker-next {
          width: 2rem !important;
          height: 2rem !important;
          color: ${primaryColor} !important;
        }
        .p-datepicker-prev:hover, .p-datepicker-next:hover {
          background: ${primaryColor}14 !important;
        }
        .p-datepicker-calendar th {
          font-size: 0.75rem !important;
          font-weight: 500 !important;
          color: rgba(0,0,0,0.6) !important;
        }
        .p-datepicker-calendar td > span, .p-datepicker-calendar td > .MuiTypography-root {
          font-size: 0.8125rem !important;
          width: 2rem !important;
          height: 2rem !important;
          border-radius: 6px !important;
          font-weight: 500 !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .p-highlight {
          background: ${primaryColor} !important;
          color: white !important;
        }
        .p-datepicker-today > span, .p-datepicker-today > .MuiTypography-root {
          border-color: ${primaryColor} !important;
        }
        .p-datepicker-header button {
          color: ${primaryColor} !important;
        }
        .p-datepicker-header button:hover {
          background: ${primaryColor}14 !important;
        }
        @media (min-width: 600px) {
          .p-datepicker-calendar td > span,
          .p-datepicker-calendar td > .MuiTypography-root,
          .p-datepicker-title {
            font-size: 0.875rem !important;
          }
        }
        @media (min-width: 900px) {
          .p-datepicker-calendar td > span,
          .p-datepicker-calendar td > .MuiTypography-root,
          .p-datepicker-title {
            font-size: 0.875rem !important;
          }
        }
        /* Remove default hover effect for non-selected, non-disabled dates */
        .p-datepicker:not(.p-disabled) table td span:not(.p-highlight):not(.p-disabled):hover {
          background: none !important;
        }
      `}</style>
    </Box>
  );
};

export default OpenCalendar;    