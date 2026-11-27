# Elvora Vision Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Default Deny**: All unmatched Firestore paths are explicitly denied (`allow read, write: if false`).
2. **Verified Admin & Team Identity**:
   - Owners (`smartdeveloper125@gmail.com`, `umairkamboh953@gmail.com`) require `request.auth != null && request.auth.token.email_verified == true`.
   - Invited Team Members require a matching verified email document in `/teamMembers/{memberId}` and are strictly blocked from all `delete` operations and from managing `/teamMembers`, `/orders`, `/inquiries`, and `/settings`.
3. **PII Isolation**:
   - `/orders/{orderNumber}` and `/inquiries/{inquiryId}` contain PII (`email`, `phone`, `customerName`) and can ONLY be read/listed/updated/deleted by verified Owners.
   - Public order tracking uses `/orderStatuses/{orderNumber}` which omits customer PII and forbids `list` queries (`allow list: if false`).
   - Public `create` on `/orders/{orderNumber}` requires an atomic synchronous `orderStatuses/{orderNumber}` creation (`existsAfter`) and strict initial status (`paymentStatus == 'Pending Verification'`, `deliveryStatus == 'Preparing Package'`).
4. **No O(n) Lookups in `list` Rules**: `allow list` never invokes `get()` or `exists()`.
5. **Strict Schema & Bounds**: Every write validates `isValidId()` and `isValid[Entity](incoming())` with strict `keys().hasAll(...)`, `keys().hasOnly(...)`, type checks, and string/array length limits.

## 2. Dirty Dozen Adversarial Payloads
1. **Shadow Field Injection on Listing**: Adding `{ isVerifiedAdmin: true }` to `/listings/web-99` -> Rejected by `keys().hasOnly(...)`.
2. **Unverified Email Spoofing**: Authenticated user with `email: 'smartdeveloper125@gmail.com'` and `email_verified: false` -> Rejected by `email_verified == true`.
3. **Oversized ID Poisoning**: Creating `/listings/<200-char-id>` or `/listings/bad$id` -> Rejected by `isValidId()`.
4. **PII Order Scraping**: Unauthenticated or non-owner `list` on `/orders` or `/inquiries` -> Rejected (`PERMISSION_DENIED`).
5. **Public Order Auto-Approval**: Public `create` on `/orders/ORD-1` with `paymentStatus: 'Verified & Paid'` -> Rejected (`paymentStatus == 'Pending Verification'` enforced).
6. **Privilege Escalation via Team Member**: Team member attempting to `create` in `/teamMembers` or `delete` in `/listings` -> Rejected (Owner-only).
7. **Unpublished Draft Leak**: Unauthenticated `get` or `list` on `/listings` where `published == false` -> Rejected.
8. **Settings Tampering by Non-Owner**: Team member or visitor updating `/settings/public` -> Rejected.
9. **Array Resource Exhaustion**: Listing with 500 elements in `techStack` or `screenshots` -> Rejected by `.size() <= 30`.
10. **String Oversize Attack**: FAQ or Inquiry with 50,000 char payload -> Rejected by string `.size()` limits.
11. **Order Status Enumeration**: Public `list` on `/orderStatuses` -> Rejected (`allow list: if false`).
12. **Terminal Order Hijack**: Public `update` on `/orders/ORD-1` or `/orderStatuses/ORD-1` -> Rejected (`allow update: if isOwner()`).
