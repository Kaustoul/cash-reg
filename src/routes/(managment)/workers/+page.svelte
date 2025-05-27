<script lang="ts">
    import ViewTitle from '$lib/ViewTitle.svelte';
    import SortedListView from '$lib/SortedListView.svelte';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import type { Schema } from '$lib/componenets/interactables/SortedList.svelte';

    export let data: PageData;

    function onRowClick(userId: number) {
        goto(`/workers/${userId}/info`);
    }

    const schema: Schema = [
        { fieldName: "userId", type: "number", columnHeader: "ID", searchKey: true },
        { fieldName: "name", type: "string", columnHeader: "Jméno", searchKey: true },
        { fieldName: "surname", type: "string", columnHeader: "Příjmení", searchKey: true },
        { fieldName: "groupId", type: "number", columnHeader: "Skupina" }
    ];
</script>

<ViewTitle title="Zaměstnanci" />

<SortedListView
    data={data.users}
    {schema}
    clickableRows={true}
    idFieldName="userId"
    onRowClick={onRowClick}
    showSearchBar={true}
    selectors={false}
    buttons={{
        "Nový": {
            icon: "plus",
            color: "green",
            action: () => goto('/workers/create')
        }
    }}
/>