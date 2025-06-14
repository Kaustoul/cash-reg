<script lang="ts">
    import Decimal from "decimal.js";
    import QrCode from "../QRCode.svelte";
    import FullscreenModal from "./FullscreenModal.svelte";
    import { formatDecimal } from "$lib/shared/utils";
    import type { ISettings } from "$lib/shared/interfaces/settings";
    import { shoppingCartStore } from "$lib/shared/stores/shoppingCartStore";
    import { formatSum } from "$lib/shared/utils/money-sum-utils";
    import type { IMoneySum } from "$lib/shared/interfaces/money-sum";

    export let appSettings: ISettings;
    export let amount: Decimal | undefined = undefined;

    export let onCancel: () => void;
    export let onConfirm: () => void;

    $: ({ carts, selectedCart } = $shoppingCartStore);
    $: cart = carts[selectedCart];
</script>

<FullscreenModal showModal={true} onCancel={onCancel} onConfirm={onConfirm}>
    <div class="qr-payment">
        <div class="left">
            <div class="header">
                <span class="title">QR Platba</span>
                <span class="subtitle">Načtěte QR kód v aplikaci Vaší banky</span>
            </div>
            <div>
                <div class="sum">
                    <span class="sum-title">Částka: </span>
                    {#if amount}
                    <span class="sum-value">{formatDecimal(amount) + "Kč"}</span>
                    {:else}
                        {#if cart}
                            <span class="sum-value">{formatSum(cart.total["CZK"])}</span>
                        {:else}
                            <span class="sum-value">{formatDecimal(new Decimal(0))} Kč</span>
                        {/if}
                    {/if}
                </div>
                <hr>
            </div>
            <div class="spacer" />
        </div>
        <QrCode 
            sum={formatDecimal(amount ? amount : new Decimal(cart.total["CZK"].value))}
            sepa={appSettings.sepaSettings}
        />

    </div>
</FullscreenModal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .qr-payment {
    
        display: flex;

        justify-content: space-between;
        gap: 3rem;
        padding: 3rem;

    }

    .left {
        flex-grow: 1;
        max-width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
    }

    .title {
        font-size: 5rem;
        font-weight: bold;
    }

    .subtitle {
        font-size: x-large;
        color: vars.$text2-color;
    }

    .header {
        display: flex;
        flex-direction: column;
    }

    .sum {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    .sum-title {
        font-size: vars.$x-large;
        font-weight: bold;
    }

    .sum-value {
        font-size: vars.$x-large;
        color: vars.$accent-color;
        font-weight: bold;
        font-family: 'Roboto Mono', monospace;
    }

    hr {
        border-color: vars.$second-accent-color;
    }
</style>

