<script lang="ts">
    import TillSessionsTable from '$lib/componenets/TillSessionsTable.svelte';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="container">
    <span class="title">Směny</span>
    <TillSessionsTable sessions={data.sessions} showTillId={true} />
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/text-styles' as textStyles;

    .container {
        @include inputs.scrollable;
    }

    .title {
        display: block;
        margin: 2rem 0;
        font-size: vars.$xx-large;
        font-weight: bold;
    }
</style>