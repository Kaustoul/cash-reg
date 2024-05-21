<script lang="ts">
    import { goto } from '$app/navigation';
    import SortedList from '$lib/componenets/interactables/SortedList.svelte';
    import MagnifyIcon from 'svelte-material-icons/Magnify.svelte';
    import PlusIcon from 'svelte-material-icons/Plus.svelte';
    import DeleteIcon from 'svelte-material-icons/Delete.svelte';
    import TabSelector from '$lib/TabSelector.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
    let search = '';

    // @ts-ignore
    function handleFocus(event) {
        event.target.select();
    }

    let tabs = ["Produkty", "Kategorie"];
    let selectedTab = tabs[0];
</script>


<div class="viewName"><b>Katalog</b></div>
<TabSelector {tabs} bind:selectedTab={selectedTab}/>
{#if selectedTab === "Produkty"}
<div class="action-bar">
    <div class="search-bar">
        <MagnifyIcon size="2rem" />
        <input bind:value={search} on:focus={handleFocus} type="search" placeholder="Search..." />
    </div>
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
    onRowClick={(productId) => goto(`/catalog/product/${productId}`)}
/>
{/if}
{#if selectedTab === "Kategorie"}
    N/A
{/if}


<style lang="scss">
    @import '../../styles.scss';
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

    .btn {
        height: auto;
        width: 10rem;
    }

    .green {
        background-color: $accent-color;
    }

    .red {
        background-color: $red;
    }
</style>