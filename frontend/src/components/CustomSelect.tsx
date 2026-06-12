import { useState, useRef, useEffect } from 'react';

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export const CustomSelect = ({ value, options, onChange }: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (wrapRef.current && target instanceof globalThis.Node && !wrapRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapRef} className={`custom-select ${open ? 'custom-select--open' : ''}`}>
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="custom-select-value">{selected?.label}</span>
        <span className="custom-select-chevron" aria-hidden="true" />
      </button>
      {open && (
        <ul className="custom-select-menu" role="listbox">
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                className={`custom-select-option ${option.value === value ? 'custom-select-option--active' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
                {option.value === value && <span className="custom-select-check">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
