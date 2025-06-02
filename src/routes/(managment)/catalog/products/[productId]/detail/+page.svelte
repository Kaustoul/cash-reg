<script lang="ts">
    import type { PageData } from './$types';
    import { formatDate } from '$lib/shared/utils/date-utils';
    import DetailLayout from '$lib/componenets/DetailLayout.svelte';

    export let data: PageData;

    let product = data.product;

    // Prepare fields for EditableForm
    let fields = [
        { key: 'name', label: 'Název produktu', value: product?.name, type: 'string' },
        { key: 'units', label: 'Jednotka', value: product?.units, type: 'select', options: ['ks', 'Kg', 'g'] },
        { key: 'isArchived', label: 'Archivovat', value: product?.status === 'archived', type: 'checkbox' },
    ];

</script>

<DetailLayout
    {fields}
    isSubmitting={false}
    endpoint={`/api/products/${product?.productId}/edit`}
    method="PATCH"
    onConfirmSuccess={() => window.location.reload()}
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

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

</style>