<script lang="ts">
    import SortedListView from '$lib/SortedListView.svelte';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import type { Schema } from '$lib/componenets/interactables/SortedList.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: PageData;

    viewTitleStore.set({title: "Skupiny"});

    function onRowClick(groupId: number) {
        // goto(`/workers/groups/${groupId}`);
    }

    const schema: Schema = [
        { fieldName: "groupId", type: "number", columnHeader: "ID", searchKey: true },
        { fieldName: "name", type: "string", columnHeader: "Název", searchKey: true },
        { fieldName: "description", type: "string", columnHeader: "Popis" }
    ];
</script>

<SortedListView
    data={data.groups}
    {schema}
    clickableRows={true}
    idFieldName="groupId"
    onRowClick={onRowClick}
    showSearchBar={true}
    selectors={false}
    buttons={{
        "Přidat": {
            icon: "plus",
            color: "green",
            action: () => {}
        }
    }}
/>