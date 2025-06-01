<script lang="ts">
    import EditableForm from '$lib/componenets/interactables/EditableForm.svelte';
    import MultiSelector from '$lib/componenets/interactables/MultiSelector.svelte';
    import { goto } from '$app/navigation';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import type { MultiSelectorItem } from '$lib/componenets/interactables/MultiSelector.svelte';

    export let data; // contains groups

    const editMode = true;
    let isSubmitting = false;
    let error: string | null = null;

    viewTitleStore.set({ title: "Přidat zaměstnance", showBackArrow: true });

    let fields = [
        { key: 'name', label: 'Jméno', value: '' },
        { key: 'surname', label: 'Příjmení', value: '' }
    ];

    let selectedGroups: MultiSelectorItem[] = [];

    const groups = data.groups.map(group => ({
        id: group.groupId,
        name: group.name,
    }));

    async function handleSubmit(updated: any) {
        isSubmitting = true;
        error = null;

        try {
            const formData = new FormData();
            for (const field of fields) {
                formData.append(field.key, updated[field.key]);
            }

            if (!groups || groups.length === 0) {
                error = 'Nebyly nalezeny žádné skupiny.';
                return;
            }

            let group = null;
            let defaultGroup = groups.find(group => group.name === "default");
            if (selectedGroups.length === 0) {
                if (!defaultGroup) {
                    error = 'Musíte vybrat alespoň jednu skupinu.';
                    return;
                }

                group = defaultGroup;
            } else {
                group = selectedGroups[0];
            }

            formData.append('groupId', String(group.id));

            const res = await fetch('?/createWorker', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                goto(`/workers/list`, { replaceState: true });
            } else {
                error = 'Nepodařilo se vytvořit zaměstnance.';
            }
        } catch (e) {
            error = 'Chyba při komunikaci se serverem.';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="new-worker-page">
    {#if error}
        <div class="error">{error}</div>
    {/if}
    <EditableForm {fields} {editMode} onSubmit={handleSubmit} noButtons={true}>
        <div class="field-row">
            <span class="label">Skupina</span>
            <MultiSelector
                items={groups}
                bind:selected={selectedGroups}
                deleteEndpoint={undefined}
                maxItems={1}
            />
        </div>
    </EditableForm>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/buttons' as buttons;

    .new-worker-page {
        font-size: vars.$larger;
        margin-top: 2rem;
    }

    .error {
        color: vars.$red;
        margin-top: 1.5rem;
        text-align: center;
        font-weight: bold;
    }

    .label {
        font-weight: bold;
        color: vars.$text2-color;
    }

    .field-row {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>