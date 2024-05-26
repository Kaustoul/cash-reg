<script lang="ts">
    import { goto } from '$app/navigation';
    
    import SortedListView from "$lib/SortedListView.svelte";
    import TabSelector from '$lib/TabSelector.svelte';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import type { PageData } from './$types';

	export let data: PageData;

    let tabs = {
        "Produkty": {
            url: "/catalog"
        }, 
        "Kategorie": {
            url: "/catalog/categories",
            disabled: true
        }
    };
</script>


<ViewTitle title="Katalog"/>
<TabSelector {tabs}/>
<SortedListView 
    data={data.products} 
    schema={[
        {fieldName: "id", type: "number", columnHeader: "ID" },
        {fieldName: "name", type: "string", columnHeader: "Název" },
        {fieldName: "status", type: "unsortable", columnHeader: "Status" },
        {fieldName: "prices", type: "number", columnHeader: "Cena" },
        {fieldName: "stock", type: "unsortable", columnHeader: "Na skladě" },
    ]}
    clickableRows={true}
    idFieldName="productId"
    onRowClick={(productId) => goto(`/catalog/products/${productId}`)}
    showSearchBar={true}
    buttons={{
        "Přidat": {
            action: () => {},
            icon: "plus",
            color: "green"
        },
        "Smazat": {
            action: () => {},
            icon: "delete",
            color: "red"
        },
    }}
/>


<!-- <style lang="scss">
</style> -->
