<script lang="ts">
    export let tabs: string[];
    export let selectedTab = tabs[0]

    function selectTab(idx: number) {
        selectedTab = tabs[idx];
    }
</script>

<div class="tab-selector">
    {#each tabs as tab, idx}
        <div class="tab {selectedTab === tab ? 'selected' : ''}" on:click={() => selectTab(idx)}>
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
        text-decoration: solid 1px $primary-color;
        padding: .5rem 1rem;
        cursor: pointer;
        transition: background-color .2s;
        text-decoration: none;
        color: inherit;
        font-size: x-large;
        width: 10%;
        text-align: center;
    }

    .tab.selected {
        color: $accent-color;
        border-bottom: 3px solid $accent-color;

    }
</style>