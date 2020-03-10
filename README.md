<p align="center">
  <a href="https://github.com/jitterbit/get-modified-files/actions"><img alt="jitterbit/get-modified-files status" src="https://github.com/jitterbit/get-modified-files/workflows/Test/badge.svg"></a>
</p>

# Get Modified Files

Get the files modified in a commit or commits.
You can choose to get all changed files, only added files, only modified files, only deleted files, or all added and modified files.
These outputs are available via the `steps` output context and the local file system.
The `steps` output context exposes the output names `all`, `added`, `modified`, `deleted`, and `added_modified`.
The step also outputs these files to the local file system at `./changed-files/`.
The file names are `changed-files/all.json`, `changed-files/added.json`, `changed-files/modified.json`, `changed-files/deleted.json`, and `changed-files/added_modified.json`.

# Usage

See [action.yml](action.yml)

```yaml
- uses: jitterbit/get-modified-files@v1
  with:
    # Format of the steps output context.
    # Can be 'space-delimited', 'csv', or 'json'.
    # Default: 'space-delimited'
    format: ''
```

# Scenarios

- [Get all changed files as space-delimited](#Get-all-changed-files-as-space-delimited)
- [Get all added and modified files as CSV](#Get-all-added-and-modified-files-as-CSV)
- [Get all deleted files as JSON](#Get-all-deleted-files-as-JSON)

## Get all changed files as space-delimited

If there are any files with spaces in them, then this method won't work and the step will fail.
Consider using one of the other formats if that's the case.

```yaml
- id: files
  uses: jitterbit/get-modified-files@v1
- run: |
    for changed_file in ${{ steps.files.outputs.all }}; do
      echo "Do something with this ${changed_file}."
    done
```

## Get all added and modified files as CSV

```yaml
- id: files
  uses: jitterbit/get-modified-files@v1
- run: |
    mapfile -d ',' -t added_modified_files < <(printf '%s,' '${{ steps.files.outputs.added_modified }}')
    for added_modified_file in "${added_modified_files[@]}"; do
      echo "Do something with this ${added_modified_file}."
    done
```

## Get all deleted files as JSON

```yaml
- id: files
  uses: jitterbit/get-modified-files@v1
- run: |
    readarray -t deleted_files <<<"$(jq -r '.[]' <<<'${{ steps.files.outputs.deleted }}')"
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
