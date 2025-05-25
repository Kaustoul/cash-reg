
export type PermissionLeaf = { name: string; description: string };
export type PermissionTree = { [key: string]: PermissionTree | PermissionLeaf };

export const PERMISSIONS : PermissionTree = {
    "tabs": {
        "users": {
            "view": {
                name: "View Users Tabs",
                description: "Allows viewing the list of users tab.",
            }
        },

        "catalog": {
            "view": {
                name: "View Catalog Tabs",
                description: "Allows viewing the catalog tab.",
            }
        },

        "tills": {
            "admin": {
                name: "Administer Access to Tills Tabs",
                description: "Allows admin buttons within the tills.",
            },

            "view": {
                name: "View Tills Tabs",
                description: "Allows viewing the tills tab.",
            }
        }


    }
} as const;