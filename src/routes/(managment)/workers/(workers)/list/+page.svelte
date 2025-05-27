<script lang="ts">
    import SortedListView from '$lib/SortedListView.svelte';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import type { Schema } from '$lib/componenets/interactables/SortedList.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    export let data: PageData;

    viewTitleStore.set({title: "Zaměstnanci"});

    const schema: Schema = [
        { fieldName: "userId", type: "number", columnHeader: "ID", searchKey: true },
        { fieldName: "name", type: "string", columnHeader: "Jméno", searchKey: true },
        { fieldName: "surname", type: "string", columnHeader: "Příjmení", searchKey: true },
        { fieldName: "group", type: "number", columnHeader: "Skupina" }
    ];
</script>

<SortedListView
    data={data.users}
    {schema}
    clickableRows={true}
    idFieldName="userId"
    onRowClick={(userId) => goto(`/workers/${userId}/detail`)}
    showSearchBar={true}
    selectors={false}
    buttons={{
        "Přidat": {
            icon: "plus",
            color: "green",
            action: () => goto('/workers/new')
        }
    }}

    customRenderer={{
        group: (user) => user.group ? user.group.name : "Žádná skupina"
    }}
/>