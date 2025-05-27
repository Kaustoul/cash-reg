<script lang="ts">
    import ViewTitle from '$lib/ViewTitle.svelte';
    import type { LayoutData } from './$types';
    import TabSelector from '$lib/TabSelector.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: LayoutData;

    let viewTitle = "Zaměstnanci";

    const tabs = {
        "Zaměstnanci": {
            url: '/workers/list',
        },
      
        "Skupiny": {
            url: '/workers/groups',
        }
    };
</script>

<ViewTitle title={$viewTitleStore.title} subtitle={$viewTitleStore.subtitle ?? ''} showBackArrow={$viewTitleStore.showBackArrow ?? false} />

<TabSelector {tabs}/>

<slot></slot>