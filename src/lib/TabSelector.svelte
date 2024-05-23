<script lang="ts">
    import { goto, replaceState } from "$app/navigation";
    import { page } from "$app/stores";
    import { getDefaultTab, type Tabs } from "./navigator";

    export let tabs: Tabs;
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

        goto(tabs[selectedTab].url, {replaceState: true});
    }

    async function redirectToTab(tab: string) {
        selectedTab = tab;
        goto(tabs[tab].url, {replaceState: true});        
    }
</script>

<div class="tab-selector">
    {#each Object.keys(tabs) as tab}
        <div 
            class="{selectedTab === tab ? 'selected ' : ''}{tabs[tab].disabled ? 'disabled ' : ''} tab" 
            on:click={() => redirectToTab(tab)}
        >
            {tab}
        </div>
    {/each}
</div>

<style lang="scss">
    @import '../styles.scss';

    .tab-selector {
        display: flex;
        justify-content: flex-start;
        margin: 1rem 0;
        gap: 1rem;
        border-bottom: 1px solid $primary-color;
    }

    .tab {
        padding: .5rem 1rem;
        cursor: pointer;
        transition: background-color .2s;
        font-size: x-large;
        width: 10%;
        text-align: center;
    }

    .tab.selected {
        color: $accent-color;
        border-bottom: 3px solid $accent-color;

    }
</style>