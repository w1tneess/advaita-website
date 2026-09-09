import { Download, Upload, Trash2, Cloud, HardDrive, RefreshCw, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import Button from '@/components/ui/Button.jsx'
import { useConfirm } from '../../hooks/useConfirm.jsx'
import { useContent } from '../../lib/content.jsx'
import { documentToJson, exportFilename, parseImportedJson } from '../../lib/store.js'
import { checkSupabaseHealth } from '../../lib/supabase/sync.js'
import { useToast } from '../../lib/toast.jsx'

export default function DataManager() {
  const {
    content,
    isRemote,
    syncToRemote,
    replaceDocument,
    resetDocument,
  } = useContent()
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()
  const fileRef = useRef(null)
  const [importStatus, setImportStatus] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [copiedSql, setCopiedSql] = useState(false)

  const [health, setHealth] = useState({
    loading: true,
    configured: false,
    connected: false,
    latencyMs: 0,
    tables: { siteContent: false, contactSubmissions: false, imagesBucket: false },
    message: ''
  })
  const [testingHealth, setTestingHealth] = useState(false)

  const testConnection = async () => {
    setTestingHealth(true)
    try {
      const res = await checkSupabaseHealth()
      setHealth({ ...res, loading: false })
      if (res.connected) {
        toast.success(`Supabase ping successful (${res.latencyMs}ms).`)
      } else {
        toast.error(`Supabase connection failed: ${res.message}`)
      }
    } catch (err) {
      toast.error('Connection test error: ' + err.message)
    } finally {
      setTestingHealth(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

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
    toast.success('Content exported as JSON backup.')
  }

  const handleImportFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
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

      setImportStatus('Saving to storage...')
      const saveResult = await replaceDocument(result.doc)
      if (saveResult && saveResult.ok) {
        setImportStatus('')
        toast.success('Content imported successfully.')
      } else {
        setImportStatus('')
      }
    }
    reader.onerror = () => {
      setImportStatus('')
      toast.error('Could not read file.')
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleManualSync = async () => {
    setSyncing(true)
    const res = await syncToRemote()
    setSyncing(false)
    if (res.ok) {
      testConnection()
    }
  }

  const handleCopySchemaSql = () => {
    const sql = `-- Supabase Schema for Advaita Website
CREATE TABLE IF NOT EXISTS public.site_content (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON public.site_content FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can update" ON public.site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  topic text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert contact submissions" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated users can manage contact submissions" ON public.contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
`
    navigator.clipboard.writeText(sql)
    setCopiedSql(true)
    toast.success('Schema SQL copied to clipboard!')
    setTimeout(() => setCopiedSql(false), 2500)
  }

  const handleReset = async () => {
    const confirmed = await confirm({
      title: 'Reset content to defaults?',
      message:
        'This clears active content from storage and reverts to the default seed. This cannot be undone unless you have exported a JSON backup.',
      confirmLabel: 'Clear Storage',
    })
    if (!confirmed) return

    const ok = await resetDocument()
    if (!ok) toast.error('Reset failed.')
    else toast.success('Content reset to default seed.')
  }

  const _documentStr = JSON.stringify(content)
  const documentBytes = new Blob([_documentStr]).size

  return (
    <AdminPage
      title="Database &amp; Data Sync"
      description="Manage cloud synchronization, local browser caching, JSON backups, and database schema."
    >
      {/* Sync Status Banner */}
      <div className="rounded-xl border border-[#242626] bg-[#121414] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg border ${isRemote ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' : 'bg-[#181a1a] border-[#292a2a] text-[#D1B18A]'}`}>
              {isRemote ? <Cloud className="h-5 w-5" /> : <HardDrive className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="font-display text-base text-[#E8E6E1]">
                Active Storage: <span className="text-[#D1B18A]">{isRemote ? 'Supabase Cloud Synced' : 'Local Browser Cache'}</span>
              </h2>
              <p className="font-mono text-xs text-neutral-400 mt-0.5">
                {isRemote 
                  ? 'Changes are automatically pushed to Supabase and mirrored locally for offline protection.' 
                  : 'Operating in Local Mode. Edits are preserved in browser storage.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D1B18A] bg-[#D1B18A]/10 px-4 py-2 text-xs font-mono tracking-wider uppercase text-[#D1B18A] hover:bg-[#D1B18A]/20 transition-all cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync to Cloud'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Diagnostics & Schema Setup */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mono text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
            Supabase Health &amp; Diagnostics
          </h2>
          <button
            type="button"
            onClick={testConnection}
            disabled={testingHealth}
            className="text-xs font-mono text-[#D1B18A] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${testingHealth ? 'animate-spin' : ''}`} />
            Run Diagnostics
          </button>
        </div>

        <div className="grid gap-4 rounded-xl border border-[#242626] bg-[#121414] p-5 sm:grid-cols-3 font-mono text-xs">
          <div>
            <p className="text-[10px] tracking-wider text-neutral-500 uppercase">Cloud Connection</p>
            <div className="mt-1.5 flex items-center gap-2">
              {health.connected ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Operational ({health.latencyMs}ms)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-[#D1B18A]" />
                  <span className="text-[#D1B18A] font-medium">Offline / Local</span>
                </>
              )}
            </div>
            <p className="mt-1 text-[11px] text-neutral-400 truncate">{health.message}</p>
          </div>

          <div>
            <p className="text-[10px] tracking-wider text-neutral-500 uppercase">Database Tables</p>
            <p className="mt-1.5 font-medium text-[#E8E6E1]">
              site_content: <span className={health.tables.siteContent ? 'text-emerald-400' : 'text-neutral-500'}>{health.tables.siteContent ? 'Ready' : 'Not verified'}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-400">
              contact_submissions: <span className={health.tables.contactSubmissions ? 'text-emerald-400' : 'text-neutral-500'}>{health.tables.contactSubmissions ? 'Ready' : 'Not verified'}</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] tracking-wider text-neutral-500 uppercase">Document Size</p>
            <p className="mt-1.5 font-medium text-[#E8E6E1]">
              {documentBytes > 0 ? `${Math.round(documentBytes / 1024)} KB` : '—'}
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-400">Schema Version v{content?.schemaVersion ?? '—'}</p>
          </div>
        </div>

        {/* Copy Schema SQL Button */}
        <div className="mt-3 flex items-center justify-between p-3.5 rounded-lg border border-[#242626] bg-[#141616] text-xs font-mono">
          <span className="text-neutral-400">Setting up a new Supabase project? Copy the ready SQL schema:</span>
          <button
            type="button"
            onClick={handleCopySchemaSql}
            className="inline-flex items-center gap-1.5 text-xs text-[#D1B18A] hover:underline cursor-pointer ml-3 shrink-0"
          >
            {copiedSql ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
          </button>
        </div>
      </section>

      {/* Export */}
      <section className="mt-12">
        <h2 className="font-mono text-[11px] font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Export Backup
        </h2>
        <p className="text-xs text-neutral-400">
          Download the full content document as an offline JSON backup.
        </p>
        <div className="mt-4">
          <Button onClick={handleExport} size="sm">
            <Download className="h-4 w-4" aria-hidden="true" />
            Export JSON Content
          </Button>
        </div>
      </section>

      {/* Import */}
      <section className="mt-12">
        <h2 className="font-mono text-[11px] font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Import Backup
        </h2>
        <p className="text-xs text-neutral-400">
          Upload a previously exported JSON backup. Schema validation and migrations run automatically before saving.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label
            htmlFor="content-import"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#242626] bg-[#141616] px-4 py-2.5 text-xs font-mono text-neutral-300 hover:border-[#D1B18A] hover:text-[#E8E6E1] transition-colors"
          >
            <Upload className="h-4 w-4 text-[#D1B18A]" aria-hidden="true" />
            Select JSON File
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
          {importStatus && <span className="text-xs font-mono text-neutral-400">{importStatus}</span>}
        </div>
      </section>

      {/* Reset */}
      <section className="mt-12">
        <h2 className="font-mono text-[11px] font-bold tracking-widest text-neutral-500 uppercase mb-2">
          Clear / Revert Storage
        </h2>
        <p className="text-xs text-neutral-400">
          Discard working edits and return to the default deployment seed. Export a backup first if you want to keep your data.
        </p>
        <div className="mt-4">
          <Button variant="danger" size="sm" onClick={handleReset}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear Storage
          </Button>
        </div>
      </section>

      <ConfirmDialog {...dialogProps} />
    </AdminPage>
  )
}
