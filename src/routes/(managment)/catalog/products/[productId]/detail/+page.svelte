<script lang="ts">
    import { page } from '$app/stores';
    import EditableForm, { type FormFields } from '$lib/componenets/interactables/EditableForm.svelte';
    import type { PageData } from './$types';
    import { formatDate } from '$lib/shared/utils/date-utils';
    import EditableFormButtons from '$lib/componenets/interactables/EditableFormButtons.svelte';

    export let data: PageData;

    let product = data.product;

    // Prepare fields for EditableForm
    let fields = [
        { key: 'name', label: 'Název produktu', value: product?.name, type: 'string' },
        { key: 'units', label: 'Jednotka', value: product?.units, type: 'select', options: ['ks', 'Kg', 'g'] },
        { key: 'status', label: 'Archivovat', value: product?.status === 'archived', type: 'checkbox' },
    ];

    let formData = {
        name: product?.name,
        isArchived: product?.status === 'archived',
        units: product?.units,
    };

    let editedFields: FormFields[];

    let editMode = $page.url.searchParams.get('edit') === '1' || false;

    async function handleSave() {
        const name = editedFields.find(f => f.key === 'name')?.value ?? "";
        const units = editedFields.find(f => f.key === 'units')?.value ?? "";
        const isArchived = editedFields.find(f => f.key === 'status')?.value ?? false;
        const status = isArchived ? "archived" : "active";

        const res = await fetch(`/api/products/${product?.productId}/edit`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, units, status })
        });

        if (res.ok) {
            editMode = false;
            $page.url.searchParams.delete('edit');
            window.location.reload();
        } else {
            alert("Nepodařilo se uložit změny.");
        }
    }

    function handleCancel() {
        formData = {
            name: product?.name,
            isArchived: product?.status === 'archived',
            units: product?.units,
        };
        editMode = false;
    }
</script>

<div class="contianer">

    <div class="main">
        <EditableForm {fields} {editMode} noButtons={true} bind:editedFields />
    </div>
    
    <div class="info">
        <EditableFormButtons
            bind:editMode
            isSubmitting={false}
            onConfirm={handleSave}
            onCancel={handleCancel}
        />
        {#if product?.createdAt}
            <div class="created">
                <span class="title">Vytvořeno</span>
                <span class="">{formatDate(product?.createdAt)}</span>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .contianer {
        display: flex;
        gap: 2rem;
    }

    .main {
        flex: 1 1 75%;
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 1rem;
        background-color: vars.$primary-color;
        min-width: 17rem;
        border-radius: vars.$medium-radius;

        .created {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem;
            font-size: vars.$larger;
        }

        .title {
            font-weight: bold;
            color: vars.$text2-color;
        }
    }
</style>