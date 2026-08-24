import {
  AtSign,
  BarChart3,
  BookOpen,
  Brain,
  Cpu,
  Globe,
  GraduationCap,
  Landmark,
  Linkedin,
  Github,
  Mail,
  Newspaper,
  Rss,
  Scale,
  ScrollText,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

/**
 * Explicit icon registry for icons named in src/data/*.json.
 *
 * Deliberately not `import * as icons from 'lucide-react'`: a namespace import defeats
 * tree-shaking and would pull the entire icon set into the bundle. Add an icon here to
 * make it available to the seed data and the admin pickers.
 */
export const ICON_REGISTRY = {
  AtSign,
  BarChart3,
  BookOpen,
  Brain,
  Cpu,
  Globe,
  GraduationCap,
  Github,
  Landmark,
  Linkedin,
  Mail,
  Newspaper,
  Rss,
  Scale,
  ScrollText,
  ShieldCheck,
  TrendingUp,
}

export const ICON_NAMES = Object.keys(ICON_REGISTRY)

/**
 * Render an icon by name, falling back to a neutral globe for unknown names so a typo
 * in the data never crashes the page.
 */
export default function Icon({ name, fallback = 'Globe', ...rest }) {
  const Component = ICON_REGISTRY[name] ?? ICON_REGISTRY[fallback]
  return <Component aria-hidden="true" {...rest} />
}
