import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword } from './validation'

describe('frontend validation helpers', () => {
  it('validates good emails', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('a.b+tag@sub.domain.co')).toBe(true)
  })

  it('rejects bad emails', () => {
    expect(validateEmail('not-an-email')).toBe(false)
    expect(validateEmail('user@com')).toBe(false)
  })

  it('validates strong passwords', () => {
    expect(validatePassword('Password1')).toBe(true)
    expect(validatePassword('abc12345')).toBe(true)
  })

  it('rejects weak passwords', () => {
    expect(validatePassword('short')).toBe(false)
    expect(validatePassword('password')).toBe(false)
    expect(validatePassword('12345678')).toBe(false)
  })
})
