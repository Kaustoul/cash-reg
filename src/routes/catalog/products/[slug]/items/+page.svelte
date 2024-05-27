<script lang="ts">
    import type { PageData } from '../$types';
    import SortedListView from '$lib/SortedListView.svelte';

    export let data: PageData;
    
    const listData = data.items.map((item) => {
        return {
            ...item,
            priceStrs: data.itemPriceStrs[item.id]
        }
    });
    console.log(data);
    console.log(listData);

    function addPriceToItem(id: number) {
        
    }

    function removeItems(selected: (string | number)[]) {
        console.log(selected);
    }
</script>

<SortedListView
    data={listData} 
    schema={[
        {fieldName: "fullId", type: "number", columnHeader: "ID" },
        {fieldName: "subname", type: "string", columnHeader: "Název" },
        {fieldName: "priceStrs", type: "selector", columnHeader: "Ceny",
            props: {selectorOnAdd: addPriceToItem, deleteEndpoint: undefined}},
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
/>
