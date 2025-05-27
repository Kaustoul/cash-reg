<script lang="ts">
    import ViewTitle from '$lib/ViewTitle.svelte';
    import SortedListView from '$lib/SortedListView.svelte';
    import SearchBar from '$lib/componenets/SearchBar.svelte';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import type { ICustomer } from '$lib/shared/interfaces/customer';
    import { formatDecimal, formatPrice } from '$lib/shared/utils';
    import Decimal from 'decimal.js';
    import type { IDiscount } from '$lib/shared/interfaces/discount';
    import type { IMoneySum } from '$lib/shared/interfaces/money-sum';
    import { customerStore } from '$lib/shared/stores/customerStore';
    import { formatSum } from '$lib/shared/utils/money-sum-utils';

    export let data: PageData;
    let customers: ICustomer[] = data.customers;
    let filteredCustomers: ICustomer[] = customers;
    let selected: number[] = [];

    function renderDiscount(d: IDiscount | null) {
        if (!d) return "";
        if (d.type === "PRC") return d.value + "%";
        if (d.type === "FLAT") return d.value + "Kč";
        return "";
    }
    function renderBalance(b: IMoneySum[] | null) {
        if (!b) return "-";
        return formatSum(b[0]);
    }

    // Add totalBalance to each customer for the list view
    $: customersWithTotalBalance = filteredCustomers.map(customer => ({
        ...customer,
        totalBalance: customerStore.calculateTotalBalance(customer)
    }));
</script>

<ViewTitle title="Zákazníci" />
    <!-- <SearchBar
        data={customers}
        keys={['name', 'surname', 'email']}
        bind:results={filteredCustomers}
    /> -->
<SortedListView
    data={customersWithTotalBalance}
    schema={[
        { fieldName: "customerId", type: "number", columnHeader: "ID", searchKey: true},
        { fieldName: "name", type: "string", columnHeader: "Jméno", searchKey: true },
        { fieldName: "surname", type: "string", columnHeader: "Příjmení", searchKey: true },
        { fieldName: "email", type: "string", columnHeader: "Email", searchKey: true },
        { fieldName: "discount", type: "json", columnHeader: "Sleva", jsonToString: renderDiscount },
        { fieldName: "totalBalance", type: "json", columnHeader: "Zůstatek", jsonToString: renderBalance },
    ]}
    showSearchBar={true}
    clickableRows={true}
    idFieldName="customerId"
    bind:selected
    onRowClick={(customerId) => goto(`/customers/${customerId}/detail`)}
    selectors={false}
    buttons={{
        "Nový": {
            action: () => goto('/customers/new'),
            icon: "plus",
            color: "green",
            disabled: true
        },
    }}
/>

<style lang="scss">
</style>