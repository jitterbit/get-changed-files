import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'
import * as fs from 'fs'
import * as path from 'path'
import {parseBoolean} from './parse-boolean'

type FileStatus = 'added' | 'modified' | 'removed'

async function run(): Promise<void> {
  try {
    // Create GitHub client with the API token.
    const client = new GitHub(core.getInput('token', {required: true}))

    // Parse the boolean flag for whether to write to disk or not.
    const disk: boolean = parseBoolean(core.getInput('disk', {required: true}))
    core.debug(`Disk: ${disk}`)

    // Extract the base and head commits from the webhook payload.
    const base: string = context.payload.before
    const head: string = context.payload.after

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
    const all = files.reduce<string[]>((acc, file) => {
      acc.push(file.filename)
      return acc
    }, [])
    const added = files.reduce<string[]>((acc, file) => {
      if ((file.status as FileStatus) === 'added') {
        acc.push(file.filename)
      }
      return acc
    }, [])
    const modified = files.reduce<string[]>((acc, file) => {
      if ((file.status as FileStatus) === 'modified') {
        acc.push(file.filename)
      }
      return acc
    }, [])
    const deleted = files.reduce<string[]>((acc, file) => {
      if ((file.status as FileStatus) === 'removed') {
        acc.push(file.filename)
      }
      return acc
    }, [])
    const addedModified = files.reduce<string[]>((acc, file) => {
      if ((file.status as FileStatus) === 'added' || (file.status as FileStatus) === 'modified') {
        acc.push(file.filename)
      }
      return acc
    }, [])

    core.debug(`All: ${JSON.stringify(all)}`)
    core.debug(`Added: ${JSON.stringify(added)}`)
    core.debug(`Modified: ${JSON.stringify(modified)}`)
    core.debug(`Deleted: ${JSON.stringify(deleted)}`)
    core.debug(`Added or modified: ${JSON.stringify(addedModified)}`)

    if (disk) {
      core.debug(`Writing output to disk at ${path.resolve(__dirname, 'changed-files')}`)
      await Promise.all([
        fs.writeFile(path.resolve(__dirname, 'changed-files', 'all.json'), JSON.stringify(all), err => {
          core.setFailed(
            `Failed to write to disk at ${path.resolve(__dirname, 'changed-files', 'all.json')} with error code ${
              err?.code
            }. Please submit an issue on this action's GitHub repo.`
          )
        }),
        fs.writeFile(path.resolve(__dirname, 'changed-files', 'added.json'), JSON.stringify(added), err => {
          core.setFailed(
            `Failed to write to disk at ${path.resolve(__dirname, 'changed-files', 'added.json')} with error code ${
              err?.code
            }. Please submit an issue on this action's GitHub repo.`
          )
        }),
        fs.writeFile(path.resolve(__dirname, 'changed-files', 'modified.json'), JSON.stringify(modified), err => {
          core.setFailed(
            `Failed to write to disk at ${path.resolve(__dirname, 'changed-files', 'modified.json')} with error code ${
              err?.code
            }. Please submit an issue on this action's GitHub repo.`
          )
        }),
        fs.writeFile(path.resolve(__dirname, 'changed-files', 'deleted.json'), JSON.stringify(deleted), err => {
          core.setFailed(
            `Failed to write to disk at ${path.resolve(__dirname, 'changed-files', 'deleted.json')} with error code ${
              err?.code
            }. Please submit an issue on this action's GitHub repo.`
          )
        }),
        fs.writeFile(
          path.resolve(__dirname, 'changed-files', 'added_modified.json'),
          JSON.stringify(addedModified),
          err => {
            core.setFailed(
              `Failed to write to disk at ${path.resolve(
                __dirname,
                'changed-files',
                'added_modified.json'
              )} with error code ${err?.code}. Please submit an issue on this action's GitHub repo.`
            )
          }
        )
      ])
    }

    core.setOutput('all', JSON.stringify(all))
    core.setOutput('added', JSON.stringify(all))
    core.setOutput('modified', JSON.stringify(all))
    core.setOutput('deleted', JSON.stringify(all))
    core.setOutput('added_modified', JSON.stringify(all))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
