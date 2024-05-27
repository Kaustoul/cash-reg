<script lang="ts">
    import NewConditionModal from '$lib/componenets/modals/NewConditionModal.svelte';
    import SortedListView from "$lib/SortedListView.svelte";
    import NewPriceModal from '$lib/componenets/modals/PriceModal.svelte';
    import type { PageData } from '../$types.js';
    import { invalidateAll } from '$app/navigation';
    
    export let data: PageData;
    let showModal = {
        "newcondition": false,
        "newprice": false,
    };
    function openModal(key: "newcondition" | "newprice") {
        showModal[key] = true;
    }

    async function removePrices(selected: (string | number)[]) {
        selected = selected as number[];

		const data = new FormData();
        data.set("idxs", selected.join(","));

		const response = await fetch("?/deletePrice", {
			method: 'POST',
			body: data,
		});

        invalidateAll();
    }

</script>


<NewConditionModal
    bind:showModal={showModal["newcondition"]}
    units={data.units}
/>

<NewPriceModal
    bind:showModal={showModal["newprice"]}
    units={data.units}
/>

<SortedListView
    data={data.prices} 
    schema={[
        {fieldName: "value", type: "string", columnHeader: "Cena" },
        {fieldName: "conditionStr", type: "selector", columnHeader: "Podmínky",
            props: {maxSelectorItems: 1, selectorOnAdd: () => openModal("newcondition"), deleteEndpoint: "?/deleteAllPriceConditions"}},
{fieldName: "currency", type: "string", columnHeader: "Měna" },
    ]}
    buttons={{
        "Přidat": {
            action: () => openModal("newprice"),
            icon: "plus",
            color: "green"
        },
    }}
    removeButton={true}
    onRemovePressed={removePrices}
/>
