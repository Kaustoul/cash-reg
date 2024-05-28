<script lang="ts">
    import type { PageData } from '../$types';
    import SortedListView from '$lib/SortedListView.svelte';
    import { Price } from '$lib/shared/prices/price';

    export let data: PageData;
    const prices = [];
    for (const priceData of data.prices) {
        const price = Price.fromJSON(priceData);
        prices.push(price);
    }

    const parsedData = {...data, prices: prices};
    
    const listData: {[key: string]: any}[] = [];
    for (const item of parsedData.items) {
        const priceStrs = [];
        for (const priceIdx of item.priceIndexes) {
            const price = parsedData.prices[priceIdx];
            priceStrs.push(price.toString());
        }

        listData.push({
            fullId: item.fullId,
            subname: item.subname,
            priceStrs: priceStrs,
            stock: item.stock,
        });
    }

    console.log(data);
    console.log(parsedData);
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
