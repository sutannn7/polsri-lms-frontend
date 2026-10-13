import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Input({
  id,
  label,
  error,
  leftIcon,
  rightIcon,
  rightIconLabel = 'Aksi kolom input',
  onRightIconClick,
  type = 'text',
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && isPasswordVisible ? 'text' : type;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label ? (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-main">
          {label}
          {required ? <span aria-hidden="true" className="ml-1 text-danger">*</span> : null}
        </label>
      ) : null}
      <div className={`flex min-h-11 items-center gap-3 rounded-lg border bg-white px-3 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${error ? 'border-danger' : 'border-border'} ${disabled ? 'cursor-not-allowed bg-gray-50' : ''}`}>
        {leftIcon ? <span aria-hidden="true" className="shrink-0 text-secondary">{leftIcon}</span> : null}
        <input
          id={inputId}
          type={inputType}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-main outline-none placeholder:text-secondary/75 focus:ring-0 disabled:cursor-not-allowed disabled:text-secondary ${className}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={isPasswordVisible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            disabled={disabled}
            className="inline-flex shrink-0 items-center justify-center rounded p-1 text-secondary transition-colors hover:text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed"
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : rightIcon ? (
          onRightIconClick ? (
            <button
              type="button"
              aria-label={rightIconLabel}
              onClick={onRightIconClick}
              disabled={disabled}
              className="inline-flex shrink-0 items-center justify-center rounded p-1 text-secondary transition-colors hover:text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed"
            >
              {rightIcon}
            </button>
          ) : (
            <span aria-hidden="true" className="inline-flex shrink-0 text-secondary">{rightIcon}</span>
          )
        ) : null}
      </div>
      {error ? <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  );
}

export default Input;
