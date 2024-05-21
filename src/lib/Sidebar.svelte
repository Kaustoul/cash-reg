<script lang="ts">
    import { goto } from '$app/navigation';

    import CashRegisterIcon from 'svelte-material-icons/CashRegister.svelte';
    import CatalogIcon from 'svelte-material-icons/BookOpenVariant.svelte';
    import DashboardIcon from 'svelte-material-icons/Finance.svelte';
    import CustomersIcon from 'svelte-material-icons/AccountGroup.svelte';
    import MoneyIcon from 'svelte-material-icons/CashMultiple.svelte';
    import SidebarButton from './SidebarButton.svelte';

    export let selectedIdx: number = 0;
    
    let disabledIdxs: number[] = [3];
    const routes = [
        {
            idx: 0,
            text: "Přehled",
            icon: DashboardIcon,
            route: "/dashboard"
        },
        {
            idx: 1,
            text: "Katalog",
            icon: CatalogIcon,
            route: "/catalog"
        },
        {
            idx: 2,
            text: "Pokladny",
            icon: MoneyIcon,
            route: "/tills"
        },
        {
            idx: 3,
            text: "Zákazníci",
            icon: CustomersIcon,
            route: "/customers"
        }
    ]
</script>

<nav>
    <div class="primary-btn" on:click={() => console.log("Cash")}>
        <CashRegisterIcon size="1.7rem"/>
        <span><b>Do pokladny</b></span>
    </div>

    {#each routes as route}
        <SidebarButton 
            text={route.text} 
            icon={route.icon} 
            selected={selectedIdx === route.idx} 
            disabled={disabledIdxs.includes(route.idx)}
            onClick={() => goto(route.route)}
        />
    {/each}
</nav>

<style lang="scss">
    @import '../styles.scss';
nav {
    height: 100vh;
    margin: .7rem;
}

.primary-btn {
    @extend .btn;
    $btn-height: 3.5rem;
    $btn-color: $accent-color;

    height: $btn-height;
    margin-bottom: 2rem;
    background-color: $btn-color;
    font-size: x-large;

    &:hover {
        background-color: lighten($color: $btn-color, $amount: 10);
    }

    span {
        line-height: $btn-height + $btn-center-spacing;
    }
}

</style>