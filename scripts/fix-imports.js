import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcDir = path.join(__dirname, '../src')

const componentMap = {
  // UI
  Avatar: 'ui/Avatar',
  Badge: 'ui/Badge',
  Button: 'ui/Button',
  Card: 'ui/Card',
  Callout: 'ui/Callout',
  Tag: 'ui/Tag',
  ToastViewport: 'ui/ToastViewport',
  EmptyState: 'ui/EmptyState',
  StatusBadge: 'ui/StatusBadge',
  ScrollToTop: 'ui/ScrollToTop',
  
  // Layout
  Header: 'layout/Header',
  Footer: 'layout/Footer',
  Container: 'layout/Container',
  Section: 'layout/Section',
  SkipLink: 'layout/SkipLink',
  
  // Features
  PostCard: 'features/PostCard',
  ProjectCard: 'features/ProjectCard',
  InterestCard: 'features/InterestCard',
  ThinkerCard: 'features/ThinkerCard',
  SourceList: 'features/SourceList',
  FilterBar: 'features/FilterBar',
  SearchInput: 'features/SearchInput',
  EpistemicLegend: 'features/EpistemicLegend',
  
  // Content
  Prose: 'content/Prose',
  
  // Meta
  Seo: 'meta/Seo',
  ThemeToggle: 'meta/ThemeToggle',
  Icon: 'meta/Icon',
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory)
  
  for (const file of files) {
    const fullPath = path.join(directory, file)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      processDirectory(fullPath)
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8')
      let changed = false
      
      // We want to match: import { ... } from '.../components/Component'
      // or import Component from '.../components/Component'
      // and also handle .jsx extensions
      
      Object.keys(componentMap).forEach(comp => {
        // Regex to match relative imports of components
        const regex = new RegExp(`from\\s+['"](?:\\.\\/|\\.\\.\\/)+components\\/${comp}(?:\\.jsx)?['"]`, 'g')
        if (regex.test(content)) {
          content = content.replace(regex, `from '@/components/${componentMap[comp]}.jsx'`)
          changed = true
        }
        
        // Also catch imports from '.' if we are inside components directory
        // Example: in src/components/ui/Button.jsx, it might import '../Icon.jsx'
        // This is harder with regex, let's just do a global replace for all known component names
        const regex2 = new RegExp(`from\\s+['"](?:\\.\\/|\\.\\.\\/)+${comp}(?:\\.jsx)?['"]`, 'g')
        // only apply if the file is inside components
        if (fullPath.includes('src\\components') || fullPath.includes('src/components')) {
            if (regex2.test(content)) {
                content = content.replace(regex2, `from '@/components/${componentMap[comp]}.jsx'`)
                changed = true
            }
        }
      })

      // Fix imports of things outside components, like lib, hooks, layouts, data
      // Let's just make everything absolute if it goes up a level
      const libRegex = new RegExp(`from\\s+['"](?:\\.\\/|\\.\\.\\/)+(?:src\\/)?lib\\/(.+)['"]`, 'g')
      if (libRegex.test(content)) {
          content = content.replace(libRegex, `from '@/lib/$1'`)
          changed = true
      }
      
      const hooksRegex = new RegExp(`from\\s+['"](?:\\.\\/|\\.\\.\\/)+(?:src\\/)?hooks\\/(.+)['"]`, 'g')
      if (hooksRegex.test(content)) {
          content = content.replace(hooksRegex, `from '@/hooks/$1'`)
          changed = true
      }
      
      const layoutsRegex = new RegExp(`from\\s+['"](?:\\.\\/|\\.\\.\\/)+(?:src\\/)?layouts\\/(.+)['"]`, 'g')
      if (layoutsRegex.test(content)) {
          content = content.replace(layoutsRegex, `from '@/layouts/$1'`)
          changed = true
      }
      
      const dataRegex = new RegExp(`from\\s+['"](?:\\.\\/|\\.\\.\\/)+(?:src\\/)?data\\/(.+)['"]`, 'g')
      if (dataRegex.test(content)) {
          content = content.replace(dataRegex, `from '@/data/$1'`)
          changed = true
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content)
        console.log('Updated:', fullPath)
      }
    }
  }
}

processDirectory(srcDir)
