<script lang="ts">
    import EditableForm from '$lib/componenets/interactables/EditableForm.svelte';
    import PriceListEditor from '$lib/componenets/PriceListEditor.svelte';
    import { goto } from '$app/navigation';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';
    import type { FormFields } from '$lib/componenets/interactables/EditableForm.svelte';
    import type { IPrice } from '$lib/shared/interfaces/product-price';

    let isSubmitting = false;
    let error: string | null = null;
    let editedFields: FormFields[];

    $: unit = editedFields ? editedFields.find(field => field.key === 'units')?.value : 'ks';

    // Set the page title and back arrow
    viewTitleStore.set({ title: "Nový produkt", showBackArrow: true });

    // Define the fields for the product
    let fields = [
        { key: 'name', label: 'Název produktu', value: '', type: 'string' },
        { key: 'units', label: 'Jednotka', value: 'ks', type: 'select', options: ['ks', 'Kg', 'g'] },
        { key: 'isActive', label: 'Aktivní', value: true, type: 'checkbox' }
    ];
    let prices: IPrice[] = [];

    async function handleSubmit(data: Record<string, string>) {
        isSubmitting = true;
        error = null;
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    units: data.units,
                    isActive: true, // default for new product
                    prices // include prices in the request
                })
            });
            if (res.ok) {
                const { productId } = await res.json();
                goto(`/catalog/products/${productId}`);
            } else {
                error = "Nepodařilo se vytvořit produkt.";
            }
        } catch (e) {
            error = "Chyba při komunikaci se serverem.";
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="new-product-page">
    {#if error}
        <div class="error">{error}</div>
    {/if}
    <EditableForm
        {fields}
        editMode={true}
        noButtons={true}
        onSubmit={handleSubmit}
        bind:editedFields
    >
        <h3>Ceny</h3>
        <PriceListEditor bind:prices editMode={true} bind:unit/>
    </EditableForm>
</div>