<script lang="ts">
    import TillSessionsTable from '$lib/componenets/TillSessionsTable.svelte';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import { page } from '$app/stores';
    import type { PageData } from './$types';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: PageData;

    viewTitleStore.set({
        title: "Směny",
        subtitle: `Pokladna ${data.tillId}`,
        showBackArrow: true
    });

    // If you want to get tillId from the URL directly:
    $: tillId = $page.params.tillId;
</script>

<div class="container">
    <TillSessionsTable sessions={data.sessions} showWorkerId={true}/>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/text-styles' as textStyles;

    .container {
        @include inputs.scrollable;
    }
</style>