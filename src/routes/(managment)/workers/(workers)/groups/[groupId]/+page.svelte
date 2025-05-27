<script lang="ts">
    import EditableForm from '$lib/componenets/interactables/EditableForm.svelte';
    import type { PageData } from './$types';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: PageData;
    let editMode = false;

    viewTitleStore.set({title: `Skupina ${data.group.groupId}`, showBackArrow: true});

    let fields = [
        { key: 'name', label: 'Název', value: data.group.name },
        { key: 'description', label: 'Popis', value: data.group.description ?? '' }
    ];

    async function handleSubmit(updated: any) {
        // Send PATCH/PUT to `/api/groups/${data.group.groupId}` with updated
        // On success:
        editMode = false;
        // Optionally reload or update local data
    }

    function handleCancel() {
        editMode = false;
    }
</script>

<h2>Detail skupiny</h2>
<EditableForm {fields} {editMode} onSubmit={handleSubmit} onCancel={handleCancel} />

{#if !editMode}
    <button on:click={() => editMode = true}>Upravit</button>
{/if}