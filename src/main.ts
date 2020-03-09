import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'
import {parseBoolean} from './parse-boolean'

async function run(): Promise<void> {
  try {
    const client = new GitHub(core.getInput('token', {required: true}))
    const disk: boolean = parseBoolean(core.getInput('disk', {required: true}))

    core.debug(`Client: ${Object.keys(client)}`)
    core.debug(`Disk: ${disk}`)

    const base: string = context.payload.before
    const head: string = context.payload.after

    if (!base || !head) {
      core.setFailed(
        `The base and head commits are missing from the payload for this ${context.eventName} event. ` +
          "Please submit an issue on this action's GitHub repo."
      )
    }

    const response = await client.repos.compareCommits({
      base,
      head,
      owner: context.repo.owner,
      repo: context.repo.repo
    })

    if (response.status !== 200) {
      core.setFailed(
        `The GitHub API for comparing the base and head commits for this ${context.eventName} event returned ${response.status}, expected 200. ` +
          "Please submit an issue on this action's GitHub repo."
      )
    }

    if (response.data.status !== 'ahead') {
      core.setFailed(
        `The head commit for this ${context.eventName} event is not ahead of the base commit. ` +
          "Please submit an issue on this action's GitHub repo."
      )
    }
    const files = response.data.files
    core.debug(JSON.stringify(files))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
