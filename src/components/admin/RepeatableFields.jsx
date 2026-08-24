import { Plus, Trash2 } from 'lucide-react'

import Field from './Field.jsx'

/**
 * Repeatable sub-field editors for the arrays that live inside a single record.
 *
 * These are not collections in the document (they have no ids and no independent order),
 * so they are edited in place with the record that owns them: the four approach steps on
 * the profile, a project's methodology and limitations, the credibility points on the home
 * page.
 */

function RowFrame({ index, label, onRemove, canRemove, children }) {
  return (
    <li className="rounded-lg border border-line bg-raised/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">
          {label} {index + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:text-limitation disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Remove
        </button>
      </div>
      {children}
    </li>
  )
}

function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  )
}

/** List of `{title, detail}` objects — approach steps, methodology steps. */
export function PairList({
  id,
  legend,
  hint,
  rows = [],
  onChange,
  rowLabel = 'Step',
  titleLabel = 'Title',
  detailLabel = 'Detail',
  minRows = 0,
  addLabel = 'Add step',
}) {
  const update = (index, key, value) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)))

  const remove = (index) => onChange(rows.filter((_, i) => i !== index))
  const add = () => onChange([...rows, { title: '', detail: '' }])

  return (
    <fieldset>
      <legend className="text-sm font-medium">{legend}</legend>
      {hint && <p className="mt-1 mb-3 text-xs text-muted">{hint}</p>}

      <ul className="space-y-3">
        {rows.map((row, index) => (
          <RowFrame
            key={`${id}-${index}`}
            index={index}
            label={rowLabel}
            onRemove={() => remove(index)}
            canRemove={rows.length > minRows}
          >
            <div className="space-y-3">
              <Field
                id={`${id}-${index}-title`}
                label={titleLabel}
                value={row.title}
                onChange={(value) => update(index, 'title', value)}
              />
              <Field
                id={`${id}-${index}-detail`}
                label={detailLabel}
                type="textarea"
                rows={3}
                value={row.detail}
                onChange={(value) => update(index, 'detail', value)}
              />
            </div>
          </RowFrame>
        ))}
      </ul>

      <AddButton onClick={add}>{addLabel}</AddButton>
    </fieldset>
  )
}

/** List of plain strings, one textarea each — limitations, credibility points. */
export function TextList({
  id,
  legend,
  hint,
  values = [],
  onChange,
  rowLabel = 'Item',
  rows = 2,
  addLabel = 'Add item',
}) {
  const update = (index, value) => onChange(values.map((item, i) => (i === index ? value : item)))
  const remove = (index) => onChange(values.filter((_, i) => i !== index))

  return (
    <fieldset>
      <legend className="text-sm font-medium">{legend}</legend>
      {hint && <p className="mt-1 mb-3 text-xs text-muted">{hint}</p>}

      <ul className="space-y-3">
        {values.map((value, index) => (
          <RowFrame
            key={`${id}-${index}`}
            index={index}
            label={rowLabel}
            onRemove={() => remove(index)}
            canRemove
          >
            <Field
              id={`${id}-${index}`}
              label={`${rowLabel} text`}
              type="textarea"
              rows={rows}
              value={value}
              onChange={(next) => update(index, next)}
            />
          </RowFrame>
        ))}
      </ul>

      <AddButton onClick={() => onChange([...values, ''])}>{addLabel}</AddButton>
    </fieldset>
  )
}
