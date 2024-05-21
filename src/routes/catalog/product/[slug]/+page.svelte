<script lang="ts">
    import { enhance } from '$app/forms';

    import SortedList from '$lib/componenets/interactables/SortedList.svelte';
    import PlusIcon from 'svelte-material-icons/Plus.svelte';
    import DeleteIcon from 'svelte-material-icons/Delete.svelte';
    import TabSelector from '$lib/TabSelector.svelte';
    import Modal from '$lib/componenets/interactables/Modal.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
    /** @type {import('./$types').ActionData} */
    export let form;

    let tabs = ["Informace", "Varianty", "Ceny", "Slevy"];
    let selectedTab = tabs[0];
    let showModal = false;

    let currentPriceIdx = -1;
    function openModal(props: { [key: string]: any }) {
        showModal = true;
        currentPriceIdx = props.id;
    }

    // console.log(data);
</script>

<Modal bind:showModal>
    <div slot="header">
        Přidat podmínku
    </div>
    <form method='POST' use:enhance action="?/newCondition">
        <input type="hidden" name="priceIdx" value={currentPriceIdx} />
        <div class="inputs-header">
            <span>
                Množstevní podmínka
            </span>
        </div>
        <div class="inputs">
            <div class="left">
                <input 
                    name="min" 
                    type="number" 
                    class="input-field" 
                    min="0" 
                    step="1" 
                    placeholder="Min"
                />
                <span>{data.units}</span>
            </div>
            <span class="text-between">≤</span>
            <span class="text-between">množství</span>
            <span class="text-between">&lt;</span>
            <div class="right">
                <input 
                    name="max" 
                    type="number" 
                    class="input-field right" 
                    min="0" 
                    step="1" 
                    placeholder="Max"
                />
                {data.units}
            </div>
        </div>
        <div class="footer">
            <button class="btn-primary" on:click={() => showModal = false}>
                Přidat
            </button>
        </div>
    </form>
</Modal>

<div class="viewName"><b>{data.displayName} </b><span class="displayId">({data.displayId})</span></div>
<TabSelector {tabs} bind:selectedTab={selectedTab}/>
{#if selectedTab === "Informace"}
  N/A
{:else if selectedTab === "Varianty"}
<div class="action-bar">
  <div class="btn red disabled">
      <DeleteIcon size="1.7rem" />
      Smazat
  </div>
  <div class="btn green disabled">
      <PlusIcon size="2.2rem" />
      Nový
  </div>
</div>
<SortedList 
  data={data.items} 
  schema={[
    {fieldName: "fullId", type: "number", columnHeader: "ID" },
    {fieldName: "subname", type: "string", columnHeader: "Název" },
    {fieldName: "stock", type: "unsortable", columnHeader: "Naskladněno" },
]}
/>
{:else if selectedTab === "Ceny"}
<div class="action-bar">
<div class="btn red disabled">
    <DeleteIcon size="1.7rem" />
    Smazat
</div>
<div class="btn green disabled">
    <PlusIcon size="2.2rem" />
    Nový
</div>
</div>
<SortedList 
data={data.prices} 
schema={[
    {fieldName: "value", type: "string", columnHeader: "Cena" },
    {fieldName: "conditionStr", type: "selector", columnHeader: "Podmínky",
        props: {maxSelectorItems: 1, selectorOnAdd: openModal, formAction: "?/deleteAllPriceConditions"}},
    {fieldName: "currency", type: "string", columnHeader: "Měna" },
]}
/>
{:else if selectedTab === "Slevy"}
  N/A
{/if}



<style lang="scss">
    @import '../../../../styles.scss';
    .viewName {
        font-size: 5.5rem;
        margin-bottom: 2rem;
    }

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

    .displayId {
        font-size: 2.5rem;
        color: $text2-color;
    }

    .inputs {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: x-large;
        gap: 2rem;
    }

    .inputs-header{
        font-size: xx-large;
        color: $text-color;
        margin-bottom: 1.5rem;
        text-decoration: underline;
    }

    .input-field {
        padding: 0.5rem;
        background-color: $primary-color;
        border: none;
        margin-right: .5rem;
        color: $text-color;
        font-size: x-large;
        width: 5rem;
        
        &:focus {
            border: none;
            outline: none;
        }

        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }

    .text-between {
        margin: 0.5rem;
        color: $text-color;
        font-size: larger;
    }

    .left {
        display: flex;
        justify-content: end;
        align-items: center;
        flex-grow: 0;
    }

    .right {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-grow: 0;
    }

    .footer {
        display: flex;
        justify-content: end;

        .btn-primary {
            margin-top: 1.5rem;
            font-size: x-large;
            height: 3.5rem;
            width: 8rem;
            flex-grow: 0;
        }
    }

    form {

    }
</style>