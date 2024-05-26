<script lang="ts">
    import Modal from '$lib/componenets/modals/Modal.svelte';
    import { enhance } from "$app/forms";

    export let showModal: boolean = false;
    export let units: string;
</script>
<Modal bind:showModal>
    <div slot="header">
        Přidat podmínku
    </div>
    <form method='POST' use:enhance action="?/newCondition">
        <div class="inputs-header">
            <span>
                Množstevní podmínka
            </span>
        </div>
        <div class="inputs">
            <div class="left">
                <input 
                    name="min" 
                    type="number" 
                    class="input-field" 
                    min="0" 
                    step="1" 
                    placeholder="Min"
                />
                <span>{units}</span>
            </div>
            <span class="text-between">≤</span>
            <span class="text-between">množství</span>
            <span class="text-between">&lt;</span>
            <div class="right">
                <input 
                    name="max" 
                    type="number" 
                    class="input-field right" 
                    min="0" 
                    step="1" 
                    placeholder="Max"
                />
                {units}
            </div>
        </div>
        <div class="footer">
            <button class="btn-primary" on:click={() => showModal = false}>
                Přidat
            </button>
        </div>
    </form>
</Modal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;

    .inputs {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: x-large;
        gap: 2rem;
    }

    .inputs-header{
        font-size: xx-large;
        color: vars.$text-color;
        margin-bottom: 1.5rem;
        text-decoration: underline;
    }

    .input-field {
        padding: 0.5rem;
        background-color: vars.$primary-color;
        border: none;
        margin-right: .5rem;
        color: vars.$text-color;
        font-size: x-large;
        width: 5rem;
        
        &:focus {
            border: none;
            outline: none;
        }

        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }

    .text-between {
        margin: 0.5rem;
        color: vars.$text-color;
        font-size: larger;
    }

    .left {
        display: flex;
        justify-content: end;
        align-items: center;
        flex-grow: 0;
    }

    .right {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-grow: 0;
    }

    .footer {
        display: flex;
        justify-content: end;

        .btn-primary {
            margin-top: 1.5rem;
            font-size: x-large;
            height: 3.5rem;
            width: 8rem;
            flex-grow: 0;
        }
    }
</style>
