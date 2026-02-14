import { useState, useEffect, type ChangeEvent } from 'react';
import { formatCurrency, parseCurrency } from '../../../utils/format';

interface InputMoneyProps {
    label: string;
    value: number;
    onChange?: (value: number) => void;
    readOnly?: boolean;
    id: string;
    direction?: 'row' | 'col';
    className?: string;
    inputClassName?: string;
    variant?: 'default' | 'result' | 'highlight' | 'clean';
}

export function InputMoney({
    label,
    value,
    onChange,
    readOnly,
    id,
    direction = 'col',
    className = '',
    inputClassName = '',
    variant = 'default'
}: InputMoneyProps) {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        setDisplayValue(formatCurrency(value));
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (readOnly) return;

        let inputValue = e.target.value;

        // Allow user to type, but keep it somewhat sane
        // Remove R$ and whitespace
        const clean = inputValue.replace(/[^\d,]/g, '');
        // We could just pass the raw value to parsing if we want valid number updates
        // on every keystroke, but usually for currency it's better to update on blur
        // or handle masking.
        // Simple approach: parse and update parent.

        // Actually, with the formatting effect above, typing is hard because it resets cursor.
        // Better: update parent only on blur, or use a specific implementation.
        // Let's manually manage display value while editing.
        setDisplayValue(inputValue);
    };

    const handleBlur = () => {
        if (readOnly) return;
        const number = parseCurrency(displayValue);
        if (onChange) onChange(number);
        setDisplayValue(formatCurrency(number)); // Re-format to ensure standard look
    };

    const handleFocus = () => {
        if (!readOnly) {
            // Optional: clear formatting for easier editing?
            // Or just leave it. Let's leave it for now.
        }
    }

    const getVariantStyles = () => {
        if (variant === 'clean') {
            return '';
        }
        if (variant === 'result') {
            return 'bg-blue-50 text-blue-900 font-semibold border-blue-100';
        }
        if (variant === 'highlight') {
            return 'bg-emerald-50 text-emerald-900 font-bold border-emerald-200 text-lg';
        }
        return readOnly
            ? 'bg-slate-50 text-slate-900 font-semibold border-slate-200'
            : 'bg-white text-slate-900 border-slate-300 focus:ring-2 focus:ring-primary focus:ring-offset-2';
    };

    return (
        <div className={`flex ${direction === 'row' ? 'flex-row items-center justify-between gap-4' : 'flex-col space-y-1.5'} ${className}`}>
            <label htmlFor={id} className={`text-sm font-medium text-slate-600 ${direction === 'row' ? 'whitespace-nowrap' : ''}`}>
                {label}
            </label>
            <input
                id={id}
                type="text"
                value={displayValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                readOnly={readOnly}
                className={` 
                    flex h-auto w-full rounded-md px-3 py-2 placeholder:text-slate-400 focus:outline-none transition-colors
                    ${variant !== 'clean' ? 'border text-sm' : ''}
                    ${getVariantStyles()}
                    ${inputClassName}
                `}
            />
        </div>
    );
}
