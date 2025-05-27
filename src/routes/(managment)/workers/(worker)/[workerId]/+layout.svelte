<script lang="ts">
    import type { LayoutData } from './$types';
    import TabSelector from '$lib/TabSelector.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: LayoutData;

    const tabs = {
        "Informace": {
            url: `/workers/${data.worker.userId}/detail`,
        },

        "Směny": {
            url: `/workers/${data.worker.userId}/sessions`,
        },

        "Kontroly": {
            url: `/workers/${data.worker.userId}/audits`,
            disabled: true,
        },
    }

</script>

<TabSelector {tabs}/>

<slot></slot>