import fs from 'fs'
import {formatFiles} from '../src/format'
import {Format} from '../src/types'

const getFiles = () => {
  return JSON.parse(
    fs.readFileSync(`${__dirname}/fixtures/compareResponse.json`, 'utf8')
  ).files
}

//test csv format
test('csv format', () => {
  const changedFiles = formatFiles(getFiles(), 'csv')
  expect(changedFiles.allFormatted).toBe(
    'added.txt,modified.txt,removed.txt,renamed.txt,path1/added.txt,path2/removed.txt,path2/added.txt,path3/path4/added.txt'
  )
  expect(changedFiles.addedFormatted).toBe(
    'added.txt,path1/added.txt,path2/added.txt,path3/path4/added.txt'
  )
  expect(changedFiles.modifiedFormatted).toBe('modified.txt')
  expect(changedFiles.removedFormatted).toBe('removed.txt,path2/removed.txt')
  expect(changedFiles.addedModifiedFormatted).toBe(
    'added.txt,modified.txt,path1/added.txt,path2/added.txt,path3/path4/added.txt'
  )
})

//test json format
test('json format', () => {
  const changedFiles = formatFiles(getFiles(), 'json')
  expect(changedFiles.allFormatted).toBe(
    '["added.txt","modified.txt","removed.txt","renamed.txt","path1/added.txt","path2/removed.txt","path2/added.txt","path3/path4/added.txt"]'
  )
  expect(changedFiles.addedFormatted).toBe(
    '["added.txt","path1/added.txt","path2/added.txt","path3/path4/added.txt"]'
  )
  expect(changedFiles.modifiedFormatted).toBe('["modified.txt"]')
  expect(changedFiles.removedFormatted).toBe(
    '["removed.txt","path2/removed.txt"]'
  )
  expect(changedFiles.addedModifiedFormatted).toBe(
    '["added.txt","modified.txt","path1/added.txt","path2/added.txt","path3/path4/added.txt"]'
  )
})

//test space-delimited format
test('space-delimited format', () => {
  const changedFiles = formatFiles(getFiles(), 'space-delimited')
  expect(changedFiles.allFormatted).toBe(
    'added.txt modified.txt removed.txt renamed.txt path1/added.txt path2/removed.txt path2/added.txt path3/path4/added.txt'
  )
  expect(changedFiles.addedFormatted).toBe(
    'added.txt path1/added.txt path2/added.txt path3/path4/added.txt'
  )
  expect(changedFiles.modifiedFormatted).toBe('modified.txt')
  expect(changedFiles.removedFormatted).toBe('removed.txt path2/removed.txt')
  expect(changedFiles.addedModifiedFormatted).toBe(
    'added.txt modified.txt path1/added.txt path2/added.txt path3/path4/added.txt'
  )
})

//test error thrown when file name includes a space
test('space-delimited error thrown when file name includes a space', () => {
  let files = getFiles()
  files[0].filename = 'added a new file.txt'
  expect(() => formatFiles(files, 'space-delimited')).toThrowError()
})

//test error thrown when file status is not supported
test('error thrown when file status is not supported', () => {
  let files = getFiles()
  files[0].status = 'unchanged'
  expect(() => formatFiles(files, 'space-delimited')).toThrowError()
})

//test when format is invalid
test('error thrown format is invalid', () => {
  expect(() => formatFiles(getFiles(), 'foo' as Format)).toThrowError()
})
