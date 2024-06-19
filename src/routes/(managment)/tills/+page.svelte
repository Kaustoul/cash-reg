<script lang="ts">
    import { enhance } from '$app/forms';
    import TabSelector from '$lib/TabSelector.svelte';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import TillCard from '$lib/componenets/TillCard.svelte';
    import TransactionModal from '$lib/componenets/modals/TransactionModal.svelte';
    import type { PageData } from './$types';


	export let data: PageData;

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
</script>

<TransactionModal 
    type={transactionModalData.type} 
    bind:showModal={transactionModalData.show}
    tillId={transactionModalData.tillId} />

<ViewTitle title="Katalog"/>
<TabSelector {tabs}/>


{#each data.tills as till}
    <TillCard {till} onOpenTransaction={openTransactionModal}/>
{/each}

{#if data.tills.length === 0}
    <form method="POST" use:enhance action="?/newTill">
    <button type="submit" class="btn" >Přidat pokladnu</button>
    </form>
{/if}

<style lang="scss">
    @use "$lib/styles/vars" as vars;
    @use "$lib/styles/buttons" as buttons;
</style>
