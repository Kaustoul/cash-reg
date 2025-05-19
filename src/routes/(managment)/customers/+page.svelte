<script lang="ts">
    import ViewTitle from '$lib/ViewTitle.svelte';
    import SortedListView from '$lib/SortedListView.svelte';
    import type { PageData } from './$types';
    import type { ICustomer } from '$lib/shared/interfaces/customer';

    export let data: PageData;
    let customers: ICustomer[] = data.customers;
</script>

<ViewTitle title="Zákazníci" />

<SortedListView
    data={customers}
    schema={[
        { fieldName: "customerId", type: "number", columnHeader: "ID" },
        { fieldName: "name", type: "string", columnHeader: "Jméno" },
        { fieldName: "surname", type: "string", columnHeader: "Příjmení" },
        { fieldName: "email", type: "string", columnHeader: "Email" },
        { fieldName: "discount", type: "string", columnHeader: "Sleva", props: { render: (d) => d?.value ? `${d.value}%` : "" } },
        { fieldName: "balance", type: "string", columnHeader: "Zůstatek", props: { render: (b) => b?.[0]?.value ? `${b[0].value} ${b[0].currency}` : "" } },
    ]}
    clickableRows={false}
/>