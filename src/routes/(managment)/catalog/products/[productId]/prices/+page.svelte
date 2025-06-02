<script lang="ts">
    import SortedListView from '$lib/SortedListView.svelte';
    import PriceModal from '$lib/componenets/modals/PriceModal.svelte';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import { formatPrice, formatSum } from '$lib/shared/utils/money-sum-utils';
    import { formatDecimal } from '$lib/shared/utils';
    import AlertModal from '$lib/componenets/modals/AlertModal.svelte';

    export let data: PageData;

    let showPriceModal = false;
    let showDeletePriceModal = false;
    let editingPrice: any = null;
    let formData = {
        priceValue: '',
        priceType: 'base',
        minQuantity: '',
        maxQuantity: '',
        isActive: true,
        showConditionsInputs: false,
        priceId: -1,
        method: "POST"
    };

    let pricesToDelete: number[] = [];

    const customRenderer = {
        amount: (row: any, column: any) => {
            return {
                text: formatPrice(row[column.fieldName], data.product.units),
                class: "mono"
            }
        },

        minQuantity: (row: any, column: any) => {
            const max = row['maxQuantity'] ?? null;
            const min = row['minQuantity'] ?? null;
            let res = '';
            
            if (row['priceType'] === 'base') {
                return {
                    text: 'Žádná podmínka',
                    class: "mono"
                }
            }

            if (max !== null && min !== null) {
                res = `${formatDecimal(max)} ${data.product.units} > množství ≥ ${formatDecimal(min)} ${data.product.units}`;
            } else if (max !== null) {
                res = `množství ≤ ${formatDecimal(max)} ${data.product.units}`;
            } else if (min !== null) {
                res = `množství ≥ ${formatDecimal(min)} ${data.product.units}`;
            } else {
                res = 'Žádná podmínka';
            } 

            return {
                text: res,
                class: "mono"
            }
        }
    }

    function openAddPrice() {
        formData = {
            priceValue: '',
            priceType: 'base',
            minQuantity: '',
            maxQuantity: '',
            isActive: true,
            showConditionsInputs: false,
            priceId: -1,
            method: "POST"
        };
        showPriceModal = true;
    }

    async function handlePriceSubmit(e: any) {
        showPriceModal = false;
        const price = e.detail;

        if (editingPrice) {
            // PATCH to update
            const res = await fetch(`/api/products/${data.product.productId}/price?priceId=${editingPrice.priceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(price)
            });

            if (res.ok) {
                editingPrice = null;
                // goto(window.location.pathname);
            } else {
                alert('Nepodařilo se upravit cenu.');
            }
        } else {
            // POST to create
            const res = await fetch(`/api/products/${data.product.productId}/price`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(price)
            });

            if (res.ok) {
                // goto(window.location.pathname);
            } else {
                alert('Nepodařilo se přidat cenu.');
            }
        }
        editingPrice = null;
    }

    function handleRowClick(id: any) {
        const row = data.prices.find((p: any) => p.priceId === id);
        if (!row) return;

        formData = {
            priceValue: row.amount.CZK,
            priceType: row.priceType,
            minQuantity: row.minQuantity ? row.minQuantity.toString() : '',
            maxQuantity: row.maxQuantity ? row.maxQuantity.toString() : '',
            isActive: row.isActive,
            showConditionsInputs: row.priceType === 'tiered',
            priceId: row.priceId,
            method: "PATCH"
        };
        showPriceModal = true;
    }

    async function handleRemovePrice() {
        // selected can be an array of price IDs or a single ID
        const ids = Array.isArray(pricesToDelete) ? pricesToDelete : [pricesToDelete];
        for (const priceId of ids) {
            const res = await fetch(`/api/products/${data.product.productId}/price/${priceId}/delete`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                alert('Nepodařilo se smazat cenu.');
            }
        }
        // Reload or update the list
        window.location.reload();
    }
</script>

<AlertModal
    title="Smazat cenu"
    message={`Opravdu chcete smazat ceny (${pricesToDelete.length})?`}
    confirmText="Ano, smazat"
    onConfirm={handleRemovePrice}
    bind:showModal={showDeletePriceModal}
/>

<SortedListView
    data={data.prices}
    schema={[
        // { fieldName: "isActive", type: "checkbox", columnHeader: "Aktivní" },
        { fieldName: "priceId", type: "number", columnHeader: "ID" },
        { fieldName: "amount", type: "sum", columnHeader: "Cena" },
        { fieldName: "minQuantity", type: "number", columnHeader: "Podmínka" },
    ]}
    buttons={{
        "Přidat cenu": {
            action: openAddPrice,
            icon: "plus",
            color: "green"
        }
    }}
    clickableRows={true}
    onRowClick={handleRowClick}
    removeButton={true}
    onRemovePressed={(selected) => {pricesToDelete = selected.map(s => Number(s)); showDeletePriceModal = true;}}
    customRenderer={customRenderer}
    grayRowOn={(row) => !row.isActive}
/>


{#if showPriceModal}
    <PriceModal
        bind:showModal={showPriceModal}
        units={data.product.units}
        on:submit={handlePriceSubmit}
        {formData}
    />
{/if}
