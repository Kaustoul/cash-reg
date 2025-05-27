<script lang="ts">
    import type { LayoutData } from './$types';
    import TabSelector from '$lib/TabSelector.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: LayoutData;

    const tabs = {
        "Informace": {
            url: `/customers/${data.customer.customerId}/detail`,
        },
        "Objednávky": {
            url: `/customers/${data.customer.customerId}/orders`,
        },
    }
    
    viewTitleStore.set({
        title: `Zákazník: ${data.customer.customerId}`,
        showBackArrow: true,
    });

</script>

<TabSelector {tabs} />

<slot></slot>