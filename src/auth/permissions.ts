import { createAccessControl } from 'better-auth/plugins/access';
import {
  adminAc as defaultGlobalAdminAc,
  defaultStatements as defaultGlobalStatements,
  userAc as defaultGlobalUserAc,
} from 'better-auth/plugins/admin/access';
import {
  adminAc as defaultOrgAdminAc,
  defaultStatements as defaultOrgStatements,
  memberAc as defaultOrgMemberAc,
  ownerAc as defaultOrgOwnerAc,
} from 'better-auth/plugins/organization/access';

export const globalAc = createAccessControl({
  ...defaultGlobalStatements,
  instance: ['create'],
});

export const globalAdmin = globalAc.newRole({
  ...defaultGlobalAdminAc.statements,
});

export const globalUser = globalAc.newRole({
  ...defaultGlobalUserAc.statements,
});

export const orgAc = createAccessControl({
  ...defaultOrgStatements,
});

export const orgOwner = orgAc.newRole({
  ...defaultOrgOwnerAc.statements,
});

export const orgAdmin = orgAc.newRole({
  ...defaultOrgAdminAc.statements,
});

export const orgMember = orgAc.newRole({
  ...defaultOrgMemberAc.statements,
});
