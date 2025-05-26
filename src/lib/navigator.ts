
export type Tabs = {
    [key: string]: {
        url: string;
        disabled?: boolean;
        permission?: string;
        icon?: any;
    }
}

export function getDefaultTab(tabs: Tabs): string | undefined {
    for (const tab in tabs) {
        if (!tabs[tab].disabled) {
            return tab;
        }
    }
}

