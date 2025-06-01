<script lang="ts">
    import EditableForm from './interactables/EditableForm.svelte';
    import type { IPrice } from '$lib/shared/interfaces/product-price';

    export let price: Partial<IPrice> = { value: { value: '', currency: 'CZK' }, conditions: [] };
    export let editMode: boolean = true;
    export let onSubmit: (price: IPrice) => void = () => {};

    let fields = [
        { key: 'value', label: 'Cena', value: price.value?.value ?? '' }
    ];

    function handleSubmit(data: Record<string, string>) {
        onSubmit({
            ...price,
            value: { value: data.value, currency: 'CZK' },
            conditions: price.conditions ?? []
        });
    }
</script>

<EditableForm {fields} {editMode} noButtons={false} onSubmit={handleSubmit}>
</EditableForm>