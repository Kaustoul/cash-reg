<script lang="ts">
    import { enhance } from '$app/forms';
    import TabSelector from '$lib/TabSelector.svelte';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import TillCard from '$lib/componenets/TillCard.svelte';
    import type { PageData } from './$types';
    import Modal from '$lib/componenets/modals/Modal.svelte';
    import type { ITill } from '$lib/shared/interfaces/till';
    import { formatSum } from '$lib/shared/utils/money-sum-utils';
    import type { IMoneySum } from '$lib/shared/interfaces/money-sum';
    import type { TransactionReason, TransactionType } from '$lib/shared/interfaces/transaction';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';
    import AddIcon from 'svelte-material-icons/Plus.svelte';

	export let data: PageData;

    viewTitleStore.set({
        title: "Pokladny",
    });

    let balanceModalData: {
        show: boolean
        tillId: number
        balance: ITill['balance']
    } = {
        show: false,
        tillId: -1,
        balance: []
    }

    let showNewTillModal = false;

    let tabs = {
        "Pokladny": {
            url: "/tills"
        }, 
        "Měny": {
            url: "/tills/currencies",
            disabled: true
        }
    };

    function getFormattedSum(sums: IMoneySum[]): string {
        const zeroSum = {currency: 'CZK', value: '0'};
        if (sums.length === 0) {
            return formatSum(zeroSum);
        }

        return formatSum(balanceModalData.balance[0] ?? zeroSum);
    }

    async function handleMoneyTransfer(tillId: number, amount: number, type: 'deposit' | 'withdraw') {
        const res = await fetch('?/moneyTransfer', {
            method: "POST",
            body: new URLSearchParams({
                tillId: tillId.toString(),
                amount: amount.toString(),
                reason: type,
                type: "cash"
            })
        });
        if (res.ok) {
            location.reload(); // Or refresh data in a more Svelte way
        } else {
            alert(type === "deposit" ? "Vklad se nezdařil." : "Výběr se nezdařil.");
        }
    }

    let isCreatingTill = false;
    let error: string | null = null;

    async function createTill() {
        isCreatingTill = true;
        error = null;

        const res = await fetch('?/newTill', {
            method: "POST",
            body: new FormData()
        });

        isCreatingTill = false;

        if (res.ok) {
            showNewTillModal = false;
            location.reload(); // Or refresh data in a more Svelte way
        } else {
            const errorData = await res.json();
            error = errorData.message || "Nastala chyba při vytváření pokladny.";
        }
    }
</script>

<Modal bind:showModal={balanceModalData.show}>
    <div slot="header" class="balance-header">
        Pokladna {balanceModalData.tillId}
    </div>

    <div class="balance-modal">
        <span>Stav pokladny:</span>

        <span class="balance-sum">
            {getFormattedSum(balanceModalData.balance)}
        </span>
    </div>
</Modal>

<Modal bind:showModal={showNewTillModal}>
    <div slot="header" class="balance-header">
        Nová pokladna
    </div>
    <div class="modal">
        <span>Opravdu chcete přidat novou pokladnu?</span>
        {#if error}
            <div class="error">{error}</div>
        {/if}
        <div class="modal-buttons">
            <button class="green" disabled={isCreatingTill} on:click={createTill}>Potvrdit</button>
            <button class="red" disabled={isCreatingTill} on:click={() => showNewTillModal = false}>Zrušit</button>
        </div>
    </div>
</Modal>


<div class="container">
    <div class="form">
        <button class="btn" on:click={() => showNewTillModal = true} >
            <AddIcon size="2rem" />
            Přidat pokladnu
        </button>
    </div>

    <div class="tills">
        {#if data.tills}
            {#each data.tills as till}
                <TillCard 
                    {till}
                    onDeposit={(tillId, amount) => handleMoneyTransfer(tillId, amount, 'deposit')}
                    onWithdraw={(tillId, amount) => handleMoneyTransfer(tillId, amount, 'withdraw')}
                    onOpenBalance={() => balanceModalData = {
                        tillId: till.id,
                        balance: till.balance,
                        show: true
                    }}
                    action={data.tillSessionId ? (data.tillId && data.tillId === till.id ? "close" : "none") : "open"}
                />
            {/each}
        {/if}
    </div>
</div>

<style lang="scss">
    @use "$lib/styles/vars" as vars;
    @use "$lib/styles/buttons" as buttons;
    @use "$lib/styles/inputs" as inputs;

    .container {
        @include inputs.scrollable;
    }

    .balance-modal {
        width: 35rem;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 1rem 0;

        font-size: x-large;

        .balance-sum {
            color: vars.$accent-color;
            font-family: 'Roboto Mono', monospace;
            font-weight: bold;
            font-size: xx-large;
        }
    }

    .tills {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        height: 100%;
    }

    .form {
        display: flex;
        justify-content: flex-end;
        margin: 2rem;
    }

    .btn {
        @include buttons.btn($btn-color: vars.$green, $btn-height: 4rem);
        max-width: 20rem;
        font-size: vars.$large;
    }

    .modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        font-size: vars.$larger;
        padding: 2rem;
        gap: 3rem;
    }

    .modal-buttons {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 1rem;
        margin-top: 1rem;

        .green {
            @include buttons.btn($btn-color: vars.$green, $btn-height: 3rem);
            flex: 1 1 40%;
        }

        .red {
            @include buttons.btn($btn-color: vars.$red, $btn-height: 3rem);
            flex: 1 1 40%;
        }
    }

    .error {
        color: vars.$red;
        font-size: vars.$larger;
        text-align: center;
    }
</style>
