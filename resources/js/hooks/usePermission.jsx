import { usePage } from "@inertiajs/react";
import { useMemo } from "react";

const usePermissions = (model) => {
const {permissions} = usePage().props.auth

// console.log("This permission is from usePermissions",permissions);

  return useMemo(() => {
    // Find the permissions object that matches the provided model
    const modelPermissions = permissions?.find(p => p.model === model);

    // If no matching model is found, return an object with all permissions set to false
    if (!modelPermissions) {
      return {
        can_create: false,
        can_edit: false,
        can_view: false,
        can_delete: false,
        can_forceDelete: false,
        can_index: false,
        can_store: false,
        can_approve: false,
        can_restore: false,
        can_indexTrash: false,
        can_viewTrash: false,
        can_assign: false,
        can_update: false,
        can_join: false,
        can_pin: false,
        can_share: false,
        can_copy: false,
        can_download: false,
        can_preview: false,
        can_upload: false,
      };
    }

    // Return an object with permissions ensuring boolean values
    return {
      can_create: !!modelPermissions.can_create,
      can_edit: !!modelPermissions.can_edit,
      can_view: !!modelPermissions.can_view,
      can_delete: !!modelPermissions.can_delete,
      can_forceDelete: !!modelPermissions.can_forceDelete,
      can_index: !!modelPermissions.can_index,
      can_store: !!modelPermissions.can_store,
      can_approve: !!modelPermissions.can_approve,
      can_restore: !!modelPermissions.can_restore,
      can_indexTrash: !!modelPermissions.can_indexTrash,
      can_viewTrash: !!modelPermissions.can_viewTrash,
      can_assign: !!modelPermissions.can_assign,
      can_update: !!modelPermissions.can_update,
      can_join: !!modelPermissions.can_join,
      can_pin: !!modelPermissions.can_pin,
      can_share: !!modelPermissions.can_share,
      can_copy: !!modelPermissions.can_copy,
      can_download: !!modelPermissions.can_download,
      can_preview: !!modelPermissions.can_preview,
      can_upload: !!modelPermissions.can_upload,
    };
  }, [model, permissions]);
};

export default usePermissions;
