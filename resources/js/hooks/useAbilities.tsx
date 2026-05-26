import { useMemo, useCallback } from 'react';
import { usePage } from '@inertiajs/react';


// Define the Abilities type
export type Abilities = {
  can_create: boolean;
  can_edit: boolean;
  can_view: boolean;
  can_delete: boolean;
  can_forceDelete: boolean;
  can_index: boolean;
  can_store: boolean;
  can_approve: boolean;
  can_restore: boolean;
  can_indexTrash: boolean;
  can_viewTrash: boolean;
  can_assign: boolean;
  can_update: boolean;
  can_join: boolean;
  can_pin: boolean;
  can_share: boolean;
  can_copy: boolean;
  can_download: boolean;
  can_preview: boolean;
  can_upload: boolean;
};

// Define a Permission type
export type Permission = {
  id: number;
  name: string;
  abilities: Abilities;
};

// Define the User type coming from Inertia
export type User = {
  id: number;
  name: string;
  email: string;
  permissions: Permission[];
};

// Hook
export function useAbilities(permissionName: string): {
  abilities: Abilities | null;
  checkAbility: (permissionName: string, ability: keyof Abilities) => boolean;
} {
  const { auth } = usePage<{ auth: { user: User | null, permissions:  Permission[]} }>().props;
console.log(auth)
  const abilities = useMemo(() => {
    if (!auth?.user) return null;

    const permission = auth.permissions.find(
      (permission) => permission.name === permissionName
    );

    return permission ? permission.abilities : null;
  }, [auth?.user, permissionName]);

  const checkAbility = useCallback(
    (targetPermissionName: string, ability: keyof Abilities) => {
      if (!auth?.user) return false;

      const permission = auth.permissions.find(
        (permission) => permission.name === targetPermissionName
      );

      if (!permission) return false;

      return !!permission.abilities[ability];
    },
    [auth?.user]
  );

  return { abilities, checkAbility };
}
