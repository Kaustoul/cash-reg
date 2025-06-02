<script lang="ts">
    import type { PageData } from './$types';
    import { formatDate } from '$lib/shared/utils/date-utils';
    import DetailLayout from '$lib/componenets/DetailLayout.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';
    import AlertModal from '$lib/componenets/modals/AlertModal.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    export let data: PageData;

    let variant = data.variant;
    let showDeleteVariantModal = false;

    viewTitleStore.set({
        title: `Varianta ${variant?.variantId}`,
        showBackArrow: true
    });

    let fields = [
        { key: 'subname', label: 'Název varianty', value: variant?.subname, type: 'string' },
        { key: 'ean', label: 'EAN', value: variant?.ean, type: 'string' },
        { key: 'isArchived', label: 'Archivovat', value: variant.status === 'archived', type: 'checkbox' },
    ];

    function deletePressed() {
        showDeleteVariantModal = true;
    }

    async function deleteVariant() {
        showDeleteVariantModal = false;

        const res = await fetch(`/api/variants/${variant.variantId}/edit`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'deleted' })
        });

        if (res.ok) {
            const json = await res.json();
            console.log(json);
            goto(`/catalog/products/${json.productId}/variants`, { replaceState: true });
        } else {
            alert('Chyba při mazání produktu.');
        }
    }

</script>

<DetailLayout
    {fields}
    isSubmitting={false}
    endpoint={`/api/variants/${variant?.variantId}/edit`}
    method="PATCH"
    onConfirmSuccess={() => window.location.reload()}
    onDelete={deletePressed}
    info={{
        "Vytvořeno": {
            text: formatDate(variant?.createdAt),
            class: "mono"
        },
        "Upraveno": {
            text: formatDate(variant?.modifiedAt),
            class: "mono"
        }
    }}
    
/>

<AlertModal
    title="Smazat variantu"
    message="Opravdu chcete smazat tuto variantu?"
    confirmText="Ano, smazat"
    onConfirm={deleteVariant}
    bind:showModal={showDeleteVariantModal}
/>