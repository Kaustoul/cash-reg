<script lang="ts">
    import ViewTitle from '$lib/ViewTitle.svelte';
    import type { LayoutData } from './$types';
    import TabSelector from '$lib/TabSelector.svelte';

    export let data: LayoutData;

    const tabs = {
        "Informace": {
            url: `/workers/${data.worker.userId}/info`,
        },

        "Směny": {
            url: `/workers/${data.worker.userId}/sessions`,
            disabled: true,
        },

        "Kontroly": {
            url: `/workers/${data.worker.userId}/audits`,
            disabled: true,
        },
    }

</script>

<ViewTitle title="Zaměstnanec {data.worker.userId}" showBackArrow={true} />
<TabSelector {tabs}/>

<slot></slot>