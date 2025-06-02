<script lang="ts">
    import { goto } from '$app/navigation';

    import CashRegisterIcon from 'svelte-material-icons/CashRegister.svelte';

    import SidebarButton from './SidebarButton.svelte';
    import { getDefaultTab, type Tabs } from './navigator';
    import { page } from '$app/stores';
    import { hasPermission } from '$lib/shared/utils/permission-utils';
    import { userStore, tillSessionIdStore } from '$lib/shared/stores/sessionStore';

    export let selectedIdx: number = 0;
    export let tabs: Tabs;
    export let selectedTab: string | undefined = undefined;

    $: user = $userStore;
    $: tillSessionId = $tillSessionIdStore;

    $: {for (const tab in tabs) {
        if (!tabs[tab].disabled && $page.url.pathname.includes(tabs[tab].url)) {
            selectedTab = tab;
            break;
        }   
    }}

    if (!selectedTab) {
        selectedTab = getDefaultTab(tabs);

        if (!selectedTab) {
            // TODO handle no enabled tabs
            throw new Error("No enabled tabs");
        }

        // goto(tabs[selectedTab].url);
    }

    async function redirectToTab(tab: string) {
        selectedTab = tab;
        goto(tabs[tab].url);        
    }
</script>

<nav>
    <button type="button"
        class="{tillSessionId ? "primary-btn" : "secondary-btn"} {!user ? "hidden" : ""}"
        on:click={() => tillSessionId ? goto("/cash-register") : goto("/tills") }
    >
        <CashRegisterIcon size="1.7rem"/>
        <span class="btn-text">
            {tillSessionId ? "Do pokladny" : "K pokladnám"}
        </span>
    </button>

    {#each Object.entries(tabs) as [tab, obj]}
        <SidebarButton 
            text={tab} 
            icon={obj.icon} 
            selected={selectedTab === tab} 
            disabled={obj.disabled}
            onClick={() => redirectToTab(tab)}
            hidden={!hasPermission(user, obj.permission)}
        />
    {/each}
</nav>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    nav {
        height: 100%;
        margin: .7rem;
    }

    .primary-btn {
        @include buttons.btn($btn-color: vars.$accent-color, $btn-height: 3.5rem);
        width: 90%;
        height: auto;
        margin: 1rem auto;
        font-size: vars.$larger;
    }

    .secondary-btn {
        @include buttons.btn($btn-color: vars.$second-accent-color, $btn-height: 3.5rem);
        width: 90%;
        height: auto;
        margin: 1rem auto;
        font-size: vars.$larger;
    }

    .btn-text {
        font-weight: bold;
    }
</style>
