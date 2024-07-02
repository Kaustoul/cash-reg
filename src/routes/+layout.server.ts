import { settings } from "$lib/shared/utils/settings-utils";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
    return {
        settings: settings
    }
}
