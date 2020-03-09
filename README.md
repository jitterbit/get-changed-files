<p align="center">
  <a href="https://github.com/jitterbit/get-modified-files/actions"><img alt="jitterbit/get-modified-files status" src="https://github.com/jitterbit/get-modified-files/workflows/Test/badge.svg"></a>
</p>

# Get Modified Files

Get the files modified in a commit or commits.
You can choose to get all changed files, only added files, only modified files, only deleted files, or all added and modified files.
These outputs are available via the `steps` output context and the local file system.
The `steps` output context exposes the output names `all`, `added`, `deleted`, `modified`, and `added_modified`.
The step also outputs these files to the local file system at `./changed-files/`.
The file names are `changed-files/all.json`, `changed-files/added.json`, `changed-files/deleted.json`, `changed-files/modified.json`, and `changed-files/added_modified.json`.

# Usage

See [action.yml](action.yml)

```yaml
- uses: jitterbit/get-modified-files@v1
  with:
    # Write the JSON arrays to disk at `./files/all.json`, `./files/added.json`, `./files/deleted.json`,
    # `./files/modified.json`, and `./files/added_modified.json`.
    # The contents of these files mirror that of their respective output parameters.
    # Default: false
    disk: ''
```

# Scenarios

- [Get all changed files from steps context](#Get-all-changed-files-from-steps-context)
- [Get all deleted files from disk](#Get-all-deleted-files-from-disk)

## Get all changed files from steps context

```yaml
- id: files
  uses: jitterbit/get-modified-files@v1
- run: |
    changed_files=($(echo '${{ steps.files.outputs.all }}' | jq -r 'join(" ")'))
    for changed_file in ${changed_files[@]}; do
      echo "Do something with this ${changed_file}."
    done
```

## Get all deleted files from disk

```yaml
- uses: jitterbit/get-modified-files@v1
  with:
    disk: true
- run: |
    deleted_files=($(cat 'files/deleted.json' | jq -r 'join(" ")'))
    for deleted_file in ${deleted_files[@]}; do
      echo "Do something with this ${deleted_file}."
    done
```

# Install, Build, Lint, Test, and Package

Make sure to do the following before checking in any code changes.

```bash
$ yarn
$ yarn all
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
