import { Download, Upload, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import Callout from '../../components/Callout.jsx'
import Button from '../../components/Button.jsx'
import { useConfirm } from '../../hooks/useConfirm.jsx'
import { useContent } from '../../lib/content.jsx'
import { documentToJson, exportFilename, parseImportedJson } from '../../lib/store.js'
import { useToast } from '../../lib/toast.jsx'

/**
 * Data management: export, import, reset.
 *
 * Everything here operates on the full content document. A publish bundle produces the
 * changed source files and a manifest for committing through GitHub. Import replaces
 * the working document with the file's contents (validated first). Reset discards
 * the local copy so the deployed seed is used again.
 */
export default function DataManager() {
  const {
    content,
    isLocal,
    storageAvailable: available,
    hasLocalDocument,
    seedIsNewer,
    replaceDocument,
    resetDocument,
  } = useContent()
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()
  const fileRef = useRef(null)
  const [importStatus, setImportStatus] = useState('')

  const handleExport = () => {
    const json = documentToJson(content)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = exportFilename()
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
    toast.success('Content exported.')
  }

  const handleImportFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setImportStatus('Validating imported file...')
      const result = parseImportedJson(e.target?.result ?? '')
      if (!result.ok) {
        setImportStatus('')
        toast.error(
          result.problems.length > 0
            ? `Import failed: ${result.problems[0]}`
            : 'Import failed: unknown error.',
        )
        return
      }

      replaceDocument(result.doc)
      setImportStatus('')
      toast.success('Content imported. Save to keep it.')
    }
    reader.onerror = () => {
      setImportStatus('')
      toast.error('Could not read file.')
    }
    reader.readAsText(file)
    // Clear the input so the same file can be selected again.
    event.target.value = ''
  }

  const handleReset = async () => {
    const confirmed = await confirm({
      title: 'Clear database content?',
      message:
        'This deletes the content currently in the database and falls back to the default seed. This is irreversible.',
      confirmLabel: 'Clear Database',
    })
    if (!confirmed) return

    const ok = resetDocument()
    if (!ok) toast.error('Reset failed — database error.')
    else toast.success('Database cleared. Using fallback seed.')
  }

  const _documentStr = JSON.stringify(content)
  const documentBytes = new Blob([_documentStr]).size

  return (
    <AdminPage
      title="Data manager"
      description="Manage database sync, export backups, import data, and reset content."
    >
      <Callout variant="analysis" title="Database Management">
        Export creates a JSON backup of your current content. Import loads a backup and syncs it to the database. Reset clears all synced data from the database, falling back to the default seed.
      </Callout>

      {/* Storage info */}
      <section aria-labelledby="data-info-heading" className="mt-10">
        <h2 id="data-info-heading" className="text-xl font-semibold tracking-tight">
          Status
        </h2>
        <div className="mt-4 grid gap-3 rounded-xl border border-line bg-surface p-5 sm:grid-cols-3">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">Storage available</p>
            <p className="mt-1 font-medium">{available ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">Database synced</p>
            <p className="mt-1 font-medium">{hasLocalDocument ? 'Yes' : 'No'}</p>
            <p className="mt-1 text-xs text-muted">
              {isLocal ? 'Using remote database' : 'Using local seed'}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">Document size</p>
            <p className="mt-1 font-medium">
              {documentBytes > 0 ? `${Math.round(documentBytes / 1024)} KB` : '—'}
            </p>
            <p className="mt-1 text-xs text-muted">Schema v{content?.schemaVersion ?? '—'}</p>
          </div>
        </div>
        {seedIsNewer && (
          <p className="mt-3 rounded-lg border border-accent/30 bg-accent/8 px-4 py-3 text-sm">
            The fallback seed has newer defaults (seed v{content.seedVersion ?? 0} vs database v
            {content.seedVersion ?? 0}). You can adopt the new defaults by clearing the database, or keep your
            current content by exporting it first.
          </p>
        )}
      </section>

      {/* Export */}
      <section aria-labelledby="data-export-heading" className="mt-12">
        <h2 id="data-export-heading" className="text-xl font-semibold tracking-tight">
          Export
        </h2>
        <p className="mt-2 text-sm text-muted">
          Download the full content document as a JSON backup.
        </p>
        <div className="mt-4">
          <Button onClick={handleExport} size="sm">
            <Download className="h-4 w-4" aria-hidden="true" />
            Export content
          </Button>
        </div>
      </section>

      {/* Import */}
      <section aria-labelledby="data-import-heading" className="mt-12">
        <h2 id="data-import-heading" className="text-xl font-semibold tracking-tight">
          Import
        </h2>
        <p className="mt-2 text-sm text-muted">
          Upload a JSON file exported from this site. The file is validated before anything is
          loaded.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label
            htmlFor="content-import"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Select file
          </label>
          <input
            id="content-import"
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
            aria-label="Select a JSON content file to import"
          />
          {importStatus && <span className="text-sm text-muted">{importStatus}</span>}
        </div>
      </section>

      {/* Reset */}
      <section aria-labelledby="data-reset-heading" className="mt-12">
        <h2 id="data-reset-heading" className="text-xl font-semibold tracking-tight">
          Clear Database
        </h2>
        <p className="mt-2 text-sm text-muted">
          Discard all database content and return to the fallback seed. This is irreversible — export
          a backup first if you want to keep anything.
        </p>
        <div className="mt-4">
          <Button variant="danger" size="sm" onClick={handleReset}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear database
          </Button>
        </div>
      </section>

      <ConfirmDialog {...dialogProps} />
    </AdminPage>
  )
}
