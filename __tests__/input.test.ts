import {getInputs} from '../src/input'

beforeEach(() => {
  delete process.env['INPUT_FORMAT']
  delete process.env['INPUT_TOKEN']
})

//token and format return when supplied and correct values
test('get valid inputs', () => {
  process.env['INPUT_FORMAT'] = 'csv'
  process.env['INPUT_TOKEN'] = 'token'
  const {token, format} = getInputs()
  expect(token).toEqual('token')
  expect(format).toEqual('csv')
})

// test when format is misisng we throw an error
test('format is not valid', async () => {
  process.env['INPUT_TOKEN'] = 'token'
  process.env['INPUT_FORMAT'] = 'foo'
  expect(() => getInputs()).toThrowError()
})
// test when format is not valid type we throw an error
test('format is missing', () => {
  process.env['INPUT_TOKEN'] = 'token'
  expect(() => getInputs()).toThrowError()
})

// test when token is misisng we throw an error
test('token is missing', () => {
  process.env['INPUT_FORMAT'] = 'csv'
  expect(() => getInputs()).toThrowError()
})
