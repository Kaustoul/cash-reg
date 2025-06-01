<script lang="ts">
    export let defaultValue: string | number = '';
    export let value: string | number = defaultValue;
    export let options: string[] = [];
</script>

<div class="selector-container">
    <select class="selector" bind:value>
        {#if options && options.length > 0}
            {#each options as opt}
                <option value={opt}>{opt}</option>
            {/each}
        {/if}
    </select>
    <!-- Custom SVG icon, you can change color here -->
    <svg class="dropdown-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7 10l5 5 5-5" stroke="#46A049" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/buttons' as buttons;

    .selector-container {
        position: relative;
        display: inline-block;
        width: 100%;
    }

    .selector {
        @include inputs.selector;
        width: 100%;
        padding-right: 3rem; // Make space for the icon
    }

    .dropdown-icon {
        position: absolute;
        right: 1.2rem;
        top: 50%;
        pointer-events: none;
        transform: translateY(-50%);
        fill: none;
        stroke: vars.$accent-color;
        z-index: 2;
        // You can adjust color here or via stroke attribute in SVG
    }
</style>