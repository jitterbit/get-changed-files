import fs from 'fs'
import {filterFiles} from '../src/filter'

const getFiles = () => {
  return JSON.parse(
    fs.readFileSync(`${__dirname}/fixtures/compareResponse.json`, 'utf8')
  ).files
}

//test when no filters are provided all files are returned
test('no filters', () => {
  const filters = [] as string[]
  const files = filterFiles(filters, getFiles())
  expect(files.length).toBe(8)
})

//test no filters match
test('no matching files', () => {
  const filters = ['nothing']
  const files = filterFiles(filters, getFiles())
  expect(files.length).toBe(0)
})

//test single filter matches single file
test('one matching file', () => {
  const filters = ['/^added.txt$/']
  const files = filterFiles(filters, getFiles())
  expect(files[0].filename).toBe('added.txt')
})

//test single filter matches multiple files
test('multiple matching files', () => {
  const filters = ['/added.txt/']
  const files = filterFiles(filters, getFiles())
  expect(files.length).toBe(4)
})

//test multiple filters match single file
test('multiple matching filters to single file', () => {
  const filters = ['/path4/', '/.*/.*/.*/']
  const files = filterFiles(filters, getFiles())
  expect(files[0].filename).toBe('path3/path4/added.txt')
})

//test multiple filters match multiple files
test('multiple matching filters to multiple files', () => {
  const filters = ['/path1/', '/path2/']
  const files = filterFiles(filters, getFiles())
  expect(files.length).toBe(3)
})
