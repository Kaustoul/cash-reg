<script lang="ts">
    import { enhance } from '$app/forms';
    import type { TransactionReason, TransactionType } from '$lib/shared/interfaces/transaction';
    import Modal from './Modal.svelte';

    export let showModal: boolean = false;
    export let reason: TransactionReason;
    export let type: TransactionType;
    export let tillId: number;
    export let cashierId: number = 0;
</script>

<Modal bind:showModal>
    <div slot="header">
        {#if reason === 'deposit'}
            Vložit peníze
        {:else if reason === 'withdraw'}
            Vybrat peníze
        {/if}
    </div>
    <form use:enhance method="POST" action="?/moneyTransfer">
        <input type="hidden" name="reason" value={reason} />
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="tillId" value={tillId} />
        <input type="hidden" name="cashierId" value={cashierId} />

        <label>
            Částka
            <input type="number" name="amount" required />
        </label>
        <button type="submit" class="btn" on:click={() => showModal = false}>
            {#if reason === 'deposit'}
                Vložit
            {:else if reason === 'withdraw'}
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
