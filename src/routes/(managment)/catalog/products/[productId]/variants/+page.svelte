<script lang="ts">
    import SortedListView from '$lib/SortedListView.svelte';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import AlertModal from '$lib/componenets/modals/AlertModal.svelte';

    export let data: PageData;
    let showAddVariantModal = false;

    async function addVariant() {
        const res = await fetch(`/api/products/${data.product.productId}/newVariant`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subname: '', ean: null }) // or prompt user for details
        });
        if (res.ok) {

            const newVariant = await res.json();
            goto(`/catalog/variants/${newVariant.variantId}/detail?edit=1`);
        } else {
            alert('Nepodařilo se přidat variantu.');
        }
    }
</script>

<AlertModal
    title="Přidat variantu"
    message="Chcete přidat novou variantu produktu?"
    confirmText="Ano, přidat"
    onConfirm={addVariant}
    bind:showModal={showAddVariantModal}
/>

<SortedListView
    data={data.variants} 
    schema={[
        {fieldName: "variantId", type: "number", columnHeader: "ID" },
        {fieldName: "subname", type: "string", columnHeader: "Název" },
        {fieldName: "ean", type: "string", columnHeader: "EAN"},
    ]}
    buttons={{
        "Přidat": {
            action: () => showAddVariantModal = true,
            icon: "plus",
            color: "green"
        },
    }}
    removeButton={false}
    idFieldName="variantId"
    clickableRows={data.variants.length > 1}
    onRowClick={variant => goto(`/catalog/variants/${variant}/detail`)}
    selectors={false}
    showSearchBar={true}
    customSearchKeys={["variantId", "subname", "ean"]}
    grayRowOn={row => row['status'] === 'archived'}
/>
