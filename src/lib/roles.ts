export type StaffRole = 'admin' | 'editor' | 'contributor';

export const STAFF_ROLES: StaffRole[] = ['admin', 'editor', 'contributor'];

export interface StaffAccess {
  roles: StaffRole[];
  isStaff: boolean;
  /** Can move content to published/scheduled. */
  isPublisher: boolean;
  isAdmin: boolean;
}

/**
 * Pure role resolver. Roles must always originate from the database —
 * this only derives capabilities from an already server-verified list.
 */
export function computeStaffAccess(rawRoles: unknown): StaffAccess {
  const roles = (Array.isArray(rawRoles) ? rawRoles : [])
    .filter((r): r is StaffRole => STAFF_ROLES.includes(r as StaffRole));
  return {
    roles,
    isStaff: roles.length > 0,
    isPublisher: roles.includes('admin') || roles.includes('editor'),
    isAdmin: roles.includes('admin'),
  };
}

/** Can this role set publish (as opposed to only drafting) content? */
export function canPublish(access: StaffAccess) {
  return access.isPublisher;
}

/** Contributors may only edit their own drafts. */
export function canEditItem(
  access: StaffAccess,
  item: { author_id?: string | null; status?: string },
  userId: string | null
) {
  if (!access.isStaff) return false;
  if (access.isPublisher) return true;
  return !!userId && item.author_id === userId && item.status !== 'published';
}
