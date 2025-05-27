<script lang="ts">
    import { goto } from '$app/navigation';
   
    import ImportItemsModal from '$lib/componenets/modals/ImportItemsModal.svelte';
    import SortedListView from "$lib/SortedListView.svelte";
    import TabSelector from '$lib/TabSelector.svelte';
    import type { ActionData, PageData } from './$types';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

	export let data: PageData;
    export let form: ActionData

    viewTitleStore.set({
        title: "Katalog",
    });

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
        // console.log(selected);
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
        "Upravit": {
            action: () => {},
            icon: "import",
            color: "yellow"
        },
        "Import CSV": {
            action: () => showImportModal = true,
            icon: "import",
            color: "blue"
        }
     }}
    removeButton={true}
    onRemovePressed={removeProducts}
    customSearchKeys={['name', 'subnames', 'productId', 'fullId']}
/>

<style lang="scss">
</style>
