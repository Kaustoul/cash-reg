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

<style lang="scss">
    @import '../../../../styles.scss';

    .action-bar {
        display: flex; 
        justify-content: space-between;

        gap: .7rem;
        width: 100%;
        margin-bottom: 1rem;
    }

    $search-bar-height: 3.5rem;
    .search-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $medium-radius;
        width: 75%;
        height: $search-bar-height;
        background-color: $primary-color;
        padding-left: 1rem;
    }

    input[type="search"] {
        padding: 0.5rem;
        width: 100%;
        background-color: $primary-color;
        border: none;
        margin-right: .5rem;
        color: $text-color;
        font-size: larger;
    }

    input[type="search"]:focus {
        border: none;
        outline: none;
    }

    .green {
        background-color: $accent-color;
    }

    .red {
        background-color: $red;
    }
</style>