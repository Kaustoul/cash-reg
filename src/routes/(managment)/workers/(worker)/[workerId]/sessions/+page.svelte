<script lang="ts">
    import TillSessionsTable from '$lib/componenets/TillSessionsTable.svelte';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import type { PageData } from './$types';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: PageData;

    viewTitleStore.set({ title: "Směny", subtitle: `Zaměstnanec ${data.worker.userId}`, showBackArrow: true });

</script>

<div class="container">
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