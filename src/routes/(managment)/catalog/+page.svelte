<script lang="ts">
    import { goto } from '$app/navigation';
   
    import ImportItemsModal from '$lib/componenets/modals/ImportItemsModal.svelte';
    import SortedListView from "$lib/SortedListView.svelte";
    import TabSelector from '$lib/TabSelector.svelte';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import type { ActionData, PageData } from './$types';

	export let data: PageData;
    export let form: ActionData

    let tabs = {
        "Produkty": {
            url: "/catalog"
        }, 
        "Kategorie": {
            url: "/catalog/categories",
            disabled: true
        }
    };

    function removeProducts(selected: (string | number)[]) {
        console.log(selected);
    }
    
    let showImportModal = false;

    $: if (form?.success) {
       alert(`${form.count} produktů bylo úspěšně importovány`); 
    }
 
    $: if (form?.error) {
        alert(`Chyba při importu: ${form.error}`);
    }

</script>

<ImportItemsModal bind:showModal={showImportModal}/>

<ViewTitle title="Katalog"/>
<TabSelector {tabs}/>
<SortedListView 
    data={data.displayInfo} 
    schema={[
        {fieldName: "fullId", type: "number", columnHeader: "ID" },
        {fieldName: "name", type: "string", columnHeader: "Název" },
        {fieldName: "prices", type: "number", columnHeader: "Cena" },
        {fieldName: "stock", type: "unsortable", columnHeader: "Na skladě" },
    ]}
    clickableRows={true}
    idFieldName="productId"
    onRowClick={(id) => goto(`/catalog/products/${id}`) }
    showSearchBar={true}
    buttons={{
        "Přidat": {
            action: () => {},
            icon: "plus",
            color: "green"
        },
        "Import CSV": {
            action: () => showImportModal = true,
            icon: "import",
            color: "blue"
        }
     }}
    removeButton={true}
    onRemovePressed={removeProducts}
/>

<style lang="scss">
</style>
