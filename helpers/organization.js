export const TYPE_AGENCY = 'agency';
export const TYPE_COMPANY = 'organization';

export const STATUS_ACTIVE = 'active';
export const STATUS_BLOCKED = 'blocked';

export function isBlocked (organization) {
  return (
    organization &&
    Object.prototype.hasOwnProperty.call(organization, 'status') &&
    organization.status === STATUS_BLOCKED
  );
}

export function isActive (organization) {
  return (
    organization &&
    (
      !Object.prototype.hasOwnProperty.call(organization, 'status') ||
      Object.prototype.hasOwnProperty.call(organization, 'status') && organization.status === STATUS_ACTIVE)
  );
}
