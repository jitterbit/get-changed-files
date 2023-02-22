import * as core from '@actions/core'

type Format = 'space-delimited' | 'csv' | 'json'

interface Inputs {
    format : Format
    token : string
}

export async function getInputs(): Promise<Inputs> {
    //github token
    const token = core.getInput('token', {required: true});

    //output format
    const format = core.getInput('format', {required: true}) as Format;

    // Ensure that the format parameter is set properly.
    if (format !== 'space-delimited' && format !== 'csv' && format !== 'json') {
        throw new Error(
            `Format must be one of 'string-delimited', 'csv', or 'json', got '${format}'.`
        )
    }

    return { token, format };
}
