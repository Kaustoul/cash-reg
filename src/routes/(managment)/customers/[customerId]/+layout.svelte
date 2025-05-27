<script lang="ts">
    import ViewTitle from '$lib/ViewTitle.svelte';
    import type { LayoutData } from './$types';
    import TabSelector from '$lib/TabSelector.svelte';

    export let data: LayoutData;

    const tabs = {
        "Informace": {
            url: `/customers/${data.customer.customerId}/detail`,
        },
        "Objednávky": {
            url: `/customers/${data.customer.customerId}/orders`,
        },
    }
    

</script>

<ViewTitle title={`Zákazník ${data.customer.customerId}`} showBackArrow={true} />

<TabSelector {tabs} />

<slot></slot>