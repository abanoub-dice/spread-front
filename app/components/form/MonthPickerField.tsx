import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Calendar } from 'primereact/calendar';
import dayjs from '~/utils/date/dayjs';
import { IoCalendarOutline } from 'react-icons/io5';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface MonthPickerFieldProps {
  label?: string;
  name: string;
  value: dayjs.Dayjs | null;
  onChange: (date: dayjs.Dayjs | null) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  disabled?: boolean;
  defaultValue?: dayjs.Dayjs;
}

export const MonthPickerField: React.FC<MonthPickerFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  minDate,
  maxDate,
  disabled = false,
  defaultValue,
}) => {
  const [tempValue, setTempValue] = useState<Date | null>(
    value?.toDate() || defaultValue?.toDate() || null
  );
  const [validationError, setValidationError] = useState<string | undefined>(error);
  const calendarRef = useRef<any>(null);

  const validateDate = (date: Date | null): boolean => {
    if (!date) return false;

    const selectedDate = dayjs(date);

    if (minDate && selectedDate.isBefore(minDate, 'month')) {
      setValidationError(`Month must be after ${minDate.format('MMMM YYYY')}`);
      return false;
    }

    if (maxDate && selectedDate.isAfter(maxDate, 'month')) {
      setValidationError(`Month must be before ${maxDate.format('MMMM YYYY')}`);
      return false;
    }

    setValidationError(undefined);
    return true;
  };

  const handleChange = (e: any) => {
    const newDate = e.value as Date | null;
    setTempValue(newDate);
    
    if (newDate && validateDate(newDate)) {
      // Set to first day of the month and immediately call onChange
      const selectedMonth = dayjs(newDate).startOf('month');
      onChange(selectedMonth);
    } else {
      onChange(null);
    }
  };

  useEffect(() => {
    setValidationError(error);
  }, [error]);

  useEffect(() => {
    // Update tempValue when value prop changes
    setTempValue(value?.toDate() || null);
  }, [value]);

  return (
    <Box>
      <Typography variant="subHeader" sx={{ ml: 1 }}>
        {label}
        {required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
      <Box sx={{ mt: 1, position: 'relative' }}>
        <Calendar
          ref={calendarRef}
          value={tempValue}
          onChange={handleChange}
          view="month"
          dateFormat="MM/yy"
          showTime={false}
          minDate={minDate?.toDate()}
          maxDate={maxDate?.toDate()}
          placeholder={placeholder}
          className={validationError ? 'p-invalid' : ''}
          style={{ width: '100%' }}
          disabled={disabled}
          inputStyle={{
            width: '100%',
            padding: '11px 16px',
            paddingRight: '40px',
            borderRadius: '4px',
            fontSize: '0.8125rem',
            border: validationError ? '1px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
            fontFamily: 'inherit',
          }}
          panelClassName="custom-month-panel"
        />
        <IoCalendarOutline
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: '18px',
            pointerEvents: 'none',
          }}
        />
      </Box>
      {validationError && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
          {validationError}
        </Typography>
      )}
      <style>
        {`
          .custom-month-panel {
            font-family: inherit !important;
            z-index: 9999 !important;
          }
          .custom-month-panel .p-datepicker-header {
            padding: 0.5rem !important;
          }
          .custom-month-panel .p-datepicker-title {
            font-size: 0.875rem !important;
            font-weight: 500 !important;
          }
          .custom-month-panel .p-datepicker-prev,
          .custom-month-panel .p-datepicker-next {
            width: 2rem !important;
            height: 2rem !important;
          }
          .custom-month-panel .p-monthpicker {
            padding: 0.5rem !important;
          }
          .custom-month-panel .p-monthpicker .p-monthpicker-month {
            font-size: 0.8125rem !important;
            padding: 0.5rem !important;
            border-radius: 4px !important;
          }
          .custom-month-panel .p-monthpicker .p-monthpicker-month:hover {
            background: rgba(0, 0, 0, 0.04) !important;
          }
          .custom-month-panel .p-monthpicker .p-monthpicker-month.p-highlight {
            background: #d32f2f !important;
            color: white !important;
          }
          .custom-month-panel .p-monthpicker .p-monthpicker-month.p-highlight:hover {
            background: #b71c1c !important;
          }
          .custom-month-panel .p-yearpicker {
            padding: 0.5rem !important;
          }
          .custom-month-panel .p-yearpicker .p-yearpicker-year {
            font-size: 0.8125rem !important;
            padding: 0.5rem !important;
            border-radius: 4px !important;
          }
          .custom-month-panel .p-yearpicker .p-yearpicker-year:hover {
            background: rgba(0, 0, 0, 0.04) !important;
          }
          .custom-month-panel .p-yearpicker .p-yearpicker-year.p-highlight {
            background: #d32f2f !important;
            color: white !important;
          }
          .custom-month-panel .p-yearpicker .p-yearpicker-year.p-highlight:hover {
            background: #b71c1c !important;
          }
          .custom-month-panel .p-datepicker-header button {
            color: #d32f2f !important;
          }
          .custom-month-panel .p-datepicker-header button:hover {
            background: rgba(211, 47, 47, 0.04) !important;
          }

          @media (min-width: 600px) {
            .custom-month-panel .p-monthpicker .p-monthpicker-month,
            .custom-month-panel .p-yearpicker .p-yearpicker-year,
            .custom-month-panel .p-datepicker-title {
              font-size: 0.875rem !important;
            }
          }

          @media (min-width: 900px) {
            .custom-month-panel .p-monthpicker .p-monthpicker-month,
            .custom-month-panel .p-yearpicker .p-yearpicker-year,
            .custom-month-panel .p-datepicker-title {
              font-size: 0.875rem !important;
            }
          }
        `}
      </style>
    </Box>
  );
}; 