<script lang="ts">
    import CustomerIcon from "svelte-material-icons/AccountPlus.svelte";
    import SearchBar from "$lib/componenets/SearchBar.svelte";
    import type { ICustomer } from "$lib/shared/interfaces/customer"; 

    let showCustomerDropdown = false;
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
        // TODO: Implement customer selection
        showCustomerDropdown = false;
    }
</script>

<svelte:window on:click={handleClickOutside}/>

<div class="customer-container" id="customer-container">
    <button type="button"
        class="add-customer-btn"
        on:click={() => showCustomerDropdown = !showCustomerDropdown}
    >
        <CustomerIcon size="4rem"/>
    </button>

    {#if showCustomerDropdown}
        <div id="customer-dropdown" class="customer-dropdown">
            <div class="search-container">
                <SearchBar
                    data={[]}
                    keys={["name", "email", "phone"]}
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
                            <span class="customer-name">{customer.name}</span>
                            <span class="customer-email">{customer.email}</span>
                        </div>
                    </button>
                {/each}
            </div>

            <button class="new-customer-btn" on:click={() => {}}>
                + Nový zákazník
            </button>
        </div>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .customer-container {
        position: relative;
        display: inline-block;
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

    .customer-name {
        font-weight: bold;
    }

    .customer-email {
        font-size: 0.9em;
        color: vars.$text2-color;
    }

    .new-customer-btn {
        @include buttons.btn($btn-color: vars.$accent-color);
        padding: 1rem;
        margin: .5rem;
        text-align: center;
        font-weight: bold;
    }
</style>