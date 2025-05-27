<script lang="ts">
    import Sidebar from "$lib/Sidebar.svelte";
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { userStore as userStore, tillSessionIdStore as tillSessionIdStore } from '$lib/shared/stores/sessionStore';

    import CatalogIcon from 'svelte-material-icons/BookOpenVariant.svelte';
    import DashboardIcon from 'svelte-material-icons/Finance.svelte';
    import CustomersIcon from 'svelte-material-icons/AccountGroup.svelte';
    import MoneyIcon from 'svelte-material-icons/CashMultiple.svelte';
    import ReceiptIcon from 'svelte-material-icons/ReceiptText.svelte';
    import WorkerIcon from 'svelte-material-icons/AccountTie.svelte';
    import AccountIcon from 'svelte-material-icons/Account.svelte';
    import DotsVerticalIcon from 'svelte-material-icons/DotsVertical.svelte';
    import type { LayoutData } from "./$types";
    import ViewTitle from '$lib/ViewTitle.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: LayoutData;

    userStore.set(data.frontEndUser ?? null);
    tillSessionIdStore.set(data.tillSessionId ?? null);

    let userIdValue: number | null = $userStore?.userId ?? null;
    let tillSessionIdValue: number | null = data.tillSessionId;

    const tabs = {
        "Přehled": {
            icon: DashboardIcon,
            url: "/dashboard",
            disabled: true,
            permission: "tabs.dashboard.view"
        },
        "Katalog": {
            icon: CatalogIcon,
            url: "/catalog",
            permission: "tabs.catalog.view"
        },
        "Pokladny": {
            icon: MoneyIcon,
            url: "/tills",
            permission: "tabs.tills.view"
        },
        "Prodeje": {
            icon: ReceiptIcon,
            url: "/sales",
            permission: "tabs.sales.view"
        },

        "Zákazníci": {
            icon: CustomersIcon,
            url: "/customers",
            permission: "tabs.users.view"
        },

        "Zaměstnanci": {
            icon: WorkerIcon,
            url: "/workers/list",
            permission: "tabs.workers.view"
        }
    };
    
    let showDropdown = false;

    function logout() {
        fetch('/api/logout', { method: 'POST' }).then(() => {
            goto('/login');
        });
    }

    function toggleDropdown() {
        showDropdown = !showDropdown;
    }

    function closeDropdown() {
        showDropdown = false;
    }
</script>

<div class="grid-container">
    <header>
        <img src="/logo.svg" alt="Logo" style="filter: invert(100%)" height="75"/>
        <div class="user-area">
            <AccountIcon size="3rem" />
            {#if userIdValue}
                <div class="user">
                    <span class="cashierId-title"> Zaměstnanec: 
                        <span class="cashierId">
                            {userIdValue}
                        </span>
                    </span>
                    <span class="till {tillSessionIdValue && data.tillId ? 'green' : 'gray'}">
                        {tillSessionIdValue && data.tillId ? `Pokladna: ${data.tillId}` : 'Bez Pokladny'}
                    </span>
                </div>
                <div class="dropdown-container">
                    <button class="dots-btn" on:click={toggleDropdown} aria-label="Možnosti">
                        <DotsVerticalIcon size="2rem" color="white" />
                    </button>
                    {#if showDropdown}
                        <div
                            class="dropdown-menu"
                            role="menu"
                            tabindex="0"
                            on:mouseleave={closeDropdown}
                        >
                            <button
                                class="dropdown-item red" 
                                role="menuitem"
                                tabindex="0"
                                type="button"
                                on:click={logout}
                            >
                                Odhlásit se
                            </button>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </header>
    <Sidebar {tabs}/>
    <main class="main">
        {#if $viewTitleStore.hidden === undefined || !$viewTitleStore.hidden}
            <ViewTitle title={$viewTitleStore.title} subtitle={$viewTitleStore.subtitle ?? ''} showBackArrow={$viewTitleStore.showBackArrow ?? false} />
        {/if}

        <slot></slot>
    </main>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/buttons' as buttons;

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

        height: calc(100% - 5rem);
        background-color: vars.$content-bg-color;
        // padding: 2.5rem 2.5rem 0 2.5rem;
        padding: 2.5rem;
        overflow-y: hidden;
    }

    .user-area {
        display: flex;
        align-items: center;
        gap: .5rem;
        margin-right: 1rem;

        .user {
            display: flex;
            flex-direction: column;
            font-size: vars.$normal;
            color: vars.$text-color;

            .cashierId {
                font-weight: bold;
            }
        }
    }

    .dropdown-container {
        position: relative;
        display: inline-block;
    }
    
    .dots-btn {
        @include buttons.div-btn;
    }

    .dropdown-menu {
        position: absolute;
        left: -7.3rem;
        top: 3.5rem;

        border-radius: vars.$small-radius;
        background-color: vars.$bg-color;
        padding: .5rem;

        min-width: 10rem;
        z-index: 100;
    }

    .dropdown-item {
        @include buttons.div-btn;
        width: 100%;
        background-color: vars.$content-bg-color;
        font-size: vars.$normal;
        padding: .7rem 0;

        &:hover {
            background-color: vars.$primary-color;
        }

        // border-top: solid 1px vars.$text-disabled-color;
        // border-bottom: solid 1px vars.$text-disabled-color;
    }

    .red {
        color: vars.$red;
    }

    .green {
        color: vars.$accent-color;
    }

    .gray {
        color: vars.$text2-color;
    }
</style>
