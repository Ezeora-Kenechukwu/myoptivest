export const can = (model, permission, permissions) => {
    // Find the object where permission_name matches the provided model
    const modelPermissions = permissions.find(p => p.model === model);

    // If no matching model is found, return false
    if (!modelPermissions) return false;

    // Check if the requested permission exists and is truthy (1 or true)
    return !!modelPermissions[permission];
};
