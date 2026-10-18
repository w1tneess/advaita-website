/**
 * Keeps the content sections of llms.txt / llms-full.txt in sync with the published
 * projects and notes at build time. The hand-written parts (identity, principles,
 * guidelines) are left untouched; only the sections named below are regenerated.
 */

import { SITE_URL } from '../src/config/site.js'

const projectUrl = (project) => project.links?.live || `${SITE_URL}/projects#${project.id}`

/** Replace the body under `heading` up to the next line starting with `nextPrefix`. */
export function replaceSection(source, heading, nextPrefix, body) {
  const text = source.replace(/\r\n/g, '\n') // Windows checkouts may use CRLF
  const start = text.indexOf(`${heading}\n`)
  const end = start === -1 ? -1 : text.indexOf(`\n${nextPrefix}`, start + heading.length)
  if (start === -1 || end === -1) {
    console.warn(`llms: section "${heading}" not found; left unchanged.`)
    return text
  }
  return `${text.slice(0, start)}${heading}\n${body}${text.slice(end)}`
}

export function syncLlmsTxt(text, { projects }) {
  const list = projects
    .map((p) => {
      const repo = p.links?.repository ? ` (Repo: ${p.links.repository})` : ''
      return `- [${p.title}](${projectUrl(p)}): ${p.summary || p.description || ''}${repo}`
    })
    .join('\n')
  return replaceSection(text, '## Key Research & Projects', '## ', `${list}\n`)
}

export function syncLlmsFull(text, { projects, notes }) {
  const noteBlocks = notes
    .map((n, i) =>
      [
        `#### Note ${i + 1}: ${n.title}`,
        `- **Category**: ${n.category || 'Philosophy'}`,
        `- **Date**: ${n.published_at || ''}`,
        `- **URL**: ${SITE_URL}/philosophy/${n.slug}`,
        '- **Text**:',
        ...String(n.content || n.excerpt || '')
          .split('\n')
          .map((line) => `  ${line}`.trimEnd()),
      ].join('\n'),
    )
    .join('\n\n')

  const projectBlocks = projects
    .map((p, i) => {
      const lines = [`### Project ${i + 1}: ${p.title}`, `- **Status**: ${p.status || 'unspecified'}`]
      if (p.categories?.length) lines.push(`- **Categories**: ${p.categories.join(', ')}`)
      if (p.summary) lines.push(`- **Summary**: ${p.summary}`)
      if (p.description && p.description !== p.summary) lines.push(`- **Description**: ${p.description}`)
      if (p.role) lines.push(`- **Role**: ${p.role}`)
      if (p.tools?.length) lines.push(`- **Tools**: ${p.tools.join(', ')}`)
      if (p.links?.live) lines.push(`- **Live Website**: ${p.links.live}`)
      if (p.links?.repository) lines.push(`- **Repository**: ${p.links.repository}`)
      if (p.methodology?.length) {
        lines.push('- **Methodology**:', ...p.methodology.map((m, j) => `  ${j + 1}. ${m.title ? `${m.title}: ` : ''}${m.detail || ''}`))
      }
      if (p.limitations?.length) lines.push('- **Stated Limitations**:', ...p.limitations.map((l) => `  - ${l}`))
      return lines.join('\n')
    })
    .join('\n\n')

  const withNotes = replaceSection(text, '### Full Text of Philosophical Notes', '## ', `\n${noteBlocks}\n\n---\n`)
  return replaceSection(withNotes, '## 4. Projects & Engineering Portfolio', '## ', `\n${projectBlocks}\n\n---\n`)
}
