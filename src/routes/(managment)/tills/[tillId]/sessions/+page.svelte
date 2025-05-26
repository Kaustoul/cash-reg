<script lang="ts">
    import TillSessionsTable from '$lib/componenets/TillSessionsTable.svelte';
    import ViewTitle from '$lib/ViewTitle.svelte';
    import { page } from '$app/stores';
    import type { PageData } from './$types';

    export let data: PageData;
    // If you want to get tillId from the URL directly:
    $: tillId = $page.params.tillId;
</script>

<ViewTitle title="Směny" subtitle="Pokladna {tillId}" showBackArrow={true} />
<TillSessionsTable sessions={data.sessions} />