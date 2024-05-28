<script lang="ts">
    import { goto } from '$app/navigation';
    
    import SortedListView from "$lib/SortedListView.svelte";
    import TabSelector from '$lib/TabSelector.svelte';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import type { PageData } from './$types';

	export let data: PageData;

    let tabs = {
        "Pokladny": {
            url: "/tills"
        }, 
        "Kategorie": {
            url: "/tills/currencies",
            disabled: true
        }
    };
</script>


<ViewTitle title="Katalog"/>
<TabSelector {tabs}/>
<SortedListView 
    data={data.tills} 
    schema={[
        {fieldName: "id", type: "number", columnHeader: "ID" },
        {fieldName: "balance", type: "number", columnHeader: "Zůstatek" },
    ]}
    clickableRows={true}
    idFieldName="productId"
    onRowClick={(productId) => goto(`/catalog/products/${productId}`)}
    showSearchBar={true}
/>


