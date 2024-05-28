<script lang="ts">
    import Modal from '$lib/componenets/modals/Modal.svelte';
    import { enhance } from "$app/forms";
    import ConditionInput from './ConditionInput.svelte';

    export let showModal: boolean = false;
    export let units: string;
    
    let form: any;
    let showConditionsInputs = false;
    let applyToAll = true;
    let priceValue = '';
    let min = '';
    let max = '';

    $: {
        if (showModal) {
            applyToAll = true;
            showConditionsInputs = false;
            priceValue = '';
            min = '';
            max = '';
        }
    }

</script>

<Modal bind:showModal >
    <div slot="header">
        Přidat novou cenu
    </div>
    <form bind:this={form} method='POST' use:enhance action="?/newPrice">
        <label>
            Cena
            <div>
                <input type="number"
                    name="value"
                    class="number-input" 
                    min="0"
                    step="0.01"
                    placeholder="420.69"
                    bind:value={priceValue}
                />
                Kč
            </div>
        </label>
        <label>
            Aplikovat cenu na všechny položky
            <input 
                type="checkbox"
                name="applyAll"
                class="checkbox"
                bind:checked={applyToAll}
            />
        </label>
        <label>
            Množstevní podmínka
            <input 
                type="checkbox"
                class="checkbox"
                bind:checked={showConditionsInputs}
            />
        </label>
        <div class="cond-inputs {showConditionsInputs ? '' : 'hidden'}">
            <ConditionInput units={units} bind:min bind:max/>
        </div>
        <div class="footer">
            <button class="btn" type="submit" on:click={() => showModal = false}>
                Přidat
            </button>
        </div>
    </form>
</Modal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;
    
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    label {
        display: flex;
        justify-content: space-between;
        
        font-size: x-large;
    }

    .footer {
        display: flex;
        justify-content: end;

        .btn {
            @include buttons.btn($btn-color: vars.$green);
            margin-top: 1.5rem;
            font-size: x-large;
            height: 3.5rem;
            width: 8rem;
            flex-grow: 0;
        }
    }

    .hidden {
        opacity: 0;
        pointer-events: none; 
    }

    .checkbox {
        @include inputs.checkbox;
    }

    .number-input {
        @include inputs.number;
        text-align: right;
    }
</style>
