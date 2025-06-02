<script lang="ts">
    import { page } from '$app/stores';
    import EditableForm, { type FormFields } from '$lib/componenets/interactables/EditableForm.svelte';
    import EditableFormButtons from '$lib/componenets/interactables/EditableFormButtons.svelte';
    import { onMount } from "svelte";

    export let fields: FormFields[] = [];
    // export let editMode: boolean = false;
    export let isSubmitting: boolean = false;
    export let onConfirmSuccess: () => void = () => {};
    export let onConfirmFail: () => void = () => {};
    export let onCancel: () => void = () => {};
    export let endpoint: string;
    export let method: 'PATCH' | 'POST';
    export let editedFields: FormFields[] = [];
    export let info: null | { [title: string]: { text: string, class?: string } } = null;

    editedFields = fields.map(field => ({ ...field, value: field.value || '' }));
    let editMode = false;

    onMount(() => {
        editMode = $page.url.searchParams.get('edit') === '1' || false;
    });

    async function handleSave() {
        isSubmitting = true;
        
        let values: {[key: string]: string} = {}

        for (const field of editedFields) {
            values = {
                ...values,
                [field.key]: field.value
            }
        }
        
        const res = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });

        if (res.ok) {
            editMode = false;
            isSubmitting = false;

            onConfirmSuccess();
        } else {
            onConfirmFail();
        }
    }

</script>

<div class="container">
    <div class="main">
        <EditableForm {fields} {editMode} noButtons={true} bind:editedFields />
    </div>
    <div class="info">
        <EditableFormButtons
            bind:editMode
            {isSubmitting}
            onConfirm={handleSave}
            {onCancel}
        />
        {#if info && Object.keys(info).length > 0}
            <div class="info-data">
                {#each Object.entries(info) as [title, value]}
                    <div class="info-row">
                        <span class="title">{title}</span>
                        <span class={value.class ? value.class : ''}>{value.text}</span>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/text-styles' as textStyles;
    
    .container {
        display: flex;
        gap: 2rem;
    }

    .main {
        flex: 1 1 75%;
    }
    
    .info {
        display: flex;
        flex-direction: column;
        min-width: 17rem;
        gap: 1rem;
    }

    .info-data {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-color: vars.$primary-color;
        padding: 1rem 2rem;
        border-radius: vars.$medium-radius;

        .info-row {
            display: flex;
            flex-direction: column;
            gap: .3rem;
            font-size: vars.$larger;
            border-radius: vars.$medium-radius;
        }

        .title {
            font-weight: bold;
            color: vars.$text2-color;
        }
    }

    .mono {
        @include textStyles.mono-font;
    }
</style>