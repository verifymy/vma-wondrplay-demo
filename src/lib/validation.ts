const E164_REGEX = /^\+[1-9]\d{1,14}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidE164(phone: string): boolean {
  return E164_REGEX.test(phone);
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isValidRegion(region: string): region is "US" | "UK" | "FR" {
  return ["US", "UK", "FR"].includes(region);
}
