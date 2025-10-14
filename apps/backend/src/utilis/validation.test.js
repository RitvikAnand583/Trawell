import { describe, it, expect } from 'vitest'
const { validSignUpData } = require('./validation')

describe('backend validation', () => {
  it('accepts valid data', () => {
    const req = { body: { firstName: 'John', age: 25, emailId: 'john@example.com', password: 'StrongP@ss1' } }
    expect(() => validSignUpData(req)).not.toThrow()
  })

  it('throws structured error on missing fields', () => {
    const req = { body: { age: 17, emailId: 'bademail', password: 'weak' } }
    try {
      validSignUpData(req)
      throw new Error('should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
      expect(err.name).toBe('ValidationError')
      expect(err.errors).toBeTruthy()
      expect(err.errors.firstName).toBeDefined()
      expect(err.errors.emailId).toBeDefined()
      expect(err.errors.password).toBeDefined()
    }
  })
})
