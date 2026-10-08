/**
 * Type definitions for navigation and route metadata.
 */

export interface NavRoute {
  key: string
  label: string
  path: string
  title: string
  description: string
  shortLabel?: string
  inHeader?: boolean
  inFooter?: boolean
  inMobile?: boolean
  category?: string
}

export interface NavGroup {
  label: string
  items: Array<{
    to: string
    label: string
    icon?: unknown
  }>
}
