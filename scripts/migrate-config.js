import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcDir = path.join(__dirname, '../src')

const siteContent = `export const SITE_URL = 'https://advaitachandra.in'
export const SITE_NAME = 'Advaita Chandra'
export const DEFAULT_OG_IMAGE = 'og-placeholder.svg'
`
fs.writeFileSync(path.join(srcDir, 'config', 'site.js'), siteContent)

let routesContent = fs.readFileSync(path.join(srcDir, 'lib', 'routes.js'), 'utf-8')
routesContent = routesContent.replace(/export const SITE_URL[\s\S]*?DEFAULT_OG_IMAGE = 'og-placeholder\.svg'/m, '')

// Clean up any double blank lines
routesContent = routesContent.replace(/\n\s*\n\s*\n/g, '\n\n')

fs.writeFileSync(path.join(srcDir, 'config', 'nav.js'), routesContent)
fs.unlinkSync(path.join(srcDir, 'lib', 'routes.js'))

function replaceInDir(directory) {
  const files = fs.readdirSync(directory)
  for (const file of files) {
    const fullPath = path.join(directory, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      replaceInDir(fullPath)
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      let changed = false
      if (content.includes('@/lib/routes.js')) {
        content = content.replace(/@\/lib\/routes\.js/g, '@/config/nav.js')
        changed = true
      }
      if (content.includes('./routes.js') && fullPath.includes('seo.js')) {
        content = content.replace(/\.\/routes\.js/g, '@/config/site.js')
        changed = true
      }
      if (changed) {
        fs.writeFileSync(fullPath, content)
        console.log('Updated:', fullPath)
      }
    }
  }
}

replaceInDir(srcDir)

// Also fix prerender.js
const prerenderPath = path.join(__dirname, 'prerender.js')
let prerenderContent = fs.readFileSync(prerenderPath, 'utf8')
if (prerenderContent.includes('../src/lib/routes.js')) {
  prerenderContent = prerenderContent.replace(/import \{.*?\} from '\.\.\/src\/lib\/routes\.js'/, 
    "import { allPrerenderRoutes } from '../src/config/nav.js'\nimport { SITE_URL } from '../src/config/site.js'")
  fs.writeFileSync(prerenderPath, prerenderContent)
  console.log('Updated: prerender.js')
}
