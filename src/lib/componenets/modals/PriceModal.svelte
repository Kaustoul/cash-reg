<script lang="ts">
    import Modal from '$lib/componenets/modals/Modal.svelte';
    import ConditionInput from './ConditionInput.svelte';
    import { page } from '$app/stores';

    export let showModal: boolean = false;
    export let units: string;

    export let formData = {
        priceValue: '',
        priceType: 'base',
        minQuantity: '',
        maxQuantity: '',
        isActive: true,
        showConditionsInputs: false,
        priceId: -1,
        method: "POST"
    }

    let title: string = formData.method === 'POST' ? "Přidat novou cenu" : "Upravit cenu";
    let confirmText: string = formData.method === 'POST' ? "Přidat" : "Upravit";

    let form: any;

    async function handleSubmit(e: Event) {
        e.preventDefault();
        const detail = {
            amount: { 
                "CZK": formData.priceValue.toString(),
            },
            priceType,
            minQuantity: formData.minQuantity ? Number(formData.minQuantity) : null,
            maxQuantity: formData.maxQuantity ? Number(formData.maxQuantity) : null,
            isActive: formData.isActive,
            priceId: formData.priceId > 0 ? formData.priceId : undefined
        };

        showModal = false;

        const endpoint = formData.method === "POST"
            ? `/api/products/${$page.params.productId}/price` 
            : `/api/products/${$page.params.productId}/price/${formData.priceId}/edit`;

        const res = await fetch(endpoint, {
            method: formData.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(detail)
        });

        if (res.ok) {
            window.location.reload();
        } else {
            alert('Nepodařilo se přidat nebo upravit cenu.');
        }
    }

    $: priceType = formData.showConditionsInputs ? 'tiered' : 'base';
</script>

<Modal bind:showModal>
    <div slot="header">
        {title}
    </div>
    <form bind:this={form} on:submit={handleSubmit}>
        <label>
            Aktivní
            <input type="checkbox" class="checkbox" bind:checked={formData.isActive} />
        </label>
        <label>
            Cena
            <div>
                <input type="number"
                    name="value"
                    class="number-input"
                    min="0"
                    step="1"
                    placeholder="1600"
                    bind:value={formData.priceValue}
                    required
                />
            </div>
        </label>
        <label>
            Množstevní podmínka
            <input 
                type="checkbox"
                class="checkbox"
                bind:checked={formData.showConditionsInputs}
            />
        </label>
        <div class="cond-inputs {formData.showConditionsInputs ? '' : 'hidden'}">
            <ConditionInput units={units} bind:min={formData.minQuantity} bind:max={formData.maxQuantity}/>
        </div>
        <div class="footer">
            <button class="btn" type="submit">
                {confirmText}
            </button>
        </div>
    </form>
</Modal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        min-width: 60rem;
    }

    label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: x-large;
    }

    .footer {
        display: flex;
        justify-content: center;

        .btn {
            @include buttons.btn($btn-color: vars.$green);
            margin-top: 1.5rem;
            font-size: x-large;
            height: 3.5rem;
            width: 20rem;
            flex-grow: 0;
        }
    }

    .hidden {
        opacity: 0;
        pointer-events: none; 
    }

    .checkbox {
        @include inputs.checkbox;
    }

    .number-input {
        @include inputs.number;
        text-align: right;
    }
</style>
