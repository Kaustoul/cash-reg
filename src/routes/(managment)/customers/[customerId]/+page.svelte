<script lang="ts">
    import { customerStore } from '$lib/shared/stores/customerStore';
    import { formatSum } from '$lib/shared/utils/money-sum-utils';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import Decimal from 'decimal.js';
    import type { PageData } from './$types';

    export let data: PageData;
    const customer = data.customer;
    let totalBalance = customerStore.calculateTotalBalance(customer)[0];

    // Helper for unpaid orders count
    const unpaidOrdersCount = customer.unpaidOrders?.length ?? 0;
</script>

<ViewTitle title={customer.name + ' ' + customer.surname} showBackArrow={true} />

<div class="cards-container">

</div>
<div >
    <div class="balance-container">
        <div class="balance-section">
            <span class="label">Stav účtu</span>

            <div class="balance-row">
                <span class="balance-label gray">Zůstatek na účtu:</span>
                <span class="mono balance-value gray">
                    {formatSum(customer.balance[0] ?? { value: '0', currency: 'CZK' })}
                </span>
            </div>
            <div class="balance-row">
                <span class="balance-label gray">Neuhrazené nákupy:</span>
                <span class="mono balance-value gray">
                    {formatSum(customer.unpaidAmount?.[0] ?? { value: '0', currency: 'CZK' })}
                </span>
            </div>
            <hr class="section-divider" />
            <div class="balance-row total">
                <span class="balance-label">Celkem:</span>
                <span class="mono balance-value {new Decimal(totalBalance?.value ?? 0).lt(0) ? 'red' : 'green'}">
                    {formatSum(totalBalance ?? { value: '0', currency: 'CZK' })}
                </span>
            </div>
        </div>
        <div class="unpaid-orders-section">
            <span class="label">Neuhrazené objednávky</span>
            <hr class="section-divider" />
            <span class="unpaid-orders {unpaidOrdersCount > 0 ? 'red' : 'green'}">{unpaidOrdersCount}</span>
        </div>
        <div class="payment-section">
            
        </div>
    </div>
    
    <div class="discount-section">
        <span class="discount-label">Sleva:</span>
        <span class="discount-value">{customer.discount?.value ?? 0}{customer.discount?.type === 'PRC' ? '%' : customer.discount?.type === 'FLAT' ? ' Kč' : ''}</span>
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/text-styles' as text_styles;

    .balance-container {
        display: flex;
        flex-direction: row;
        background-color: vars.$bg-color;
        border-radius: vars.$large-radius;
        padding: 1rem;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
    }

    .payment-section {
        display: flex;
        flex-direction: column;
        flex-basis: 20%;

        background-color: vars.$content-bg-color;
        border-radius: vars.$medium-radius;
        padding: 1rem 1.5rem 1.5rem 1.5rem;
        gap: .5rem;
    }

    .unpaid-orders-section {
        display: flex;
        flex-direction: column;
        flex-basis: 20%;
        justify-content: center;

        background-color: vars.$content-bg-color;
        border-radius: vars.$medium-radius;
        padding: 1rem 1.5rem 1.5rem 1.5rem;
        gap: .5rem;
    }

    .balance-section {
        background: vars.$bg-color;
        border-radius: vars.$small-radius;
        padding: 1rem 1.5rem 1.5rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        flex-basis: 50%;

        background-color: vars.$content-bg-color;
        border-radius: vars.$medium-radius;
    }

    .customer-detail-modal {
        background: vars.$content-bg-color;
        border-radius: vars.$medium-radius;
        padding: 3rem;
        max-width: 40rem;
        margin: 2rem auto;
        box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
    }

    .customer-header {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .customer-title {
        font-size: 2.5rem;
        font-weight: bold;
        color: vars.$accent-color;
    }

    .customer-email {
        font-size: 1.2rem;
        color: vars.$text2-color;
        font-family: 'Roboto Mono', monospace;
    }

    .balance-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1.5rem;
        font-size: 1.5rem;
    }

    .balance-row.total {
        font-size: 2rem;
        font-weight: bold;
    }

    .balance-label {
        min-width: 13rem;
        color: vars.$text-color;
    }

    .gray {
        color: vars.$text2-color;
    }

    .balance-value {
        @include text_styles.mono-font;
    }

    .unpaid-orders {
        font-size: vars.$xx-large;
        font-weight: bold;
        text-align: center;
    }

    .discount-section {
        margin-top: 1.5rem;
        font-size: 1.3rem;
        color: vars.$accent-color;
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .discount-label {
        font-weight: bold;
    }

    .discount-value {
        font-family: 'Roboto Mono', monospace;
        font-size: 1.3rem;
    }

    .mono {
        @include text_styles.mono-font;
    }

    .red {
        color: vars.$red;
    }

    .green {
        color: vars.$green;
    }

    .section-divider {
        border: none;
        border-bottom: 2px solid vars.$second-accent-color;
        margin: .5rem 0;
    }

    .label {
        font-size: vars.$large;
        font-weight: bold;
        text-align: center;
    }
</style>