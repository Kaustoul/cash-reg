<script lang="ts" context="module">
    export type FormFields = { key: string, label: string, value: any, type: string, options?: string[], defaultValue?: string }
</script>

<script lang="ts">
    import EditableSpan from './EditableSpan.svelte';
    import EditIcon from 'svelte-material-icons/AccountEdit.svelte';
    import Selector from './Selector.svelte';

    export let fields: FormFields[] = [];
    export let editMode: boolean = false;
    export let noButtons: boolean = true;
    export let onSubmit: (data: Record<string, any>) => void = () => {};
    export let onCancel: () => void = () => {};
    export let editedFields = fields.map(f => ({ ...f }));

    $: console.log('edit from form', editMode);

    $: if (!editMode) {
        editedFields = fields.map(f => ({ ...f }));
    }

    function handleChange(key: string, value: any) {
        const field = editedFields.find(f => f.key === key);
        if (!field) return;

        if (typeof value === 'string') {
            value = value.trim();
        }

        field.value = value;
    }

    function submit() {
        onSubmit(Object.fromEntries(editedFields.map(f => [f.key, f.value])));
    }
</script>

<div class="editable-fields">
    {#each editedFields as field}
        <div class="field-row">
            <span class="label">{field.label}</span>
            {#if field.type === 'select'}
                {#if editMode}
                    <Selector bind:value={field.value} defaultValue={field.defaultValue ? field.defaultValue : ""} options={field.options} />
                {:else}
                    <span class="editable-text">{field.value}</span>
                {/if}
            {:else if field.type === 'checkbox'}
                    <input
                        type="checkbox"
                        class="checkbox {editMode ? '' : 'disabled'}"
                        checked={field.value}
                        on:change={e => handleChange(field.key, e.target.checked)}
                    />
            {:else}
                <EditableSpan
                    value={field.value}
                    editMode={editMode}
                    onChange={val => handleChange(field.key, val)}
                />
            {/if}
        </div>
    {/each}

    <div class="slot">
        <slot></slot>
    </div>
</div>

{#if editMode}
    <div class="actions">
        {#if !noButtons}
            <button type="button" class="accept-btn" on:click={submit}>Přidat</button>
            <button type="button" class="cancel-btn" on:click={onCancel}>Zrušit</button>
        {/if}
    </div>
{:else}
    {#if !noButtons}
        <button 
            class="edit-btn" 
            type="button"
            on:click={() => editMode = !editMode}
        >
            <EditIcon size="2.5rem" />
            Upravit
        </button>
    {/if}
{/if}

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/buttons' as buttons;

    .editable-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        flex-wrap: wrap;
        align-items: center;
        gap: 3rem 1rem;
        
        width: calc(100% - 4rem);
        
        padding: 2rem;
    }

    .field-row {
        display: flex;
        flex-direction: column;
        gap: 1rem 2rem;
        flex: 0 0 45%;
        font-size: vars.$larger;
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

    .checkbox {
        @include inputs.checkbox;
    }

    .text-input {
        @include inputs.text;
    }

    .number-input {
        @include inputs.number;
    }  

    .editable-text {
        @include inputs.text;

        background-color: transparent;

        display: block;
        font-size: inherit;
        width: 80%;
        padding: 1rem 2rem;

        border: 1px solid vars.$second-accent-color;
    }
    
</style>