<script lang="ts">
    import NewConditionModal from '$lib/componenets/modals/NewConditionModal.svelte';
    import SortedListView from "$lib/SortedListView.svelte";
    import NewPriceModal from '$lib/componenets/modals/PriceModal.svelte';
    import type { PageData } from '../$types.js';
    import { invalidate, invalidateAll } from '$app/navigation';
    import { formatConditionStrs } from '$lib/shared/utils/condition-utils.js';
    
    export let data: PageData;
    let pricesData: {
        value: string,
        conditionStrs: string[],
        currency: string,
        idx: number
    }[] = []
    let justClickedIdx: number = 0;

    let showModal = {
        "newcondition": false,
        "newprice": false,
    };
    function openModal(key: "newcondition" | "newprice") {
        showModal[key] = true;
    }

    let selected: [] = [];
    
    $: {
        pricesData = [];
        for (let i = 0; i < data.product.prices.length; i++) {
            const price = data.product.prices[i];
            pricesData.push({
                value: price.value.value,
                conditionStrs: formatConditionStrs(price.conditions, data.product.units),
                idx: i,
                currency: price.value.currency
            });
        }
    }
    
    async function removePrices(selected: (string | number)[]) {
        selected = selected as number[];
		const data = new FormData();
        data.set("idxs", selected.join(","));
		const response = await fetch("?/removePrice", {
			method: 'POST',
			body: data,
		});

        selected = [];
        invalidateAll();
    }
</script>


<NewConditionModal
    bind:showModal={showModal["newcondition"]}
    bind:priceIdx={selected[0]}
    units={data.product.units}
/>

<NewPriceModal
    bind:showModal={showModal["newprice"]}
    units={data.product.units}
/>

<SortedListView
    data={pricesData}
    bind:selected
    schema={[
        {fieldName: "currency", type: "string", columnHeader: "Měna" },
        {fieldName: "value", type: "string", columnHeader: "Cena" },
        {fieldName: "conditionStrs", type: "selector", columnHeader: "Podmínky",
            props: {maxSelectorItems: 1, selectorOnAdd: (props) => { justClickedIdx = props.id; openModal("newcondition")},
                deleteEndpoint: "?/removePriceCondition"
            }
        },
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
