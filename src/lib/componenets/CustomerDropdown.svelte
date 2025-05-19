<script lang="ts">
    import AddCustomerIcon from "svelte-material-icons/AccountPlus.svelte";
    import CustomerIcon from "svelte-material-icons/AccountMinus.svelte";

    import SearchBar from "$lib/componenets/SearchBar.svelte";
    import Modal from "$lib/componenets/modals/Modal.svelte";
    import CustomerForm from "$lib/componenets/CustomerForm.svelte";
    import { customerStore } from "$lib/shared/stores/customerStore";
    import { derived } from "svelte/store";
    import { shoppingCartStore } from "$lib/shared/stores/shoppingCartStore";
    import type { ICustomer } from "$lib/shared/interfaces/customer";
    import { onMount } from "svelte";

    let showCustomerDropdown = false;
    let showCustomerFormModal = false;
    let searchResults: ICustomer[] = [];

    function handleClickOutside(event: MouseEvent) {
        const dropdown = document.getElementById('customer-dropdown');
        const container = document.getElementById('customer-container');
        if (dropdown && container && 
            !container.contains(event.target as Node)) {
            showCustomerDropdown = false;
        }
    }

    function selectCustomer(customer: ICustomer) {
        shoppingCartStore.setCustomer(customer);
        showCustomerDropdown = false;
    }

    function handleCustomerCreated(event) {
        const customer = event.detail;
        shoppingCartStore.setCustomer(customer.id);
        showCustomerFormModal = false;
        showCustomerDropdown = false;
    }

    $: console.log(showCustomerDropdown)

    $: ({ carts, selectedCart } = $shoppingCartStore);
    $: cart = carts[selectedCart];

    $: customer = derived(
        customerStore,
        $customers => $customers.find(c => c.customerId === cart.customerId)
    );

    onMount(() => {
        customerStore.load();
    });
</script>

<svelte:window on:click={handleClickOutside}/>

<div class="customer-header-area {cart.customerId && $customer ? 'customer-selected' : 'customer-empty'}">
    {#if cart.customerId && $customer}
        <div class="customer-data-area">
            <div class="customer-header-label">
                <span>
                    Zákazník:
                </span>
                <span class="customer-name">{$customer.name} {$customer.surname}</span>
            </div>
            <div class="customer-main-line">
                {#if $customer.discount}
                <div class="customer-discount-label">
                    <span class="customer-discount">Sleva: {$customer.discount.value}% </span>
                    <span class="customer-discount">na nákup</span>
                </div>
                {/if}
            </div>
        </div>
    {/if}
    <div class="customer-dropdown-wrapper">
        <button type="button"
            class="add-customer-btn"
            on:click={() => {
                if (cart.customerId && $customer) {
                    shoppingCartStore.setCustomer(null); // Remove customer from cart
                } else {
                    showCustomerDropdown = !showCustomerDropdown;
                }
            }}
        >   
        <div class="customer-icon">
            {#if cart.customerId}
                <CustomerIcon size="4rem"/>
            {:else}
                <AddCustomerIcon size="4rem"/>
            {/if}
        </div>
        </button>
        {#if showCustomerDropdown}
            <div id="customer-dropdown" class="customer-dropdown">
                <div class="search-container">
                    <SearchBar
                        data={$customerStore}
                        keys={["name", "surname", "email"]}
                        bind:results={searchResults}
                    />
                </div>
                <div class="customers-list">
                    {#each searchResults as customer}
                        <button 
                            class="customer-item"
                            on:click={() => selectCustomer(customer)}
                        >
                            <div class="customer-info">
                                <span class="customer-name">{customer.name} {customer.surname}</span>
                                <span class="customer-email">{customer.email}</span>
                            </div>
                        </button>
                    {/each}
                </div>
                <button class="new-customer-btn" on:click={() => showCustomerFormModal = true}>
                    + Nový zákazník
                </button>
            </div>
        {/if}
    </div>
</div>

<Modal bind:showModal={showCustomerFormModal}>
    <div slot="header">Nový zákazník</div>
    <CustomerForm on:submit={handleCustomerCreated} />
</Modal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .customer-header-area {
        display: flex;
        align-items: center;
        height: 3.5rem;
        min-height: 3.5rem;
        max-height: 4.5rem;
        background: none;
        flex: 1 1 40%;
        gap: 1.5rem;
        max-width: 60%;
        background-color: vars.$content-bg-color;
        border-radius: vars.$medium-radius;
        padding: .8rem;
        margin-right: .5rem;
    }

    .customer-header-label {
        display: flex;
        flex-direction: column;
        font-size: vars.$normal;
        color: vars.$text-color;
    }

    .customer-icon-area {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .customer-data-area {
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;
        flex: 1 1 60%;
        min-width: 0;
    }

    .customer-main-line {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        justify-content: space-between;
    }

    .customer-name {
        font-size: vars.$large;
        font-weight: bold;
        color: vars.$text-color;
        line-height: 1.2;
    }

    .customer-discount {
        font-size: vars.$normal;
        color: vars.$accent-color;
        font-weight: normal;
    }

    .customer-email {
        font-size: vars.$normal;
        color: vars.$text2-color;
        margin-top: 0.2rem;
        line-height: 1.1;
        font-family: 'Roboto Mono', monospace;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .add-customer-btn {
        @include buttons.div-btn;
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: vars.$large;
        color: vars.$text-color;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
    }

    button {
        @include buttons.div-btn;
        cursor: pointer;
    }

    .customer-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.5rem;
        background-color: vars.$content-bg-color;
        border: 1px solid vars.$primary-color;
        border-radius: vars.$medium-radius;
        z-index: 100;
        min-width: 300px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .customer-discount-label {
        display: flex;
        flex-direction: column;
    }

    .search-container {
        padding: 1rem;
        border-bottom: 1px solid vars.$primary-color;
    }

    .customers-list {
        max-height: 300px;
        overflow-y: auto;
        @include inputs.scrollable;
    }

    .customer-item {
        width: 100%;
        padding: 1rem;
        text-align: left;
        border: none;
        background: none;
        color: vars.$text-color;
        
        &:hover {
            background: vars.$highlight-color;
        }

        &:not(:last-child) {
            border-bottom: 1px solid vars.$primary-color;
        }
    }

    .customer-info {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .new-customer-btn {
        @include buttons.btn($btn-color: vars.$accent-color);
        padding: 1rem;
        margin: .5rem;
        text-align: center;
        font-weight: bold;
    }

    .customer-dropdown-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .customer-selected {
        background-color: vars.$content-bg-color;
    }

    .customer-empty {
        background-color: vars.$bg-color;
        max-width: fit-content;
    }
</style>