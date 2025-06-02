<script lang="ts">
    import type { PageData } from './$types';
    import { formatDate } from '$lib/shared/utils/date-utils';
    import DetailLayout from '$lib/componenets/DetailLayout.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: PageData;

    let variant = data.variant;

    viewTitleStore.set({
        title: `Varianta ${variant?.variantId}`,
        showBackArrow: true
    });

    let fields = [
        { key: 'subname', label: 'Název varianty', value: variant?.subname, type: 'string' },
        { key: 'ean', label: 'EAN', value: variant?.ean, type: 'string' },
        { key: 'isArchived', label: 'Archivovat', value: variant.status === 'archived', type: 'checkbox' },
    ];
</script>

<DetailLayout
    {fields}
    isSubmitting={false}
    endpoint={`/api/variants/${variant?.variantId}/edit`}
    method="PATCH"
    onConfirmSuccess={() => window.location.reload()}
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