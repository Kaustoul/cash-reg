<script lang="ts">
    import { customerStore } from '$lib/shared/stores/customerStore';
    import { formatSum, toNegative } from '$lib/shared/utils/money-sum-utils';
    import Decimal from 'decimal.js';
    import type { PageData } from './$types';
    import EditableForm from '$lib/componenets/interactables/EditableForm.svelte';
    import CashPaymentModal from '$lib/componenets/modals/CashPaymentModal.svelte';
    import QRPaymentModal from '$lib/componenets/modals/QRPaymentModal.svelte';
    import EditableFormButtons from '$lib/componenets/interactables/EditableFormButtons.svelte';
    import { tillSessionIdStore } from '$lib/shared/stores/sessionStore';

    export let data: PageData;

    $: tillSessionId = $tillSessionIdStore;
    let customer = data.customer;

    let editMode = false;
    let isSubmitting = false;
    let error: string | null = null;

    // Editable fields
    let formData = {
        name: customer.name,
        surname: customer.surname,
        email: customer.email ?? "",
        discount: customer.discount?.value?.toString() ?? ""
    };

    // Helper for unpaid orders count
    let unpaidOrdersCount = customer.unpaidOrders?.length ?? 0;
    let totalBalance = customerStore.calculateTotalBalance(customer);
    // let totalNegativeBalance = { value: totalBalance.value.replace('-', ''), currency: totalBalance.currency };

    let paymentValue = '';
    let showCashModal = false;
    let showQRModal = false;

    const fields = [
        { key: 'name', label: 'Jméno', value: formData.name.toString() },
        { key: 'surname', label: 'Příjmení', value: formData.surname.toString() },
        { key: 'email', label: 'Email', value: formData.email.toString() },
        { key: 'discount', label: 'Sleva (%)', value: formData.discount.toString() }
    ];
    let editedFields = fields.map(f => ({ ...f }));

    function setAmountFromCustomer() {
        if (paymentValue === '') {

            paymentValue =  formatSum(toNegative(totalBalance));
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
        if (customer.unpaidAmount && customer.unpaidAmount["CZK"])
            return formatSum(toNegative(totalBalance));
        
        return '0 Kč';
    }

    async function handleSave() {
        
        const name = editedFields.find(f => f.key === 'name')?.value ?? "";
        const surname = editedFields.find(f => f.key === 'surname')?.value ?? "";
        const email = editedFields.find(f => f.key === 'email')?.value ?? "";
        const discount = editedFields.find(f => f.key === 'discount')?.value ?? "";
        
        let dataToSend = new FormData();
        dataToSend.append('test', 'test'); // Placeholder for debugging

        console.log(Array.from(dataToSend.entries()));

        console.log("Form data to send:", {
            name,
            surname,
            email,
            discount
        }, "to customer:", customer);

        if (name.trim() === '' || surname.trim() === '') {
            error = "Jméno a příjmení nesmí být prázdné.";
            return;
        }

        if (name === customer.name && surname === customer.surname &&
            email === customer.email && discount === (customer.discount?.value?.toString() ?? "")) {
            editMode = false;
            return;
        }

        if (name !== customer.name) {
            dataToSend.append('name', name);
        }

        if (surname !== customer.surname) {
            dataToSend.append('surname', surname);
            console.log("Appending surname:", surname);
        }

        if (email !== customer.email) {
            dataToSend.append('email', email);
        }

        if (discount !== (customer.discount?.value?.toString() ?? "")) {
            dataToSend.append('discount', discount);
        }
        console.log(Array.from(dataToSend.entries()));

        isSubmitting = true;
        error = null;
        try {
            const res = await fetch(`?/editCustomer`, {
                method: 'POST',
                body: dataToSend
            });

            if (res.ok) {
                editMode = false;
                window.location.reload();
            } else {
                error = "Nepodařilo se uložit změny.";
                alert(error);
            }
        } catch (e) {
            error = "Chyba při komunikaci se serverem.";
            alert(error);
        } finally {
            isSubmitting = false;
        }
    }

    function handleCancel() {
        formData = {
            name: customer.name,
            surname: customer.surname,
            email: customer.email ?? "",
            discount: customer.discount?.value?.toString() ?? ""
        };
        editMode = false;
        error = null;
    }
</script>

<div class="container">
    <div class="customer-header">
        <div class="header-fields">
            <EditableForm
                {fields}
                bind:editedFields
                bind:editMode
            />
        </div>
        <div class="header-buttons">
            <EditableFormButtons
                bind:editMode
                onConfirm={handleSave}
                onCancel={handleCancel}
                bind:isSubmitting
            />
        </div>
    </div>


    <div class="balance-container">
        <div class="balance-section">
            <span class="label">Stav účtu</span>

            <div class="balance-row">
                <span class="balance-label gray">Zůstatek na účtu:</span>
                <span class="mono balance-value gray">
                    {formatSum(customer.balance ?? { 'CZK': "0" })}
                </span>
            </div>
            <div class="balance-row">
                <span class="balance-label gray">Neuhrazené nákupy:</span>
                <span class="mono balance-value gray">
                    {formatSum(customer.unpaidAmount ?? { "CZK": '0' })}
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
        {#if tillSessionId !== null}
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
        {/if}
    </div>
    
    <!-- <div class="discount-section">
        <span class="discount-label">Sleva:</span>
        <span class="discount-value">{customer.discount?.value ?? 0}{customer.discount?.type === 'PRC' ? '%' : customer.discount?.type === 'FLAT' ? ' Kč' : ''}</span>
    </div> -->
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

    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .customer-header {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        font-size: vars.$larger;
        max-height: 25rem;

        .header-fields {
            flex: 1 1 75%;
            width: 75%;

        }

        .header-buttons {
            display: flex;
            flex-direction: row;
            justify-content: center;
            flex: 1 0 20%;

            background-color: transparent;

            margin: 0;
        }
    }

    .header-buttons {
        display: flex;
        gap: 1rem;
        margin-left: auto;
        background-color: vars.$primary-color;
    }

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
        gap: 1rem;
        align-items: flex-start;
        margin-bottom: 1rem;
    }
    .field {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        font-size: 1.2rem;
    }
    .label {
        font-weight: bold;
        min-width: 7rem;
    }
    .buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    .accept-btn, .cancel-btn, .edit-btn {
        font-size: 1.1rem;
        padding: 0.5rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
    }
    .accept-btn { background: #4caf50; color: white; }
    .cancel-btn { background: #ccc; }
    .edit-btn { background: #1976d2; color: white; }
    .error {
        color: #b71c1c;
        margin-top: 1rem;
        font-weight: bold;
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