import { AlertCircle } from 'lucide-react'

/**
 * Form field primitives for the admin panel.
 *
 * Every field wires up the accessibility plumbing in one place: a real <label>, hint and
 * error text linked through aria-describedby, and aria-invalid on failure. Doing this per
 * form is how it gets forgotten.
 */

const CONTROL_CLASSES =
  'w-full rounded-lg border bg-surface px-3 py-2.5 text-sm transition-colors placeholder:text-muted/70 focus:outline-none disabled:opacity-60'

function controlClasses(hasError) {
  return `${CONTROL_CLASSES} ${
    hasError ? 'border-limitation focus:border-limitation' : 'border-line focus:border-accent'
  }`
}

/**
 * Label / hint / error scaffolding around an arbitrary control.
 *
 * `children` is a render function receiving the props the control must spread, so custom
 * controls (checkbox groups, block editors) get the same wiring as a plain input.
 */
export function FieldShell({
  id,
  label,
  hint,
  error,
  required = false,
  limit,
  value,
  className = '',
  children,
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const length = typeof value === 'string' ? value.length : null

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
          {required && (
            <span className="ml-1 text-limitation" aria-hidden="true">
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>

        {typeof limit === 'number' && length !== null && (
          <span
            className={`text-xs tabular-nums ${length > limit ? 'text-limitation' : 'text-muted'}`}
          >
            {length}/{limit}
          </span>
        )}
      </div>

      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        className: controlClasses(Boolean(error)),
      })}

      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-xs text-limitation">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Text, textarea, select, date and number field.
 *
 * @param {'text'|'textarea'|'select'|'date'|'number'|'url'|'email'} type
 */
export default function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder,
  rows = 4,
  hint,
  error,
  required = false,
  limit,
  disabled = false,
  min,
  max,
  className = '',
}) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      limit={limit}
      value={value}
      className={className}
    >
      {(props) => {
        if (type === 'textarea') {
          return (
            <textarea
              {...props}
              rows={rows}
              value={value ?? ''}
              onChange={(event) => onChange(event.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={`${props.className} resize-y leading-relaxed`}
            />
          )
        }

        if (type === 'select') {
          return (
            <select
              {...props}
              value={value ?? ''}
              onChange={(event) => onChange(event.target.value)}
              disabled={disabled}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )
        }

        return (
          <input
            {...props}
            type={type}
            value={value ?? ''}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
          />
        )
      }}
    </FieldShell>
  )
}

/**
 * Comma-separated list editor for short string arrays (tools, tags).
 *
 * Kept as one text input on purpose: a row-per-item editor is heavier than the content
 * justifies, and the parsing is unambiguous.
 */
export function ListField({
  id,
  label,
  values = [],
  onChange,
  hint = 'Separate items with commas.',
  error,
  placeholder,
  className = '',
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      {(props) => (
        <input
          {...props}
          type="text"
          value={values.join(', ')}
          onChange={(event) =>
            onChange(
              event.target.value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
            )
          }
          placeholder={placeholder}
        />
      )}
    </FieldShell>
  )
}

/** Multi-select as a checkbox group — all options visible, keyboard-navigable by default. */
export function CheckboxGroup({
  id,
  label,
  options = [],
  values = [],
  onChange,
  hint,
  error,
  required = false,
  className = '',
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  const toggle = (value) =>
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value])

  return (
    <fieldset
      className={className}
      aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-1.5 text-sm font-medium">
        {label}
        {required && (
          <span className="ml-1 text-limitation" aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = values.includes(option.value)
          return (
            <label
              key={option.value}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                checked
                  ? 'border-accent bg-accent/12 text-accent'
                  : 'border-line bg-surface text-muted hover:border-accent'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option.value)}
                className="h-3.5 w-3.5 accent-[var(--color-accent)]"
              />
              {option.label}
            </label>
          )
        })}
      </div>

      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-xs text-limitation">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  )
}
