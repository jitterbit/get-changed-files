import type {DiffEntry, Format} from './types'

interface ChangedFiles {
  allFormatted: string
  addedFormatted: string
  modifiedFormatted: string
  removedFormatted: string
  renamedFormatted: string
  addedModifiedFormatted: string
}

export function formatFiles(files: DiffEntry[], format: Format): ChangedFiles {
  const all = [] as string[]
  const added = [] as string[]
  const modified = [] as string[]
  const removed = [] as string[]
  const renamed = [] as string[]
  const addedModified = [] as string[]

  for (const file of files) {
    const filename = file.filename
    // If we're using the 'space-delimited' format and any of the filenames have a space in them,
    // then fail the step.
    if (format === 'space-delimited' && filename.includes(' ')) {
      throw new Error(
        `One of your files includes a space. Consider using a different output format or removing spaces from your filenames. ` +
          "Please submit an issue on this action's GitHub repo."
      )
    }
    all.push(filename)
    switch (file.status) {
      case 'added':
        added.push(filename)
        addedModified.push(filename)
        break
      case 'modified':
        modified.push(filename)
        addedModified.push(filename)
        break
      case 'removed':
        removed.push(filename)
        break
      case 'renamed':
        renamed.push(filename)
        break
      default:
        throw new Error(
          `One of your files includes an unsupported file status '${file.status}', expected 'added', 'modified', 'removed', or 'renamed'.`
        )
    }
  }

  // Format the arrays of changed files.
  let allFormatted: string
  let addedFormatted: string
  let modifiedFormatted: string
  let removedFormatted: string
  let renamedFormatted: string
  let addedModifiedFormatted: string

  switch (format) {
    case 'space-delimited':
      allFormatted = all.join(' ')
      addedFormatted = added.join(' ')
      modifiedFormatted = modified.join(' ')
      removedFormatted = removed.join(' ')
      renamedFormatted = renamed.join(' ')
      addedModifiedFormatted = addedModified.join(' ')
      break
    case 'csv':
      allFormatted = all.join(',')
      addedFormatted = added.join(',')
      modifiedFormatted = modified.join(',')
      removedFormatted = removed.join(',')
      renamedFormatted = renamed.join(',')
      addedModifiedFormatted = addedModified.join(',')
      break
    case 'json':
      allFormatted = JSON.stringify(all)
      addedFormatted = JSON.stringify(added)
      modifiedFormatted = JSON.stringify(modified)
      removedFormatted = JSON.stringify(removed)
      renamedFormatted = JSON.stringify(renamed)
      addedModifiedFormatted = JSON.stringify(addedModified)
      break
    default:
      /* istanbul ignore next */
      throw new Error(
        `Unsupported format '${format}', expected 'space-delimited', 'csv', or 'json'.`
      )
  }

  return {
    allFormatted,
    addedFormatted,
    modifiedFormatted,
    removedFormatted,
    renamedFormatted,
    addedModifiedFormatted
  }
}
