<script lang="ts">
    export let value: string = "";
    export let editMode: boolean = false;
    export let onChange: (val: string) => void = () => {};

    let inputEl: HTMLInputElement | null = null;
    let hasSelected = false;

    function handleFocus() {
        if (inputEl && !hasSelected) {
            inputEl.select();
            hasSelected = true;
        }
    }

    $: if (!editMode) {
        hasSelected = false;
    }
</script>

{#if editMode}
    <input
        bind:this={inputEl}
        type="text"
        bind:value
        on:focus={handleFocus}
        on:input={() => onChange(value)}
        class="editable-input"
    />
{:else}
    <span class="editable-text">{value}</span>
{/if}

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .editable-input, .editable-text {
        @include inputs.text;

        font-size: inherit;
        
        padding: 1rem 2rem;

        border: 1px solid vars.$second-accent-color;
    }

    .editable-text {
        background-color: transparent;
    }
</style>