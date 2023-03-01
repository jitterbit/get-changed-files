import * as core from '@actions/core'
import {getFileChanges} from './github'
import {formatFiles} from './format'
import {getInputs} from './input'

async function run(): Promise<void> {
  try {
    // resolve inputs
    const inputs = getInputs()

    // compare commits
    const files = await getFileChanges(inputs.token)

    // Format the changed files.
    const {
      allFormatted,
      addedFormatted,
      modifiedFormatted,
      removedFormatted,
      renamedFormatted,
      addedModifiedFormatted
    } = formatFiles(files, inputs.format)

    // Log the output values.
    core.info(`All: ${allFormatted}`)
    core.info(`Added: ${addedFormatted}`)
    core.info(`Modified: ${modifiedFormatted}`)
    core.info(`Removed: ${removedFormatted}`)
    core.info(`Renamed: ${renamedFormatted}`)
    core.info(`Added or modified: ${addedModifiedFormatted}`)

    // Set step output context.
    core.setOutput('all', allFormatted)
    core.setOutput('added', addedFormatted)
    core.setOutput('modified', modifiedFormatted)
    core.setOutput('removed', removedFormatted)
    core.setOutput('renamed', renamedFormatted)
    core.setOutput('added_modified', addedModifiedFormatted)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
