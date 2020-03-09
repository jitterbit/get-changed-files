import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'

async function run(): Promise<void> {
  try {
    const client = new GitHub(core.getInput('token', {required: true}))
    const disk = core.getInput('disk', {required: true})

    core.debug(`Client: ${client.toString()}`)
    core.debug(`Disk: ${disk}`)

    const commits = context.payload.commits
    core.debug(commits)
    core.debug(context.payload.toString())
    core.debug(JSON.stringify(context.payload))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
