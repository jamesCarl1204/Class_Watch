const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email.trim()) return 'Please enter your institutional email';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email';
  return '';
}

export function validatePassword(password, { min = 0 } = {}) {
  if (!password) return 'Please enter your password';
  if (min && password.length < min) return `Password must be at least ${min} characters`;
  return '';
}
