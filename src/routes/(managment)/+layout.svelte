<script lang="ts">
    import Sidebar from "$lib/Sidebar.svelte";

    import CatalogIcon from 'svelte-material-icons/BookOpenVariant.svelte';
    import DashboardIcon from 'svelte-material-icons/Finance.svelte';
    import CustomersIcon from 'svelte-material-icons/AccountGroup.svelte';
    import MoneyIcon from 'svelte-material-icons/CashMultiple.svelte';
    import ReceiptIcon from 'svelte-material-icons/ReceiptText.svelte';

    let viewTitle: string = "";
    
    const tabs = {
        "Přehled": {
            icon: DashboardIcon,
            url: "/dashboard",
            disabled: true,
        },
        "Katalog": {
            icon: CatalogIcon,
            url: "/catalog"
        },
        "Pokladny": {
            icon: MoneyIcon,
            url: "/tills",
            // disabled: true,
        },
        "Prodeje": {
            icon: ReceiptIcon,
            url: "/sales",
        },

        "Zákazníci": {
            icon: CustomersIcon,
            url: "/customers",
        }
    }
</script>

<div class="grid-container">
    <header>
        <img src="/logo.svg" alt="Logo" style="filter: invert(100%)" height="75"/>
    </header>
    <Sidebar {tabs}/>
    <main>
        <slot></slot>
    </main>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/inputs' as inputs;

    .grid-container {
        display: grid;
        grid-template-columns: 17rem 1fr;
        grid-template-rows: 80px 1fr;
        height: 100%;
    }

    header {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    main {
        display: flex;
        flex-direction: column;

        height: 100%;
        background-color: vars.$content-bg-color;
        padding: 2.5rem 2.5rem 0 2.5rem;
        overflow-y: hidden;
    }


</style>
