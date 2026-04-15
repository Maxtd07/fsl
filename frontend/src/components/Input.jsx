import { useId } from 'react'

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
  const generatedId = useId()
  const inputId = id ?? `input-${generatedId.replace(/:/g, '')}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  const baseInputClasses = [
    'w-full rounded-lg border border-text/20 bg-base px-4 py-2.5 text-text placeholder-text/50',
    'transition-all duration-200',
    'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
    'disabled:cursor-not-allowed disabled:bg-background',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const descriptionId = error ? errorId : helperText ? helperId : undefined

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-text">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
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
          aria-describedby={descriptionId}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={inputId}
          className={baseInputClasses}
          disabled={disabled}
          required={required}
          aria-describedby={descriptionId}
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
          aria-describedby={descriptionId}
          {...props}
        />
      )}

      {error && (
        <p id={errorId} className="mt-2 text-sm font-medium text-red-600">
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
