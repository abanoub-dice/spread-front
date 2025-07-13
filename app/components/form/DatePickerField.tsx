import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Calendar } from 'primereact/calendar';
import dayjs from '~/utils/date/dayjs';
import { IoCalendarOutline } from 'react-icons/io5';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface DatePickerFieldProps {
  label: string;
  name: string;
  value: dayjs.Dayjs | null;
  onChange: (date: dayjs.Dayjs | null) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  previousDate?: dayjs.Dayjs | null;
  disabled?: boolean;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  minDate,
  maxDate,
  previousDate,
  disabled = false,
}) => {
  const [tempValue, setTempValue] = useState<Date | null>(value?.toDate() || null);
  const [validationError, setValidationError] = useState<string | undefined>(error);
  const calendarRef = useRef<any>(null);

  const validateDate = (date: Date | null): boolean => {
    if (!date) return false;

    const selectedDate = dayjs(date);

    if (minDate && selectedDate.isBefore(minDate, 'minute')) {
      setValidationError(`Date must be after ${minDate.format('MMM D, YYYY h:mm A')}`);
      return false;
    }

    if (maxDate && selectedDate.isAfter(maxDate, 'minute')) {
      setValidationError(`Date must be before ${maxDate.format('MMM D, YYYY h:mm A')}`);
      return false;
    }

    if (previousDate && selectedDate.isBefore(previousDate, 'minute')) {
      setValidationError(`Date must be after ${previousDate.format('MMM D, YYYY h:mm A')}`);
      return false;
    }

    setValidationError(undefined);
    return true;
  };

  const handleChange = (e: any) => {
    const newDate = e.value as Date | null;
    setTempValue(newDate);
    validateDate(newDate);
  };

  const handleConfirm = () => {
    if (tempValue && validateDate(tempValue)) {
      onChange(dayjs(tempValue));
    }

    if (calendarRef.current) {
      calendarRef.current.hide();
    }
  };

  useEffect(() => {
    setValidationError(error);
  }, [error]);

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
          showTime
          showSeconds={false}
          hourFormat="12"
          minDate={previousDate?.toDate() || minDate?.toDate()}
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
          panelClassName="custom-calendar-panel"
          footerTemplate={() => (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={!tempValue || !!validationError}
                sx={{
                  fontSize: '13px',
                  lineHeight: '20px',
                  fontWeight: 500,
                  borderRadius: '10px',
                  textTransform: 'none',
                  minWidth: '80px',
                }}
              >
                Confirm
              </Button>
            </Box>
          )}
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
          .custom-calendar-panel {
            font-family: inherit !important;
            z-index: 9999 !important;
          }
          .custom-calendar-panel .p-datepicker-header {
            padding: 0.5rem !important;
          }
          .custom-calendar-panel .p-datepicker-title {
            font-size: 0.875rem !important;
            font-weight: 500 !important;
          }
          .custom-calendar-panel .p-datepicker-prev,
          .custom-calendar-panel .p-datepicker-next {
            width: 2rem !important;
            height: 2rem !important;
          }
          .custom-calendar-panel .p-datepicker-calendar th {
            font-size: 0.75rem !important;
            font-weight: 500 !important;
            color: rgba(0, 0, 0, 0.6) !important;
          }
          .custom-calendar-panel .p-datepicker-calendar td > span {
            font-size: 0.8125rem !important;
            width: 2rem !important;
            height: 2rem !important;
          }
          .custom-calendar-panel .p-timepicker {
            padding: 0.5rem !important;
          }
          .custom-calendar-panel .p-timepicker span {
            font-size: 0.8125rem !important;
          }
          .custom-calendar-panel .p-timepicker button {
            width: 2rem !important;
            height: 2rem !important;
          }
          .custom-calendar-panel .p-timepicker-separator {
            font-size: 0.8125rem !important;
          }
          .custom-calendar-panel .p-timepicker-hour,
          .custom-calendar-panel .p-timepicker-minute {
            font-size: 0.8125rem !important;
          }
          .custom-calendar-panel .p-timepicker-ampm {
            font-size: 0.8125rem !important;
          }
          .custom-calendar-panel .p-button {
            font-size: 0.8125rem !important;
            padding: 0.5rem 1rem !important;
          }
          .custom-calendar-panel .p-button:enabled:hover {
            background: rgba(0, 0, 0, 0.04) !important;
          }
          .custom-calendar-panel .p-highlight {
            background: #d32f2f !important;
            color: white !important;
          }
          .custom-calendar-panel .p-highlight:hover {
            background: #b71c1c !important;
          }
          .custom-calendar-panel .p-datepicker-today > span {
            border-color: #d32f2f !important;
          }
          .custom-calendar-panel .p-datepicker-today > span.p-highlight {
            background: #d32f2f !important;
            color: white !important;
          }
          .custom-calendar-panel .p-datepicker-header button {
            color: #d32f2f !important;
          }
          .custom-calendar-panel .p-datepicker-header button:hover {
            background: rgba(211, 47, 47, 0.04) !important;
          }

          @media (min-width: 600px) {
            .custom-calendar-panel .p-datepicker-calendar td > span,
            .custom-calendar-panel .p-timepicker span,
            .custom-calendar-panel .p-timepicker-separator,
            .custom-calendar-panel .p-timepicker-hour,
            .custom-calendar-panel .p-timepicker-minute,
            .custom-calendar-panel .p-timepicker-ampm,
            .custom-calendar-panel .p-button,
            .custom-calendar-panel .p-datepicker-title {
              font-size: 0.875rem !important;
            }
          }

          @media (min-width: 900px) {
            .custom-calendar-panel .p-datepicker-calendar td > span,
            .custom-calendar-panel .p-timepicker span,
            .custom-calendar-panel .p-timepicker-separator,
            .custom-calendar-panel .p-timepicker-hour,
            .custom-calendar-panel .p-timepicker-minute,
            .custom-calendar-panel .p-timepicker-ampm,
            .custom-calendar-panel .p-button,
            .custom-calendar-panel .p-datepicker-title {
              font-size: 0.875rem !important;
            }
          }
        `}
      </style>
    </Box>
  );
};
