<script lang="ts">
    import { goto } from '$app/navigation';
   
    import ImportItemsModal from '$lib/componenets/modals/ImportItemsModal.svelte';
    import SortedListView from "$lib/SortedListView.svelte";
    import TabSelector from '$lib/TabSelector.svelte';
    import type { ActionData, PageData } from './$types';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';
    import AlertModal from '$lib/componenets/modals/AlertModal.svelte';

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
    
    let showImportModal = false;
    let showNewProductAlert = false;

    $: if (form?.success) {
       alert(`${form.count} produktů bylo úspěšně importovány`); 
    }
 
    $: if (form?.error) {
        alert(`Chyba při importu: ${form.error}`);
    }

    async function newProduct() {
        showNewProductAlert = false;

        const res = await fetch('/api/products/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!res.ok) {
            const error = await res.json();
            alert(`Chyba při vytváření produktu: ${error.message}`);
            return;
        }

        
        const resJson = await res.json();
        if (!resJson.productId) {
            alert("Chyba při vytváření produktu: Produkt ID nebylo vráceno.");
            return;
        }


        goto(`/catalog/products/${resJson.productId}/detail?edit=1`);
    }

</script>

<ImportItemsModal bind:showModal={showImportModal}/>
<AlertModal 
    message="Opravdu chcete vytvořit nový produkt?" 
    onConfirm={newProduct} 
    bind:showModal={showNewProductAlert}
/>

<TabSelector {tabs}/>
<SortedListView 
    data={data.products} 
    schema={[
        {fieldName: "productId", type: "number", columnHeader: "ID" },
        {fieldName: "name", type: "string", columnHeader: "Název" },
        {fieldName: "units", type: "number", columnHeader: "Unit" },
    ]}
    clickableRows={true}
    idFieldName="productId"
    onRowClick={(id) => goto(`/catalog/products/${id}/detail`) }
    selectors={false}
    removeButton={false}
    showSearchBar={true}
    buttons={{
        "Přidat": {
            action: () => showNewProductAlert = true,
            icon: "plus",
            color: "green"
        },
        "Import CSV": {
            action: () => showImportModal = true,
            icon: "import",
            color: "blue"
        }
     }}
    customSearchKeys={['name', 'subnames', 'productId', 'fullId']}
    grayRowOn={(row) => row['status'] === 'archived' || row['status'] === 'draft'}
/>

<style lang="scss">
</style>
