import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'
import {parseBoolean} from './parse-boolean'

async function run(): Promise<void> {
  try {
    const client = new GitHub(core.getInput('token', {required: true}))
    const disk: boolean = parseBoolean(core.getInput('disk', {required: true}))

    core.debug(`Client: ${Object.keys(client)}`)
    core.debug(`Disk: ${disk}`)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commits: any[] = context.payload.commits

    if (!commits || !Array.isArray(commits) || commits.length <= 0) {
      core.setFailed(
        `Commits are missing from the payload for this ${context.eventName} event. ` +
          "Please submit an issue on this action's GitHub repo."
      )
    }

    core.debug(Object.keys(commits[0]).toString())
    core.debug(Object.keys(context.payload).toString())
    core.debug(context.eventName)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
