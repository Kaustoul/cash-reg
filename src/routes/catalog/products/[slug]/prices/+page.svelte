<script lang="ts">
    import { replaceState } from '$app/navigation';
    import NewConditionModal from '$lib/componenets/modals/NewConditionModal.svelte';
    import SortedListView from "$lib/SortedListView.svelte";
    import type { PageData } from '../$types.js';
    
    export let data: PageData;
    export let form: FormData;
    let showModal = false;

    let currentPriceIdx = -1;
    function openModal(props: { [key: string]: any }) {
        showModal = true;
        currentPriceIdx = props.id;
    }
    console.log(data.prices)
</script>


<NewConditionModal
    bind:showModal
    units={data.units}
/>

<SortedListView
    data={data.prices} 
    schema={[
        {fieldName: "value", type: "string", columnHeader: "Cena" },
        {fieldName: "conditionStr", type: "selector", columnHeader: "Podmínky",
            props: {maxSelectorItems: 1, selectorOnAdd: openModal, deleteEndpoint: "?/deleteAllPriceConditions"}},
        {fieldName: "currency", type: "string", columnHeader: "Měna" },
    ]}
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
