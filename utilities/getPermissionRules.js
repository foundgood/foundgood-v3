// Data
import { d as create } from 'utilities/configuration/create';
import { d as initiative } from 'utilities/configuration/initiative';
import { d as report } from 'utilities/configuration/report';

const dictionary = {
    initiative,
    create,
    report,
};

// Get permissions
function getPermissionRules(context, path, permissionObject) {
    if (context && path && permissionObject) {
        return (
            dictionary?.[context]?.[path]?.permissions?.[permissionObject] ?? []
        );
    }
    return [];
}

export default getPermissionRules;
