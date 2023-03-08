import type {DiffEntry} from './types'

export function filterFiles(
  filters: string[],
  files: DiffEntry[]
): DiffEntry[] {
  if (filters.length === 0) {
    return files
  }
  return files.filter(file => {
    const filename = file.filename
    return filters.some(filter => {
      if (filter.startsWith('/') && filter.endsWith('/')) {
        return new RegExp(filter.slice(1, -1)).test(filename)
      }
      return new RegExp(filter).test(filename)
    })
  })
}
