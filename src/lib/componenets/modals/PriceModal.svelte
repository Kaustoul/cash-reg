<script lang="ts">
    import Modal from '$lib/componenets/modals/Modal.svelte';
    import { enhance } from "$app/forms";
    import ConditionInput from './ConditionInput.svelte';

    export let showModal: boolean = false;
    export let units: string;

    let showConditionsInputs = false;
    let applyToAll = true;
</script>

<Modal bind:showModal>
    <div slot="header">
        Přidat novou cenu
    </div>
    <form method='POST' use:enhance action="?/newPrice">
        <label>
            Cena
            <div>
                <input type="number"
                    name="value"
                    class="number-input" 
                    min="0"
                    step="0.01"
                    placeholder="420.69"
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
                checked={applyToAll}
                on:change={() => applyToAll = !applyToAll}
            />
        </label>
        <label>
            Množstevní podmínka
            <input 
                type="checkbox"
                class="checkbox"
                checked={showConditionsInputs}
                on:change={() => showConditionsInputs = !showConditionsInputs}
            />
        </label>
        <div class="cond-inputs {showConditionsInputs ? '' : 'hidden'}">
            <ConditionInput units={units}/>
        </div>
        <div class="footer">
            <button class="btn" on:click={() => showModal = false}>
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
