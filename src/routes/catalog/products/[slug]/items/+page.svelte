<script lang="ts">
    import type { PageData } from '../$types';
    import SortedListView from '$lib/SortedListView.svelte';

    export let data: PageData;
   

    data.itemsDisplayData.forEach(item => console.log(item));

    function addPriceToItem(id: number) {
        
    }

    function removeItems(selected: (string | number)[]) {
        
    }
</script>

<SortedListView
    data={data.itemsDisplayData} 
    schema={[
        {fieldName: "fullId", type: "number", columnHeader: "ID" },
        {fieldName: "subname", type: "string", columnHeader: "Název" },
        {fieldName: "priceStrs", type: "selector", columnHeader: "Ceny",
            props: {
                selectorOnAdd: addPriceToItem, 
                selectorIdField: "itemId",
                deleteEndpoint: "?/removeItemPrice"}},
        {fieldName: "stock", type: "unsortable", columnHeader: "Naskladněno" },
    ]}
    buttons={{
        "Přidat": {
            action: () => {},
            icon: "plus",
            color: "green"
        },
    }}
    removeButton={true}
    onRemovePressed={removeItems}
    idFieldName="itemId"
/>
