<script lang="ts">
    import CloseIcon  from 'svelte-material-icons/CloseCircleOutline.svelte';
    import ListIcon from 'svelte-material-icons/ListBoxOutline.svelte';
    import WalletIcon from 'svelte-material-icons/WalletOutline.svelte';
    import EyeIcon from 'svelte-material-icons/EyeOutline.svelte';
    import PlusIcon from 'svelte-material-icons/Plus.svelte';
    import MinusIcon from 'svelte-material-icons/Minus.svelte';
    import type { ITill } from '$lib/shared/interfaces/till';
    import TillCardStatus from './TillCardStatus.svelte';
    import LoginIcon from 'svelte-material-icons/LoginVariant.svelte';
    import LogoutIcon from 'svelte-material-icons/LogoutVariant.svelte';
    import { goto } from '$app/navigation';

    export let till: ITill;
    export let onDeposit: (tillId: number, amount: number) => void;
    export let onWithdraw: (tillId: number, amount: number) => void;
    export let onOpenBalance: () => void;

    let amountInput = "";

    function handleDeposit() {
        const amount = Number(amountInput);
        if (!isNaN(amount) && amount > 0) {
            onDeposit(till.id, amount);
            amountInput = "";
        }
    }

    function handleWithdraw() {
        const amount = Number(amountInput);
        if (!isNaN(amount) && amount > 0) {
            onWithdraw(till.id, amount);
            amountInput = "";
        }
    }
</script>

<div class="till-card">
    <div class="till-card-header">
        <TillCardStatus status={till.status} />
    </div>
    <div class="till-card-content">
        <div class="till-card-title">
            <span class="title">Pokladna {till.id}</span>
            {#if till.status === 'closed'}
                <button class="open-till-btn"
                    on:click={() => till.status = 'open'}
                >
                    <LoginIcon size="1.5rem" />
                    Přihlásit se k pokladně
                </button>
            {:else}
                <button class="close-till-btn"
                    on:click={() => till.status = 'closed'}
                >
                    <LogoutIcon size="1.5rem" />
                    Odhlásit se s kontrolou
                </button>
            {/if}
        </div>
        <div class="till-card-actions">
            <button type="button" class="btn" on:click={onOpenBalance}>
                <WalletIcon size="1.5rem" />
                Zůstatek
            </button>
            <button type="button" class="btn" on:click={() => goto(`/tills/${till.id}/audit`)}>
                <EyeIcon size="1.5rem" />
                Kontrola    
            </button>
            <button type="button" class="btn" on:click={() => goto(`/tills/${till.id}/transactions`)}>
                <ListIcon size="1.5rem" />
                Transakce
            </button>
        </div>
    </div>
    <div class="till-card-deposit">
        <span class="deposit-title">Vklad / Výběr</span>
        <input
            type="number"
            class="deposit-input"
            bind:value={amountInput}
            min="0"
            placeholder="Zadejte částku"
        />
        <div class="deposit-buttons">
            <button type="button" class="btn-green {amountInput === '' ? 'disabled' : ''}" on:click={handleDeposit}>
                <PlusIcon size="2.5rem" /> Vklad
            </button>
            <button type="button" class="btn-red {amountInput === '' ? 'disabled' : ''}" on:click={handleWithdraw}>
                <MinusIcon size="2.5rem" /> Výběr
            </button>           
        </div>
    </div>
</div>

<style lang="scss">
    @use "$lib/styles/vars" as vars;
    @use "$lib/styles/buttons" as buttons;
    @use "$lib/styles/inputs" as inputs;
    @use "$lib/styles/text-styles" as textStyles;

    .till-card {
        background-color: vars.$bg-color;
        border-radius: vars.$large-radius;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1.2rem;
    }

    .till-card-header {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 12%;
        height: calc(100% - 2rem);
    }

    .till-card-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
    }

    .open-till-btn {
        @include buttons.btn($btn-color: vars.$green, $btn-height: 3.5rem);
        
    }
    .close-till-btn {
        @include buttons.btn($btn-color: vars.$red, $btn-height: 3.5rem);
        
    } 

    .open-till-btn, .close-till-btn {
        max-width: 18rem;
        padding: 0.5rem 1.5rem;
    }

    .title {
        font-size: vars.$large;
        font-weight: bold;
    }

    .till-card-content {
        display: flex;
        flex-direction: column;
        flex: 1 1 75%;
        align-items: flex-start;
        justify-content: space-between;
        background-color: vars.$content-bg-color;
        border-radius: vars.$medium-radius;
        padding: 1.5rem;
        height: calc(100% - 3rem);
    }

    .till-card-actions {
        display: flex;
        gap: 1.2rem;
        flex: 0 0 50%;
        width: 100%;
        max-height: fit-content;
        justify-content: space-between;
    }

    .btn {
        @include buttons.btn($btn-color: vars.$primary-color, $btn-height: 3.5rem);
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        gap: 0.7rem;
        min-width: 10rem;
    }

    .btn-green {
        @include buttons.btn($btn-color: vars.$green, $btn-height: 3.5rem);
        font-weight: bold;
    }

    .btn-red {
        @include buttons.btn($btn-color: vars.$red, $btn-height: 3.5rem);
        font-weight: bold;
    }

    .till-card-deposit {
        background: vars.$content-bg-color;
        border-radius: vars.$medium-radius;
        padding: 1.5rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .7rem;
        flex: 0 0 25%;
    }

    .deposit-title {
        font-size: 1.4rem;
        font-weight: bold;
    }

    .deposit-input {
        @include inputs.number;
        width: 100%;
        text-align: center;
        margin-bottom: .5rem;
        font-size: vars.$larger;
    }

    .deposit-buttons {
        display: flex;
        gap: 1rem;
        width: 100%;
        justify-content: center;
    }
</style>
