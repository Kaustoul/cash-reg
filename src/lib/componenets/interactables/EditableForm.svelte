<script lang="ts">
    import EditableSpan from './EditableSpan.svelte';

    export let fields: { key: string, label: string, value: string }[] = [];
    export let editMode: boolean = false;
    export let cancelBtn: boolean = true;
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

    <div class="slot">
        <slot></slot>
    </div>
</div>

{#if editMode}
    <div class="actions">
        <button type="button" class="accept-btn" on:click={submit}>Přidat</button>
        {#if cancelBtn}
            <button type="button" class="cancel-btn" on:click={onCancel}>Zrušit</button>
        {/if}
    </div>
{/if}

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/buttons' as buttons;

    .editable-fields {
        display: flex;
        flex-wrap: wrap;
        gap: 3rem 1rem;
    }

    .field-row {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 1rem 2rem;

        width: 100%;


        flex: 0 0 48%;
    }

    .label {
        font-size: inherit;
        color: vars.$text2-color;
        font-weight: bold;
    }

    .actions {
        display: flex;
        gap: 1rem;
        margin-top: 4rem;
        width: 30%;
        align-items: center;
        justify-self: center;
    }

    .accept-btn, .cancel-btn {
        font-size: 1.1rem;
        padding: 0.5rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
    }

    .accept-btn {
        @include buttons.btn($btn-color: vars.$green, $btn-height: 4rem);
        font-size: vars.$large;
        width: 30%
    }
</style>