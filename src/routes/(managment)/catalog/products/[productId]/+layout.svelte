<script lang="ts">
    import TabSelector from '$lib/TabSelector.svelte';
    import { viewTitleStore } from "$lib/shared/stores/workerStore";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;
    // export let form: ActionData;

    let tabs = {
        "Detail": {
            url: `/catalog/products/${data.product?.productId}/detail`,
        },
        "Varianty": {
            url: `/catalog/products/${data.product?.productId}/variants`,
        } ,   
        "Ceny": {
            url: `/catalog/products/${data.product?.productId}/prices`,
        },
        "Slevy": {
            url: `/catalog/products/${data.product?.productId}/discounts`,
            disabled: true
        }
    };

    viewTitleStore.set({
        title: `Produkt ${data.product?.productId}`,
        showBackArrow: true
    });
    // goto(tabs["Varianty"].url);
    // console.log(data);
</script>

<TabSelector {tabs}/>

<slot></slot>
