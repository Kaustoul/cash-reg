<script lang="ts">
    import SortedListView from '$lib/SortedListView.svelte';
    import PriceModal from '$lib/componenets/modals/PriceModal.svelte';
    import type { IPrice } from '$lib/shared/interfaces/product-price';

    export let prices: IPrice[] = [];
    export let editMode: boolean = true;
    export let onChange: (prices: IPrice[]) => void = () => {};
    export let unit: string;

    let showPriceModal = false;
    let editingIdx: number | null = null;

    function handleAddPrice(price: IPrice) {
        onChange([...prices, price]);
        showPriceModal = false;
    }

    function handleEditPrice(price: IPrice) {
        if (editingIdx !== null) {
            const updated = [...prices];
            updated[editingIdx] = price;
            onChange(updated);
            editingIdx = null;
            showPriceModal = false;
        }
    }

    function handleDelete(idx: number) {
        const updated = prices.filter((_, i) => i !== idx);
        onChange(updated);
    }

    function openEditModal(idx: number) {
        editingIdx = idx;
        showPriceModal = true;
    }
</script>

<SortedListView
    data={prices.map((p, idx) => ({
        ...p,
        idx,
        value: p.value.value,
        currency: p.value.currency,
        // Add more fields as needed for display
    }))}
    schema={[
        { fieldName: "value", type: "string", columnHeader: "Cena" },
        { fieldName: "currency", type: "string", columnHeader: "Měna" },
        {
            fieldName: "actions",
            type: "button",
            columnHeader: "",
            btnProps: {
                color: "yellow",
                onClick: (row) => openEditModal(row.idx),
                text: "Upravit"
            },
        }
    ]}
    removeButton={editMode}
    onRemovePressed={(selected) => handleDelete(selected[0])}
    buttons={editMode ? {
        "Přidat": {
            action: () => { editingIdx = null; showPriceModal = true; },
            icon: "plus",
            color: "green"
        }
    } : undefined}
/>

<PriceModal
    bind:showModal={showPriceModal}
    on:submit={(e) => editingIdx === null ? handleAddPrice(e.detail) : handleEditPrice(e.detail)}
    price={editingIdx !== null ? prices[editingIdx] : undefined}
    editMode={true}
    bind:units={unit}
/>