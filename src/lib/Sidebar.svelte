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
    <div class="primary-btn" on:click={() => console.log("Cash")}>
        <CashRegisterIcon size="1.7rem"/>
        <span><b>Do pokladny</b></span>
    </div>

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