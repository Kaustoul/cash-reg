<script lang="ts">
    import type { LayoutData } from './$types';
    import TabSelector from '$lib/TabSelector.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: LayoutData;

    const tabs = {
        "Zaměstnanci": {
            url: '/workers/list',
        },
      
        "Skupiny": {
            url: '/workers/groups',
        }
    };

    viewTitleStore.set({title: "Zaměstnanci"});
</script>


<TabSelector {tabs}/>

<slot></slot>