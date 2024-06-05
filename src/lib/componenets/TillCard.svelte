<script lang="ts">
    import CloseIcon  from 'svelte-material-icons/CloseCircleOutline.svelte';
    import ListIcon from 'svelte-material-icons/ListBoxOutline.svelte';
    import WalletIcon from 'svelte-material-icons/WalletOutline.svelte';
    import EyeIcon from 'svelte-material-icons/EyeOutline.svelte';
    import PlusIcon from 'svelte-material-icons/Plus.svelte';
    import MinusIcon from 'svelte-material-icons/Minus.svelte';
    import type { ITill } from '$lib/shared/interfaces/till';
    import TillCardStatus from './TillCardStatus.svelte';

    export let till: ITill;
</script>

<div class="card">
    <TillCardStatus status={till.status} />

    <div class="card-body">
        <div class="card-left">
            <div class="card-title">
                <span class="title">Pokladna {till.id}</span>
            </div>
            <div class="card-suntitle">
                <span class="title">{till.status !== 'closed' ? "Přihlášen:": ''}</span>
            </div>

        </div>
            {#if true}
                <button type="button"
                class="btn-red "
                on:click={() => {}}
                >
                    <CloseIcon size="2.5rem" />
                    Zavřít pokladnu
                </button>
            {/if}

        <div class="card-transactions">
                <button type="button"
                    class="btn-green"
                    on:click={() => {}}
                >
                    <PlusIcon size="2.5rem" />
                    Vklad
                </button>
                <button type="button"
                    class="btn-red"
                    on:click={() => {}}
                >
                    <MinusIcon size="2.5rem" />
                    Výběr
                </button>           
        </div>
            <div class="card-actions">

                <button type="button"
                    class="btn"
                    on:click={() => {}}
                >
                    <ListIcon size="1.5rem" />
                    Transakce
                </button>
                <button type="button"
                    class="btn"
                    on:click={() => {}}
                >
                    <WalletIcon size="1.5rem" />
                    Zůstatek
                </button>
                <button type="button"
                    class="btn"
                    on:click={() => {}}
                >
                    <EyeIcon size="1.5rem" />
                    Kontrola    
                </button>
            </div>
    </div>
</div>

<style lang="scss">
    @use "$lib/styles/vars" as vars;
    @use "$lib/styles/buttons" as buttons;
    
    .card {
        display: flex;
        gap: 0.5rem;
    }

    .card-left {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1 1 50%;
    }
        
    .card-lower-actions {
        display: flex;
        gap: 1rem;
    }

    
    .card-body {
        background-color: vars.$bg-color;
        border-radius: vars.$large-radius;
        flex-grow: 1;
        display: flex;
        gap: 1rem;
        padding: 1rem 2rem;
    }

    .card-title {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .card-buttons {
        display: flex;
        gap: 1rem;
        justify-content: left;
        align-items: center;
        flex: 1 1 50%;
        padding-top: 2rem;

    }

    .card-right-buttons {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        gap: 0.5rem;
    }

    .title {
         font-size: xx-large;
         font-weight: bold;
    }

    .btn {
        @include buttons.btn($btn-color: vars.$primary-color);
        padding: 0.5rem;
    }

    .btn-red {
        @include buttons.btn($btn-color: vars.$red);
        font-size: x-large;
    }

    .btn-green {
        @include buttons.btn($btn-color: vars.$green);
        font-size: x-large;
    }

    .btn-accent {
        @include buttons.btn($btn-color: vars.$accent-color);
    }
</style>
