'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (dates: string) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

interface SelectedDate {
  start: Date | null;
  end: Date | null;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateRange(start: Date | null, end: Date | null): string {
  if (!start) return '';
  
  const formatDate = (date: Date) => {
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return { month, day, year };
  };

  const startFormatted = formatDate(start);
  
  if (!end || start.getTime() === end.getTime()) {
    return `${startFormatted.month} ${startFormatted.day}, ${startFormatted.year}`;
  }

  const endFormatted = formatDate(end);
  
  if (startFormatted.year === endFormatted.year) {
    if (startFormatted.month === endFormatted.month) {
      return `${startFormatted.month} ${startFormatted.day}–${endFormatted.day}, ${startFormatted.year}`;
    }
    return `${startFormatted.month} ${startFormatted.day} – ${endFormatted.month} ${endFormatted.day}, ${startFormatted.year}`;
  }
  
  return `${startFormatted.month} ${startFormatted.day}, ${startFormatted.year} – ${endFormatted.month} ${endFormatted.day}, ${endFormatted.year}`;
}

function parseDateString(dateString: string): SelectedDate {
  if (!dateString) return { start: null, end: null };
  
  // Try to parse various formats like "October 12–15, 2026" or "October 12, 2026"
  const rangeMatch = dateString.match(/(\w+)\s+(\d+)[–-](\d+),?\s*(\d{4})/);
  if (rangeMatch) {
    const month = MONTHS.indexOf(rangeMatch[1]);
    if (month !== -1) {
      const startDay = parseInt(rangeMatch[2]);
      const endDay = parseInt(rangeMatch[3]);
      const year = parseInt(rangeMatch[4]);
      return {
        start: new Date(year, month, startDay),
        end: new Date(year, month, endDay)
      };
    }
  }
  
  // Try single date format "October 12, 2026"
  const singleMatch = dateString.match(/(\w+)\s+(\d+),?\s*(\d{4})/);
  if (singleMatch) {
    const month = MONTHS.indexOf(singleMatch[1]);
    if (month !== -1) {
      const day = parseInt(singleMatch[2]);
      const year = parseInt(singleMatch[3]);
      const date = new Date(year, month, day);
      return { start: date, end: date };
    }
  }
  
  return { start: null, end: null };
}

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select dates...',
  helperText,
  required,
  className = '',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<SelectedDate>(() => parseDateString(value));
  const [selectingEnd, setSelectingEnd] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update selected dates when value prop changes
  useEffect(() => {
    setSelectedDates(parseDateString(value));
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first day
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    if (!selectingEnd || !selectedDates.start) {
      // Starting a new selection
      setSelectedDates({ start: date, end: null });
      setSelectingEnd(true);
    } else {
      // Completing the selection
      let start = selectedDates.start;
      let end = date;
      
      // Ensure start is before end
      if (date < start) {
        [start, end] = [end, start];
      }
      
      setSelectedDates({ start, end });
      setSelectingEnd(false);
      onChange(formatDateRange(start, end));
      setIsOpen(false);
    }
  };

  const isSelected = (date: Date) => {
    if (!selectedDates.start) return false;
    if (!selectedDates.end) {
      return date.getTime() === selectedDates.start.getTime();
    }
    return date >= selectedDates.start && date <= selectedDates.end;
  };

  const isStartDate = (date: Date) => {
    return selectedDates.start && date.getTime() === selectedDates.start.getTime();
  };

  const isEndDate = (date: Date) => {
    return selectedDates.end && date.getTime() === selectedDates.end.getTime();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const clearSelection = () => {
    setSelectedDates({ start: null, end: null });
    setSelectingEnd(false);
    onChange('');
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 transition-colors"
      >
        <Calendar size={18} className="text-gray-400" />
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className="ml-auto p-1 hover:bg-gray-100 rounded"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>

      {helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <div key={index} className="aspect-square">
                {date ? (
                  <button
                    type="button"
                    onClick={() => handleDateClick(date)}
                    className={`w-full h-full flex items-center justify-center text-sm rounded-lg transition-colors ${
                      isSelected(date)
                        ? isStartDate(date) || isEndDate(date)
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-100 text-primary-800'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {selectingEnd 
                ? 'Click to select end date (or same date for single day)'
                : 'Click to select start date'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
