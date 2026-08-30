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
import { buildPublishBundle, publishBundleFilename } from '../../lib/publish.js'
import { assetPath, validateImageFile } from '../../lib/media.js'

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
  const [publishStatus, setPublishStatus] = useState(null)
  const [assets, setAssets] = useState([])

  const handlePublishBundle = () => {
    const result = buildPublishBundle(content, assets)
    if (!result.ok) {
      setPublishStatus({ ok: false, errors: result.errors })
      toast.error(`Validation failed: ${result.errors[0]}`)
      return
    }
    const blob = new Blob([JSON.stringify(result.bundle, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = publishBundleFilename()
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
    setPublishStatus({ ok: true, bundle: result.bundle })
    toast.success('Publish bundle downloaded.')
  }

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
      title: 'Reset local edits?',
      message:
        'This discards the current local document and goes back to the deployed seed. Any edits made in this browser that have not been exported will be lost.',
      confirmLabel: 'Reset',
    })
    if (!confirmed) return

    const ok = resetDocument()
    if (!ok) toast.error('Reset failed — local storage is unavailable.')
    else toast.success('Reset to deployed seed.')
  }

  const _documentStr = JSON.stringify(content)
  const documentBytes = new Blob([_documentStr]).size

  return (
    <AdminPage
      title="Data manager"
      description="Validate, export, import, and reset local content edits."
    >
      <section
        aria-labelledby="publish-bundle-heading"
        className="mb-10 rounded-xl border border-accent/30 bg-accent/5 p-5"
      >
        <h2 id="publish-bundle-heading" className="text-xl font-semibold tracking-tight">
          Export publish bundle
        </h2>
        <p className="mt-2 text-sm text-muted">
          Validate your local edits and download only the changed source files. Apply the bundle in
          Codespaces, review the diff, then commit through GitHub.
        </p>
        <Button onClick={handlePublishBundle} size="sm" className="mt-4">
          Export publish bundle
        </Button>
        {publishStatus?.ok && (
          <p className="mt-4 text-sm" role="status">
            Validation passed. Modified files: {publishStatus.bundle.modified.length || 'none'};
            assets: {publishStatus.bundle.assets.length || 'none'}.
          </p>
        )}
        {publishStatus && !publishStatus.ok && (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-limitation">
            {publishStatus.errors.slice(0, 8).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="media-heading" className="mt-10">
        <h2 id="media-heading" className="text-xl font-semibold tracking-tight">
          Local media
        </h2>
        <p className="mt-2 text-sm text-muted">
          Add small public images to the publish bundle. Images are limited to 5 MB and common image
          formats; apply each generated asset under public/assets/.
        </p>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          multiple
          className="mt-4 block text-sm"
          onChange={(event) => {
            for (const file of [...(event.target.files || [])]) {
              const result = validateImageFile(file)
              if (!result.ok) {
                toast.error(result.error)
                continue
              }
              const reader = new FileReader()
              reader.onload = () =>
                setAssets((current) => [
                  ...current.filter((asset) => asset.filename !== result.filename),
                  {
                    filename: result.filename,
                    path: assetPath(result.filename),
                    dataUrl: reader.result,
                  },
                ])
              reader.readAsDataURL(file)
            }
            event.target.value = ''
          }}
        />
        {assets.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {assets.map((asset) => (
              <li key={asset.filename}>{asset.path}</li>
            ))}
          </ul>
        )}
      </section>
      <Callout variant="analysis" title="This manages the whole site">
        Export creates a JSON backup. The publish bundle creates changed source files for GitHub.
        Import validates the file first — a bad file is rejected, not loaded. Reset clears local
        edits and uses checked-in content again.
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
            <p className="text-xs tracking-wide text-muted uppercase">Local edits</p>
            <p className="mt-1 font-medium">{hasLocalDocument ? 'Present' : 'None'}</p>
            <p className="mt-1 text-xs text-muted">
              {isLocal ? 'Using local document' : 'Using deployed seed'}
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
            The deployed seed has newer defaults (seed v{content.seedVersion ?? 0} vs local v
            {content.seedVersion ?? 0}). You can adopt the new defaults by resetting, or keep your
            current edits by exporting them first.
          </p>
        )}
      </section>

      {/* Export */}
      <section aria-labelledby="data-export-heading" className="mt-12">
        <h2 id="data-export-heading" className="text-xl font-semibold tracking-tight">
          Export
        </h2>
        <p className="mt-2 text-sm text-muted">
          Download the full content document as JSON. Commit this file back into the repository to
          publish changes.
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
          Reset
        </h2>
        <p className="mt-2 text-sm text-muted">
          Discard all local edits and return to the deployed seed. This is irreversible — export
          first if you want to keep anything.
        </p>
        <div className="mt-4">
          <Button variant="danger" size="sm" onClick={handleReset}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Reset local edits
          </Button>
        </div>
      </section>

      <ConfirmDialog {...dialogProps} />
    </AdminPage>
  )
}
