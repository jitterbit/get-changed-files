//pulled from @octokit/openapi-types/types.d.ts/components/schemas/diff-entry.json
export type DiffEntry = {
  /** @example bbcd538c8e72b8c175046e27cc8f907076331401 */
  sha: string
  /** @example file1.txt */
  filename: string
  /**
   * @example added
   * @enum {string}
   */
  status:
    | 'added'
    | 'removed'
    | 'modified'
    | 'renamed'
    | 'copied'
    | 'changed'
    | 'unchanged'
  /** @example 103 */
  additions: number
  /** @example 21 */
  deletions: number
  /** @example 124 */
  changes: number
  /**
   * Format: uri
   * @example https://github.com/octocat/Hello-World/blob/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt
   */
  blob_url: string
  /**
   * Format: uri
   * @example https://github.com/octocat/Hello-World/raw/6dcb09b5b57875f334f61aebed695e2e4193db5e/file1.txt
   */
  raw_url: string
  /**
   * Format: uri
   * @example https://api.github.com/repos/octocat/Hello-World/contents/file1.txt?ref=6dcb09b5b57875f334f61aebed695e2e4193db5e
   */
  contents_url: string
  /** @example @@ -132,7 +132,7 @@ module Test @@ -1000,7 +1000,7 @@ module Test */
  patch?: string
  /** @example file.txt */
  previous_filename?: string
}

export type Format = 'space-delimited' | 'csv' | 'json'
