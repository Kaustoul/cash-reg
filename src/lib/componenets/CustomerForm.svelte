<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ICustomer } from "$lib/shared/interfaces/customer";
    import type { IDiscount } from "$lib/shared/interfaces/discount";
    import type { IMoneySum } from "$lib/shared/interfaces/money-sum";
    import { onMount } from "svelte";

    export let submitLabel: string = "Vytvořit zákazníka";
    
    const dispatch = createEventDispatcher();
    
    let customer: Partial<ICustomer> = {};
    let name = customer.name ?? "";
    let surname = customer.surname ?? "";
    let email = customer.email ?? "";
    let discountValue = customer.discount?.value ?? "10";
    export let onSubmit: (customerId: number) => void = () => {};

    async function handleSubmit(e: Event) {
        e.preventDefault();
        let discount: IDiscount | null = null;
        if (discountValue && discountValue !== "0") {
            discount = {
                value: discountValue,
                type: "PRC",
                source: "customer"
            };
        }

        // Send to backend API
        const res = await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, email, discount })
        });
        if (res.ok) {
            const result = await res.json();
            onSubmit(result.id);
            // dispatch("submit", { id: result.id, name, surname, email, discount, balance: balanceValue });
        } else {
            // handle error
            alert("Chyba při ukládání zákazníka.");
        }
    }

    let customers: ICustomer[] = [];
    let loading = true;
</script>

<form class="customer-form" on:submit|preventDefault={handleSubmit}>
    <label>
        Jméno *
        <input type="text" bind:value={name} required />
    </label>
    <label>
        Příjmení *
        <input type="text" bind:value={surname} required />
    </label>
    <label>
        Email
        <input type="email" bind:value={email} />
    </label>
    <label>
        Sleva
        <div class="discount-field">
            <input type="number" min="0" max="100" bind:value={discountValue} />
            <span class="discount-prefix">%</span>
        </div>
    </label>
    <button type="submit" class="accent-btn btn">{submitLabel}</button>
</form>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .customer-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-width: 100%;
    }
    label {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    input, textarea {
        @include inputs.text;
        // padding: 0.5rem;
        // border-radius: 0.3rem;
        // border: 1px solid vars.$border-color;
    }
    .btn, .accent-btn {
        @include buttons.btn($btn-color: vars.$accent-color, $btn-height: 4rem);
        margin-top: 1rem;
        font-size: vars.$large;
        font-weight: bold;
    }
    .discount-field {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .discount-prefix {
        font-weight: bold;
    }
</style>