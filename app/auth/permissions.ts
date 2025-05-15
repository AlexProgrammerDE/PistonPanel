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
  organization: ['create'],
});

export const globalUser = globalAc.newRole({
  ...defaultGlobalUserAc.statements,
});

export const globalAdmin = globalAc.newRole({
  ...globalUser.statements,
  ...defaultGlobalAdminAc.statements,
  organization: ['create'],
});

export const globalRoleConfig = {
  admin: globalAdmin,
  user: globalUser,
};

export const orgAc = createAccessControl({
  ...defaultOrgStatements,
  server: ['create', 'update', 'delete'],
});

export const orgMember = orgAc.newRole({
  ...defaultOrgMemberAc.statements,
});

export const orgAdmin = orgAc.newRole({
  ...orgMember.statements,
  ...defaultOrgAdminAc.statements,
  server: ['create', 'update', 'delete'],
});

export const orgOwner = orgAc.newRole({
  ...orgAdmin.statements,
  ...defaultOrgOwnerAc.statements,
});

export const orgRoleConfig = {
  owner: orgOwner,
  admin: orgAdmin,
  member: orgMember,
};
