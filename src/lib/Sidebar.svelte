<script lang="ts">
    import { goto } from '$app/navigation';

    import CashRegisterIcon from 'svelte-material-icons/CashRegister.svelte';

    import SidebarButton from './SidebarButton.svelte';
    import { getDefaultTab, type Tabs } from './navigator';
    import { page } from '$app/stores';

    export let selectedIdx: number = 0;
    export let tabs: Tabs & { [key: string]: { icon: any } } ;
    export let selectedTab: string | undefined = undefined;

    for (const tab in tabs) {
        if (!tabs[tab].disabled && $page.url.pathname.endsWith(tabs[tab].url)) {
            selectedTab = tab;
            break;
        }   
    }

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
        class="primary-btn"
        on:click={() => goto("/cash-register")}
    >
        <CashRegisterIcon size="1.7rem"/>
        <span><b>Do pokladny</b></span>
    </button>

    {#each Object.entries(tabs) as [tab, obj]}
        <SidebarButton 
            text={tab} 
            icon={obj.icon} 
            selected={selectedTab === tab} 
            disabled={obj.disabled}
            onClick={() => redirectToTab(tab)}
        />
    {/each}
</nav>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    nav {
        height: 100vh;
        margin: .7rem;
    }

    .primary-btn {
        @include buttons.btn($btn-color: vars.$accent-color, $btn-height: 3.5rem);
        width: 100%;
        height: auto;
        margin-bottom: 2rem;
        font-size: x-large;
   }

</style>
