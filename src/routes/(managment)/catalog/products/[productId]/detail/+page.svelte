<script lang="ts">
    import type { PageData } from './$types';
    import { formatDate } from '$lib/shared/utils/date-utils';
    import DetailLayout from '$lib/componenets/DetailLayout.svelte';
    import AlertModal from '$lib/componenets/modals/AlertModal.svelte';
    import { goto } from '$app/navigation';

    export let data: PageData;

    let showDeleteProductModal = false;
    let product = data.product;

    // Prepare fields for EditableForm
    let fields = [
        { key: 'name', label: 'Název produktu', value: product?.name, type: 'string' },
        { key: 'units', label: 'Jednotka', value: product?.units, type: 'select', options: ['ks', 'Kg', 'g'] },
        { key: 'isArchived', label: 'Archivovat', value: product?.status === 'archived', type: 'checkbox' },
    ];

    function deletePressed() {
        showDeleteProductModal = true;
    }

    async function deleteProduct() {
        showDeleteProductModal = false;

        const res = await fetch(`/api/products/${product?.productId}/edit`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'deleted' })
        });

        if (res.ok) {
            goto(`/catalog`, { replaceState: true });
        } else {
            alert('Chyba při mazání produktu.');
        }
    }

</script>

<DetailLayout
    {fields}
    isSubmitting={false}
    endpoint={`/api/products/${product?.productId}/edit`}
    method="PATCH"
    onConfirmSuccess={() => window.location.reload()}
    onDelete={ deletePressed } 
    info={{ 
        "Vytvořeno": { 
            text: formatDate(product?.createdAt), 
            class: "mono" 
        },

        "Upraveno": { 
            text: formatDate(product?.modifiedAt), 
            class: "mono" 
        }
    }}
>
</DetailLayout>

<AlertModal
    title="Smazat produkt"
    message="Opravdu chcete smazat tento produkt?"
    confirmText="Ano, smazat"
    onConfirm={deleteProduct}
    bind:showModal={showDeleteProductModal}
/>


<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

</style>