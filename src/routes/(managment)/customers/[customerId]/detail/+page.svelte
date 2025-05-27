<script lang="ts">
    import { customerStore } from '$lib/shared/stores/customerStore';
    import { formatSum } from '$lib/shared/utils/money-sum-utils';
    import Decimal from 'decimal.js';
    import type { PageData } from './$types';
    import CashPaymentModal from '$lib/componenets/modals/CashPaymentModal.svelte';
    import QRPaymentModal from '$lib/componenets/modals/QRPaymentModal.svelte';

    export let data: PageData;

    let customer = data.customer;

    // Helper for unpaid orders count
    let unpaidOrdersCount = customer.unpaidOrders?.length ?? 0;
    let totalBalance = customerStore.calculateTotalBalance(customer)[0];
    let totalNegativeBalance = { value: totalBalance.value.replace('-', ''), currency: totalBalance.currency };

    let paymentValue = '';
    let showCashModal = false;
    let showQRModal = false;

    function setAmountFromCustomer() {
        if (paymentValue === '') {

            paymentValue =  totalNegativeBalance.value;
        }
    }

    function openCashModal() {
        setAmountFromCustomer();
        showCashModal = true;
    }

    function openQRModal() {
        setAmountFromCustomer();
        showQRModal = true;
    }

    async function onConfirmDeposit(type: 'cash' | 'qr') {
        const res = await fetch(`/api/customers/${customer.customerId}/topUp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: paymentValue,
                type
            })
        });

        if (res.ok) {
            showCashModal = false;
            showQRModal = false;
            paymentValue = '';
            window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        } else {
            alert('Platba se nezdařila.');
        }
    }

    function inputPlaceholder() {
        if (customer.unpaidAmount && customer.unpaidAmount.length > 0)
            return formatSum(totalNegativeBalance);
        
        return '0 Kč';
    }
</script>


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
                <span class="mono balance-value {new Decimal(totalBalance.value ?? 0).lt(0) ? 'red' : 'green'}">
                    {formatSum(totalBalance)}
                </span>
            </div>
        </div>
        <div class="unpaid-orders-section">
            <span class="label">Neuhrazené objednávky</span>
            <hr class="section-divider" />
            <span class="unpaid-orders {unpaidOrdersCount > 0 ? 'red' : 'green'}">{unpaidOrdersCount}</span>
        </div>
        <div class="payment-section">
            <label class="payment-label" for="payment-input">Vložit na účet</label>
            <input
                id="payment-input"
                class="payment-input mono"
                type="number"
                min="0"
                bind:value={paymentValue}
                placeholder={inputPlaceholder()}
            />
            <div class="payment-buttons">
                <button class="btn btn-green" type="button" on:click={openCashModal}>Hotově</button>
                <button class="btn btn-blue" type="button" on:click={openQRModal}>QR kód</button>
            </div>
        </div>
    </div>
    
    <div class="discount-section">
        <span class="discount-label">Sleva:</span>
        <span class="discount-value">{customer.discount?.value ?? 0}{customer.discount?.type === 'PRC' ? '%' : customer.discount?.type === 'FLAT' ? ' Kč' : ''}</span>
    </div>
</div>

{#if showCashModal}
    <CashPaymentModal
        amount={new Decimal(paymentValue)}
        onCancel={() => {showCashModal = false; paymentValue=''}}
        onConfirm={() => onConfirmDeposit("cash")}
    />
{/if}
{#if showQRModal}
    <QRPaymentModal
        amount={new Decimal(paymentValue)}
        appSettings={data.settings}
        onCancel={() => {showQRModal = false; paymentValue=''}}
        onConfirm={() => onConfirmDeposit("qr")}
    />
{/if}

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
        justify-content: space-evenly;
        flex: 1 0 25%;
        gap: .6rem;

        background-color: vars.$content-bg-color;
        border-radius: vars.$medium-radius;
        padding: 1.5rem;
    }
    .payment-label {
        font-size: vars.$large;
        font-weight: bold;
        margin-bottom: .5rem;
        text-align: center
    }
    .payment-input {
        @include text_styles.mono-font;
        @include inputs.number;
        font-size: vars.$larger;
        margin: .4rem 0 1rem 0;
        text-align: center;
    }
    .payment-buttons {
        display: flex;
        gap: 1rem;
        justify-content: stretch;
    }
    .btn-green {
        @include buttons.btn($btn-color: vars.$green, $btn-height: 3.5rem);
        font-weight: bold;

    }
    .btn-blue {
        @include buttons.btn($btn-color: vars.$blue, $btn-height: 3.5rem);
        font-weight: bold;

    }

    .unpaid-orders-section {
        display: flex;
        flex-direction: column;
        flex: 0 0 15%;
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
        flex: 1 1 50%;

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