<script lang="ts">
    import '../styles.scss';
    import { getContext } from 'svelte';
    import Sidebar from "$lib/Sidebar.svelte";

    import CatalogIcon from 'svelte-material-icons/BookOpenVariant.svelte';
    import DashboardIcon from 'svelte-material-icons/Finance.svelte';
    import CustomersIcon from 'svelte-material-icons/AccountGroup.svelte';
    import MoneyIcon from 'svelte-material-icons/CashMultiple.svelte';

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
        "Zákazníci": {
            icon: CustomersIcon,
            url: "/customers",
            disabled: true,
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

    .grid-container {
        display: grid;
        grid-template-columns: 275px 1fr;
        grid-template-rows: auto;
        height: 100vh;
    }

    header {
        height: 5rem;
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    main {
        background-color: vars.$content-bg-color;
        padding: 2.5rem;
    }


</style>
