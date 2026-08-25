import { AlertCircle, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import Field from './Field.jsx'
import { BLOCK_TYPES, CALLOUT_VARIANTS, createBlock } from '../../lib/schema.js'

/**
 * Article body editor.
 *
 * The body is a list of typed blocks rather than markdown. That is a deliberate trade: it
 * is more structured to author, but the fact/analysis/opinion/limitation separation the
 * site is built around becomes a property of the data instead of a prose convention — and
 * nothing ever needs dangerouslySetInnerHTML to render it.
 */

const HEADING_LEVELS = [
  { value: '2', label: 'Section heading (h2)' },
  { value: '3', label: 'Sub-heading (h3)' },
]

const LIST_STYLES = [
  { value: 'unordered', label: 'Bulleted' },
  { value: 'ordered', label: 'Numbered' },
]

const TYPE_LABEL = Object.fromEntries(BLOCK_TYPES.map((type) => [type.value, type.label]))

/** The items of a list block: one input per line, with add and remove. */
function ListItems({ id, items, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">List items</legend>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={`${id}-${index}`} className="flex items-start gap-2">
            <input
              type="text"
              value={item}
              onChange={(event) =>
                onChange(items.map((current, i) => (i === index ? event.target.value : current)))
              }
              aria-label={`List item ${index + 1}`}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              disabled={items.length === 1}
              aria-label={`Remove list item ${index + 1}`}
              className="mt-1 rounded-md p-1.5 text-muted transition-colors hover:text-limitation disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent underline underline-offset-4 hover:text-accent-strong"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Add list item
      </button>
    </fieldset>
  )
}

function BlockFields({ block, index, set }) {
  const id = `block-${block.id}`

  switch (block.type) {
    case 'heading':
      return (
        <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
          <Field
            id={`${id}-level`}
            label="Level"
            type="select"
            value={String(block.level ?? 2)}
            onChange={(value) => set('level', Number(value))}
            options={HEADING_LEVELS}
          />
          <Field
            id={`${id}-text`}
            label="Heading text"
            value={block.text}
            onChange={(value) => set('text', value)}
          />
        </div>
      )

    case 'list':
      return (
        <div className="space-y-4">
          <Field
            id={`${id}-style`}
            label="Style"
            type="select"
            value={block.style ?? 'unordered'}
            onChange={(value) => set('style', value)}
            options={LIST_STYLES}
          />
          <ListItems
            id={id}
            items={block.items ?? ['']}
            onChange={(value) => set('items', value)}
          />
        </div>
      )

    case 'quote':
      return (
        <div className="space-y-4">
          <Field
            id={`${id}-text`}
            label="Quotation"
            type="textarea"
            rows={3}
            value={block.text}
            onChange={(value) => set('text', value)}
          />
          <Field
            id={`${id}-attribution`}
            label="Attribution"
            value={block.attribution ?? ''}
            onChange={(value) => set('attribution', value)}
            hint="Who said or wrote it. Quoting without attribution makes the claim unverifiable."
          />
        </div>
      )

    case 'callout':
      return (
        <div className="space-y-4">
          <Field
            id={`${id}-variant`}
            label="Kind of claim"
            type="select"
            value={block.variant ?? 'note'}
            onChange={(value) => set('variant', value)}
            options={CALLOUT_VARIANTS.map((variant) => ({
              value: variant.value,
              label: variant.label,
            }))}
            hint={
              CALLOUT_VARIANTS.find((variant) => variant.value === (block.variant ?? 'note'))
                ?.description
            }
          />
          <Field
            id={`${id}-title`}
            label="Title"
            value={block.title ?? ''}
            onChange={(value) => set('title', value)}
            hint="Optional."
          />
          <Field
            id={`${id}-text`}
            label="Text"
            type="textarea"
            rows={3}
            value={block.text}
            onChange={(value) => set('text', value)}
          />
        </div>
      )

    case 'code':
      return (
        <div className="space-y-4">
          <Field
            id={`${id}-language`}
            label="Language"
            value={block.language ?? ''}
            onChange={(value) => set('language', value)}
            hint="Shown as a label above the block. Purely informational — there is no syntax highlighting."
          />
          <Field
            id={`${id}-code`}
            label="Code"
            type="textarea"
            rows={6}
            value={block.code}
            onChange={(value) => set('code', value)}
          />
        </div>
      )

    case 'image':
      return (
        <div className="space-y-4">
          <Field
            id={`${id}-src`}
            label="Image URL"
            type="url"
            value={block.src}
            onChange={(value) => set('src', value)}
            hint="Either a full URL, or a file placed in public/ and referenced as /your-file.png."
          />
          <Field
            id={`${id}-alt`}
            label="Alt text"
            value={block.alt}
            onChange={(value) => set('alt', value)}
            required
            hint="Describe what the image shows. An article cannot be published with an image that has no alt text."
          />
          <Field
            id={`${id}-caption`}
            label="Caption"
            value={block.caption ?? ''}
            onChange={(value) => set('caption', value)}
            hint="Optional. Shown under the image, and read as prose."
          />
        </div>
      )

    case 'paragraph':
    default:
      return (
        <Field
          id={`${id}-text`}
          label={`Paragraph ${index + 1}`}
          type="textarea"
          rows={4}
          value={block.text}
          onChange={(value) => set('text', value)}
        />
      )
  }
}

export default function BlockEditor({ blocks = [], onChange, error }) {
  const [newType, setNewType] = useState('paragraph')
  const [announcement, setAnnouncement] = useState('')

  const setField = (index, key, value) =>
    onChange(blocks.map((block, i) => (i === index ? { ...block, [key]: value } : block)))

  const remove = (index) => onChange(blocks.filter((_, i) => i !== index))

  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= blocks.length) return
    const next = [...blocks]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
    setAnnouncement(
      `${TYPE_LABEL[blocks[index].type]} block moved to position ${target + 1} of ${blocks.length}.`,
    )
  }

  return (
    <div>
      {error && (
        <p className="mb-4 flex items-start gap-2 rounded-lg border border-limitation/40 bg-limitation/8 px-4 py-3 text-sm text-limitation">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {blocks.length === 0 ? (
        <p className="rounded-card border border-dashed border-line p-6 text-sm text-muted">
          No blocks yet. An article needs at least one block with content before it can be
          published.
        </p>
      ) : (
        <ol className="space-y-4">
          {blocks.map((block, index) => (
            <li key={block.id} className="rounded-card border border-line bg-raised/40 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  {index + 1}. {TYPE_LABEL[block.type] ?? block.type}
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move block ${index + 1} up`}
                    className="rounded-md border border-line p-1 text-muted transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === blocks.length - 1}
                    aria-label={`Move block ${index + 1} down`}
                    className="rounded-md border border-line p-1 text-muted transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove block ${index + 1}`}
                    className="ml-1 rounded-md border border-line p-1 text-muted transition-colors hover:text-limitation"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <BlockFields
                block={block}
                index={index}
                set={(key, value) => setField(index, key, value)}
              />
            </li>
          ))}
        </ol>
      )}

      <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-line pt-5">
        <Field
          id="block-new-type"
          label="Add a block"
          type="select"
          value={newType}
          onChange={setNewType}
          options={BLOCK_TYPES}
          className="min-w-56"
        />
        <button
          type="button"
          onClick={() => onChange([...blocks, createBlock(newType)])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add block
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
