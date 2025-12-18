// Input validation utilities
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateRequired(value: any, fieldName: string): void {
  if (value === null || value === undefined || value === "") {
    throw new ValidationError(`${fieldName} is required`, fieldName)
  }
}

export function validateLength(value: string, min: number, max: number, fieldName: string): void {
  if (value.length < min) {
    throw new ValidationError(`${fieldName} must be at least ${min} characters`, fieldName)
  }
  if (value.length > max) {
    throw new ValidationError(`${fieldName} must be no more than ${max} characters`, fieldName)
  }
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateJSON(value: string): boolean {
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential XSS characters
    .slice(0, 10000) // Limit length
}

export function validateAgentConfig(config: Record<string, any>): void {
  if (config.temperature !== undefined) {
    const temp = Number(config.temperature)
    if (isNaN(temp) || temp < 0 || temp > 2) {
      throw new ValidationError("Temperature must be between 0 and 2", "temperature")
    }
  }

  if (config.maxTokens !== undefined) {
    const tokens = Number(config.maxTokens)
    if (isNaN(tokens) || tokens < 1 || tokens > 128000) {
      throw new ValidationError("Max tokens must be between 1 and 128000", "maxTokens")
    }
  }
}
