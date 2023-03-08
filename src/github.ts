import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'
import type {DiffEntry} from './types'

export async function getFileChanges(token: string): Promise<DiffEntry[]> {
  // Debug log the payload.
  core.debug(`Payload keys: ${Object.keys(context.payload)}`)

  // Get event name.
  const eventName = context.eventName

  // Define the base and head commits to be extracted from the payload.
  let base: string | undefined
  let head: string | undefined

  switch (eventName) {
    case 'pull_request':
      base = context.payload.pull_request?.base?.sha
      head = context.payload.pull_request?.head?.sha
      break
    case 'push':
      base = context.payload.before
      head = context.payload.after
      break
    default:
      throw new Error(
        `This action only supports pull requests and pushes, ${context.eventName} events are not supported. ` +
          "Please submit an issue on this action's GitHub repo if you believe this in correct."
      )
  }

  // Log the base and head commits
  core.info(`Base commit: ${base}`)
  core.info(`Head commit: ${head}`)

  // Ensure that the base and head properties are set on the payload.
  if (!base || !head) {
    throw new Error(
      `The base and head commits are missing from the payload for this ${context.eventName} event. ` +
        "Please submit an issue on this action's GitHub repo."
    )
  }

  // Use GitHub's compare two commits API.
  // https://developer.github.com/v3/repos/commits/#compare-two-commits
  const response = await getOctokit(
    token
  ).rest.repos.compareCommitsWithBasehead({
    basehead: `${base}...${head}`,
    owner: context.repo.owner,
    repo: context.repo.repo
  })

  core.debug(`Response: ${JSON.stringify(response)}`)

  // Ensure that the request was successful.
  if (response.status !== 200) {
    throw new Error(
      `The GitHub API for comparing the base and head commits for this ${context.eventName} event returned ${response.status}, expected 200. ` +
        "Please submit an issue on this action's GitHub repo."
    )
  }

  if (response.data.files === undefined) {
    throw new Error(
      'Unexpected response from GitHub API, files property is undefined.'
    )
  }

  // Get the changed files from the response payload.
  return response.data.files
}
