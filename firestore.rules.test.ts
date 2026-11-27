// Verification specification for Dirty Dozen payloads against firestore.rules
export const DIRTY_DOZEN_CASES = [
  { name: 'Shadow field injection on listing', expected: 'PERMISSION_DENIED' },
  { name: 'Unverified email spoofing as owner', expected: 'PERMISSION_DENIED' },
  { name: 'Oversized or invalid document ID', expected: 'PERMISSION_DENIED' },
  { name: 'Unauthenticated list on /orders PII', expected: 'PERMISSION_DENIED' },
  { name: 'Public order creation with Verified & Paid status', expected: 'PERMISSION_DENIED' },
  { name: 'Team member creating another team member or deleting listing', expected: 'PERMISSION_DENIED' },
  { name: 'Unauthenticated read of unpublished draft listing', expected: 'PERMISSION_DENIED' },
  { name: 'Non-owner updating /settings/public', expected: 'PERMISSION_DENIED' },
  { name: 'Listing array exceeding 30 items', expected: 'PERMISSION_DENIED' },
  { name: 'Oversized description string (>10000 chars)', expected: 'PERMISSION_DENIED' },
  { name: 'Public list query on /orderStatuses', expected: 'PERMISSION_DENIED' },
  { name: 'Public update on /orders or /orderStatuses', expected: 'PERMISSION_DENIED' }
] as const;
