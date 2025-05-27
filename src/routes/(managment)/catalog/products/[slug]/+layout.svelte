<script lang="ts">
    import TabSelector from '$lib/TabSelector.svelte';
    import type { ActionData, PageData } from "./$types";
    import { viewTitleStore } from "$lib/shared/stores/workerStore";

    export let data: PageData;
    export let form: ActionData;

    let tabs = {
        "Varianty": {
            url: `/catalog/products/${data.product.productId}/items`,
        } ,   
        "Ceny": {
            url: `/catalog/products/${data.product.productId}/prices`,
        },
        "Slevy": {
            url: `/catalog/products/${data.product.productId}/discounts`,
            disabled: true
        }
    };

    viewTitleStore.set({
        title: data.displayData.name,
        subtitle: `(${data.displayData.id})`,
        showBackArrow: true
    });
    // goto(tabs["Varianty"].url);
    // console.log(data);
</script>

<TabSelector {tabs}/>

<slot></slot>
