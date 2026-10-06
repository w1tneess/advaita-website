/**
 * Small responsive data table for the admin list pages.
 *
 * Columns declare their own cell renderer. On narrow screens the table switches to a
 * stacked card layout via a CSS-only pattern (each cell carries its column label), so no
 * data is hidden and no horizontal scroll is needed.
 */
export default function DataTable({ caption, columns, rows, rowKey = (row) => row.id, empty }) {
  if (rows.length === 0) return empty ?? null

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface/40 shadow-subtle backdrop-blur-sm">
      <table className="w-full border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}

        <thead className="hidden border-b border-line bg-raised/80 sm:table-header-group">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-4 py-3.5 text-left text-[11px] font-mono font-semibold tracking-wider text-muted uppercase ${
                  column.className ?? ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr 
              key={rowKey(row)} 
              className="block sm:table-row hover:bg-surface/70 transition-colors duration-150 ease-[var(--ease-out-quart)]"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`block px-4 py-2.5 first:pt-4 last:pb-4 align-middle sm:table-cell sm:py-3.5 ${
                    column.className ?? ''
                  }`}
                >
                  {/* Column label, shown only in the stacked mobile layout. */}
                  <span
                    className="mb-1 block text-[11px] font-mono font-semibold tracking-wider text-muted uppercase sm:hidden"
                    aria-hidden="true"
                  >
                    {column.header}
                  </span>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
