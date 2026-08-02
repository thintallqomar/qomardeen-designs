import { describe, expect, it } from 'vitest';
import { computeStaffAccess, canPublish, canEditItem } from '@/lib/roles';

describe('admin trust checks', () => {
  it('grants full access to admins', () => {
    const a = computeStaffAccess(['admin']);
    expect(a).toMatchObject({ isStaff: true, isPublisher: true, isAdmin: true });
    expect(canPublish(a)).toBe(true);
  });

  it('lets editors publish but not act as admin', () => {
    const a = computeStaffAccess(['editor']);
    expect(a).toMatchObject({ isStaff: true, isPublisher: true, isAdmin: false });
  });

  it('lets contributors draft only', () => {
    const a = computeStaffAccess(['contributor']);
    expect(a).toMatchObject({ isStaff: true, isPublisher: false, isAdmin: false });
    expect(canPublish(a)).toBe(false);
  });

  it('treats unknown or spoofed roles as no access', () => {
    for (const spoof of [['superadmin'], ['user'], ['ADMIN'], [null], 'admin', undefined, {}]) {
      const a = computeStaffAccess(spoof);
      expect(a.isStaff).toBe(false);
      expect(a.isAdmin).toBe(false);
      expect(a.isPublisher).toBe(false);
    }
  });

  it('lets contributors edit only their own unpublished work', () => {
    const contributor = computeStaffAccess(['contributor']);
    expect(canEditItem(contributor, { author_id: 'u1', status: 'draft' }, 'u1')).toBe(true);
    expect(canEditItem(contributor, { author_id: 'u2', status: 'draft' }, 'u1')).toBe(false);
    expect(canEditItem(contributor, { author_id: 'u1', status: 'published' }, 'u1')).toBe(false);
    // Editors may edit anything.
    expect(canEditItem(computeStaffAccess(['editor']), { author_id: 'u2', status: 'published' }, 'u1')).toBe(true);
    // Signed-out visitors never can.
    expect(canEditItem(computeStaffAccess([]), { author_id: 'u1', status: 'draft' }, 'u1')).toBe(false);
  });
});
