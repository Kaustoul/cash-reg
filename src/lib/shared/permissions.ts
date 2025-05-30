
export type PermissionLeaf = { name: string; description: string };
export type PermissionTree = { [key: string]: PermissionTree | PermissionLeaf };

export const PERMISSIONS : PermissionTree = {
    "tabs": {
        "catalog": {
            "view": {
                name: "View Catalog Tabs",
                description: "Allows viewing the catalog tab.",
            },

            "admin": {
                name: "Administer Access to Catalog Tabs",
                description: "Allows administrating products and items.",
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
        },

        "sales": {
            "view": {
                name: "View Sales Tabs",
                description: "Allows viewing the Sales tab.",
            }
        },

        "customers": {
            "view": {
                name: "View Customers Tabs",
                description: "Allows viewing the Customers tab.",
            }
        },

        "workers": {
            "admin": {
                name: "Administer Access to Workers Tabs",
                description: "Allows administrating of users.",
            },

            "view": {
                name: "View Tills Tabs",
                description: "Allows viewing the Workers tab.",
            }
        }


    }
} as const;