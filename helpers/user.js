export const STATUS_ACTIVE = 'active';
export const STATUS_BLOCKED = 'blocked';

export function isAdmin (userRole) {
  return userRole === 'GA' || userRole === 'CA' || userRole === 'TAA';
}

export function isCompanyAdminOrUser (userRole) {
  return userRole === 'CA' || userRole === 'CU';
}

export function isCompanyUser (userRole) {
  return userRole === 'CU';
}

export function isCompanyAdmin (userRole) {
  return userRole === 'CA';
}

export function isTravelAgent (userRole) {
  return userRole === 'TA';
}

export function isTravelAgencyAdmin (userRole) {
  return userRole === 'TAA';
}

export function isGlobalAdmin (userRole) {
  return userRole === 'GA';
}
