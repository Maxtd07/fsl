/**
 * Reusable Input Component
 * - Standardized styling with focus ring and placeholder
 * - Types: text, email, password, number, date, textarea, select
 * - Label, error message, helper text support
 * - Accessibility: aria-label, aria-describedby for errors
 */

function Input({
  label,
  type = 'text',
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  const baseInputClasses = [
    'w-full px-4 py-2.5 rounded-lg',
    'border border-text/20',
    'bg-base text-text placeholder-text/50',
    'transition-all duration-200',
    'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
    'disabled:bg-background disabled:cursor-not-allowed',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="block mb-2 text-sm font-semibold text-text">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={inputId}
          className={baseInputClasses}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={4}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={inputId}
          className={baseInputClasses}
          disabled={disabled}
          required={required}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          className={baseInputClasses}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
      )}

      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperId} className="mt-2 text-sm text-text/60">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Input
