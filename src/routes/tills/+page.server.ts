import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const res = {}

    return {tills: res};
}
