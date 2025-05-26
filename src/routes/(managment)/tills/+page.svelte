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


	export let data: PageData;
    let balanceModalData: {
        show: boolean
        tillId: number
        balance: ITill['balance']
    } = {
        show: false,
        tillId: -1,
        balance: []
    }

    let tabs = {
        "Pokladny": {
            url: "/tills"
        }, 
        "Měny": {
            url: "/tills/currencies",
            disabled: true
        }
    };

    const transactionModalData: {
        reason: TransactionReason,
        type: TransactionType,
        tillId: number,
        show: boolean
    
    } = {
        reason: 'deposit',
        type: "cash",
        tillId: -1,
        show: false
    }

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

<ViewTitle title="Pokladny"/>
<TabSelector {tabs}/>


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

{#if data.tills.length === 0}
    <form method="POST" use:enhance action="?/newTill">
    <button type="submit" class="btn" >Přidat pokladnu</button>
    </form>
{/if}

<style lang="scss">
    @use "$lib/styles/vars" as vars;
    @use "$lib/styles/buttons" as buttons;

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
</style>
