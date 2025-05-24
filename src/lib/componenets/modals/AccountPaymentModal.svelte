<script lang="ts">
    import FullscreenModal from "./FullscreenModal.svelte";
    import { shoppingCartStore } from "$lib/shared/stores/shoppingCartStore";
    import { formatDecimal } from "$lib/shared/utils";
    import Decimal from "decimal.js";
    import { customerStore } from "$lib/shared/stores/customerStore";
    import { get, derived } from "svelte/store";
    import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
    import { ne } from "drizzle-orm";
    import { formatSum, sumMoneySums } from "$lib/shared/utils/money-sum-utils";

    $: ({ carts, selectedCart } = $shoppingCartStore);
    $: cart = carts[selectedCart];

    // Find the customer info
    $: customer = derived(
        customerStore,
        $customers => $customers.find(c => c.customerId === cart.customerId)
    );

    $: sum = cart?.total?.["CZK"] ? new Decimal(cart.total["CZK"].value) : new Decimal(0);
    let totalBalance: IMoneySum[] = [];
    let newBalance: IMoneySum[] = [];
    $: if ($customer) {
        totalBalance = customerStore.calculateTotalBalance($customer);
        newBalance = sumMoneySums([ 
            totalBalance,
            [{ currency: "CZK", value: "-" + sum.toString() }]
        ]);
    }


    function onConfirm() {
        shoppingCartStore.finalizeCart();
    }

    function onCancel() {
        shoppingCartStore.cancelPayment();
    }
</script>

<FullscreenModal showModal={true} onCancel={onCancel} onConfirm={onConfirm}>
    <div class="account-payment">
        <span class="title">Platba na účet zákazníka</span>
        <div class="content">
            {#if $customer}
                <div class="customer-info">
                    <!-- <span class="customer-title">Zákazník:</span> -->
                    <span class="customer-name">{$customer.name}</span> 
                    <span class="customer-surname">{$customer.surname}</span>
                    {#if $customer.email}
                        <span class="customer-email">{$customer.email}</span>
                    {/if}
                    <!-- <span class="customer-balance">
                        Aktuální dluh: 
                            {formatDecimal(new Decimal(
                                customerStore.calculateTotalBalance($customer)[0].value))} Kč
                    </span> -->
                </div>
            {:else}
                <div class="customer-info error">
                    <span>Žádný zákazník není vybrán!</span>
                </div>
            {/if}
            <div class="sum">
                <div class="sum-line">
                    <span class="sum-title">Aktuální stav účtu: </span>
                    <span class="sum-value mono {new Decimal(totalBalance[0].value).lt(0) ? 'red' : 'green'}">
                        {formatSum(totalBalance[0])}
                    </span>
                </div>
                <div class="sum-line">
                    <span class="sum-title">Zaplatit na účet: </span>
                    <span class="sum-value mono">{formatDecimal(sum)} Kč</span>
                </div>
                <hr class="section-divider">
                <div class="sum-line">
                    <span class="sum-title">Nový stav účtu: </span>
                    <span class="sum-value mono {new Decimal(newBalance[0].value).lt(0) ? 'red' : 'green'}">
                        {formatSum(newBalance[0])}
                    </span>
                </div>
            </div>
        </div>
        <div class="info">
            Tato účtenka bude přidána na účet zákazníka jako neuhrazená nebo bude zaplacena z účtu zákazníka.
        </div>
    </div>
</FullscreenModal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/text-styles' as textStyles;

    .account-payment {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 3rem;
        padding: 3rem;
    }

    .content {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        width: 100%;
        padding: 2rem;
        box-sizing: border-box
    }

    .title {
        font-size: 4rem;
        font-weight: bold;
    }

    .customer-info {
        display: flex;
        flex-direction: column;
        flex: 1 0 45%;
        gap: 0.5rem;
        .customer-title {
            font-size: vars.$x-large;
            font-weight: bold;
        }
        .customer-name {
            font-size: vars.$x-large;
        }
        .customer-surname {
            font-size: vars.$xx-large;
        }
        .customer-balance {
            color: vars.$accent-color;
            font-weight: bold;
        }
        .customer-email {
            color: vars.$text2-color;
            font-size: vars.$large;
        }
        &.error {
            color: vars.$red;
            font-weight: bold;
        }
    }

    .sum {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        width: 100%;
        flex: 1 0 45%;
    }

    .sum-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5rem;
        width: 100%;
        margin-bottom: 1rem;
    }

    .sum-title {
        font-size: vars.$larger;
    }

    .sum-value {
        font-weight: bold;
        font-size: vars.$large;
    }

    .info {
        margin-top: 2rem;
        font-size: large;
        color: vars.$text2-color;
    }

    .section-divider {
        width: 100%;
        border: none;
        border-bottom: 2px solid vars.$second-accent-color;
    }

    .red {
        color: vars.$red;
    }

    .green {
        color: vars.$green;
    }

    .mono {
        @include textStyles.mono-font;
    }
</style>