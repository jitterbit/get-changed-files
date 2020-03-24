import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'

type Format = 'space-delimited' | 'csv' | 'json'
type FileStatus = 'added' | 'modified' | 'removed'

async function run(): Promise<void> {
  try {
    // Create GitHub client with the API token.
    const client = new GitHub(core.getInput('token', {required: true}))
    const format = core.getInput('format', {required: true}) as Format

    // Ensure that the format parameter is set properly.
    if (format !== 'space-delimited' && format !== 'csv' && format !== 'json') {
      core.setFailed(`Format must be one of 'string-delimited', 'csv', or 'json', got '${format}'.`)
    }

    // Debug log the payload
    core.debug(`Payload: ${context.payload}`)

    // Extract the base and head commits from the webhook payload.
    const base: string = context.payload.base?.sha
    const head: string = context.payload.head?.sha

    // Ensure that the base and head properties are set on the payload.
    if (!base || !head) {
      core.setFailed(
        `The base and head commits are missing from the payload for this ${context.eventName} event. ` +
          "Please submit an issue on this action's GitHub repo."
      )
    }

    // Use GitHub's compare two commits API.
    // https://developer.github.com/v3/repos/commits/#compare-two-commits
    const response = await client.repos.compareCommits({
      base,
      head,
      owner: context.repo.owner,
      repo: context.repo.repo
    })

    // Ensure that the request was successful.
    if (response.status !== 200) {
      core.setFailed(
        `The GitHub API for comparing the base and head commits for this ${context.eventName} event returned ${response.status}, expected 200. ` +
          "Please submit an issue on this action's GitHub repo."
      )
    }

    // Ensure that the head commit is ahead of the base commit.
    if (response.data.status !== 'ahead') {
      core.setFailed(
        `The head commit for this ${context.eventName} event is not ahead of the base commit. ` +
          "Please submit an issue on this action's GitHub repo."
      )
    }

    // Get the changed files from the response payload.
    const files = response.data.files
    const all = [] as string[],
      added = [] as string[],
      modified = [] as string[],
      deleted = [] as string[],
      addedModified = [] as string[]
    for (const file of files) {
      const filename = file.filename
      // If we're using the 'space-delimited' format and any of the filenames have a space in them,
      // then fail the step.
      if (format === 'space-delimited' && filename.includes(' ')) {
        core.setFailed(
          `One of your files includes a space. Consider using a different output format or removing spaces from your filenames. ` +
            "Please submit an issue on this action's GitHub repo."
        )
      }
      all.push(filename)
      switch (file.status as FileStatus) {
        case 'added':
          added.push(filename)
          addedModified.push(filename)
          break
        case 'modified':
          modified.push(filename)
          addedModified.push(filename)
          break
        case 'removed':
          deleted.push(filename)
          break
        default:
          core.setFailed(
            `One of your files includes an unsupported file status ${file.status}, expected 'added', 'modified', or 'removed'.`
          )
      }
    }

    // Format the arrays of changed files.
    let allFormatted: string,
      addedFormatted: string,
      modifiedFormatted: string,
      deletedFormatted: string,
      addedModifiedFormatted: string
    switch (format) {
      case 'space-delimited':
        // If any of the filenames have a space in them, then fail the step.
        for (const file of all) {
          if (file.includes(' '))
            core.setFailed(
              `One of your files includes a space. Consider using a different output format or removing spaces from your filenames.`
            )
        }
        allFormatted = all.join(' ')
        addedFormatted = added.join(' ')
        modifiedFormatted = modified.join(' ')
        deletedFormatted = deleted.join(' ')
        addedModifiedFormatted = addedModified.join(' ')
        break
      case 'csv':
        allFormatted = all.join(',')
        addedFormatted = added.join(',')
        modifiedFormatted = modified.join(',')
        deletedFormatted = deleted.join(',')
        addedModifiedFormatted = addedModified.join(',')
        break
      case 'json':
        allFormatted = JSON.stringify(all)
        addedFormatted = JSON.stringify(added)
        modifiedFormatted = JSON.stringify(modified)
        deletedFormatted = JSON.stringify(deleted)
        addedModifiedFormatted = JSON.stringify(addedModified)
        break
    }

    // Log the output values.
    core.info(`All: ${allFormatted}`)
    core.info(`Added: ${addedFormatted}`)
    core.info(`Modified: ${modifiedFormatted}`)
    core.info(`Deleted: ${deletedFormatted}`)
    core.info(`Added or modified: ${addedModifiedFormatted}`)

    // Set step output context.
    core.setOutput('all', allFormatted)
    core.setOutput('added', addedFormatted)
    core.setOutput('modified', modifiedFormatted)
    core.setOutput('deleted', deletedFormatted)
    core.setOutput('added_modified', addedModifiedFormatted)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
