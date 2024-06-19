<script lang="ts">
    import { enhance } from '$app/forms';
    import Modal from './Modal.svelte';

    export let showModal: boolean = false;
    export let type: 'deposit' | 'withdraw';
    export let tillId: number;
</script>

<Modal bind:showModal>
    <div slot="header">
        {#if type === 'deposit'}
            Vložit peníze
        {:else if type === 'withdraw'}
            Vybrat peníze
        {/if}
    </div>
    <form use:enhance method="POST" action="?/moneyTransfer">
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="tillId" value={tillId} />

        <label>
            Částka
            <input type="number" name="amount" required />
        </label>
        <button type="submit" class="btn" on:click={() => showModal = false}>
            {#if type === 'deposit'}
                Vložit
            {:else if type === 'withdraw'}
                Vybrat
            {/if}
        </button>
    </form>
</Modal>

<style lang="scss">
    @use "$lib/styles/vars" as vars;
    @use "$lib/styles/buttons" as buttons;
    @use "$lib/styles/inputs" as inputs;

    form {
        display: grid;
        gap: 1rem;
        padding: 0 3rem;
    }

    .btn {
        @include buttons.btn($btn-color: vars.$green, $btn-height: 4.5rem);
        font-size: xx-large;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: xx-large;
    }

    input {
        @include inputs.number;
        font-size: x-large;
        text-align: center;
    }
</style>
