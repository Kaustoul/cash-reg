<script lang="ts">
    import { goto } from "$app/navigation";
    import TabSelector from '$lib/TabSelector.svelte';
    import ViewTitle from "$lib/ViewTitle.svelte";
    import type { ActionData, PageData } from "./$types";

    export let data: PageData;
    export let form: ActionData;

    let tabs = {
        "Varianty": {
            url: `/catalog/products/${data.productId}/items`,
        } ,   
        "Ceny": {
            url: `/catalog/products/${data.productId}/prices`,
        },
        "Slevy": {
            url: `/catalog/products/${data.productId}/discounts`,
            disabled: true
        }
    };


    // goto(tabs["Varianty"].url);
    // console.log(data);
</script>

<ViewTitle title={data.displayName} subtitle={`(${data.displayId})`} showBackArrow={true}/>
<TabSelector {tabs}/>

<slot></slot>
