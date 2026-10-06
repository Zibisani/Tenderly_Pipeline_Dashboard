export function normalisePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00267')) digits = digits.slice(5);
  else if (digits.startsWith('0267')) digits = digits.slice(4);
  else if (digits.startsWith('267')) digits = digits.slice(3);
  else if (digits.startsWith('00')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 8) return digits;
  return null;
}
export function phonesMatch(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  const normA = normalisePhone(a);
  const normB = normalisePhone(b);
  return normA !== null && normB !== null && normA === normB;
}
export function formatPhoneDisplay(normalised: string): string {
  if (normalised.length !== 8) return normalised;
  return +267   ;
}
export function buildWaLink(normalised: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return https://wa.me/267?text=;
}
