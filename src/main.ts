import * as core from '@actions/core'
import {context, GitHub} from '@actions/github'
import {parseBoolean} from './parse-boolean'

async function run(): Promise<void> {
  try {
    const client = new GitHub(core.getInput('token', {required: true}))
    const disk: boolean = parseBoolean(core.getInput('disk', {required: true}))

    core.debug(`Client: ${Object.keys(client)}`)
    core.debug(`Disk: ${disk}`)

    const commits = context.payload.commits
    if (commits) {
      core.debug(Object.keys(commits).toString())
    } else {
      core.debug("commits doesn't exist")
    }
    core.debug(Object.keys(context.payload).toString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
