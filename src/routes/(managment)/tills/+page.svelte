<script lang="ts">
    import { enhance } from '$app/forms';
    import TabSelector from '$lib/TabSelector.svelte';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import TillCard from '$lib/componenets/TillCard.svelte';
    import TransactionModal from '$lib/componenets/modals/TransactionModal.svelte';
    import type { PageData } from './$types';
    import Modal from '$lib/componenets/modals/Modal.svelte';
    import type { ITill } from '$lib/shared/interfaces/till';
    import { CurrencyManager } from '$lib/shared/prices/currency-manager';
    import { formatSum } from '$lib/shared/utils/money-sum-utils';
    import type { IMoneySum } from '$lib/shared/interfaces/money-sum';


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
        type: 'deposit' | 'withdraw',
        tillId: number,
        show: boolean
    
    } = {
        type: 'deposit',
        tillId: -1,
        show: false
    }

    function openTransactionModal(tillId: number, type: 'deposit' | 'withdraw') {
        transactionModalData.tillId = tillId;
        transactionModalData.type = type;
        transactionModalData.show = true;
    }

    function getFormattedSum(sums: IMoneySum[]): string {
        const zeroSum = {currency: 'CZK', value: '0'};
        if (sums.length === 0) {
            return formatSum(zeroSum);
        }

        return formatSum(balanceModalData.balance[0] ?? zeroSum);
    }

    $: console.log(balanceModalData);
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

<TransactionModal 
    type={transactionModalData.type} 
    bind:showModal={transactionModalData.show}
    tillId={transactionModalData.tillId} 
/>

<ViewTitle title="Pokladny"/>
<TabSelector {tabs}/>


{#each data.tills as till}
    <TillCard 
        {till} 
        onOpenTransaction={openTransactionModal} 
        onOpenBalance={() => balanceModalData = {
            tillId: till.id,
            balance: till.balance,
            show: true
        }}
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
