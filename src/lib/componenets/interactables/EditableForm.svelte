<script lang="ts">
    import EditableSpan from './EditableSpan.svelte';

    export let fields: { key: string, label: string, value: string }[] = [];
    export let editMode: boolean = false;
    export let onSubmit: (data: Record<string, string>) => void = () => {};
    export let onCancel: () => void = () => {};

    let localFields = fields.map(f => ({ ...f }));

    $: if (!editMode) {
        localFields = fields.map(f => ({ ...f }));
    }

    function handleChange(key: string, value: string) {
        const field = localFields.find(f => f.key === key);
        if (field) field.value = value;
    }

    function submit() {
        onSubmit(Object.fromEntries(localFields.map(f => [f.key, f.value])));
    }
</script>

<div class="editable-fields">
    {#each localFields as field}
        <div class="field-row">
            <span class="label">{field.label}</span>
            <EditableSpan
                value={field.value}
                editMode={editMode}
                onChange={val => handleChange(field.key, val)}
            />
        </div>
    {/each}
    {#if editMode}
        <div class="actions">
            <button type="button" class="accept-btn" on:click={submit}>Potvrdit</button>
            <button type="button" class="cancel-btn" on:click={onCancel}>Zrušit</button>
        </div>
    {/if}
</div>

<style>
.editable-fields {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}
.field-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}
.label {
    min-width: 8rem;
    font-weight: bold;
}
.actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}
.accept-btn, .cancel-btn {
    font-size: 1.1rem;
    padding: 0.5rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
}
.accept-btn { background: #4caf50; color: white; }
.cancel-btn { background: #ccc; }
</style>