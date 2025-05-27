<script lang="ts">
    import ViewTitle from '$lib/ViewTitle.svelte';
    import SortedListView from '$lib/SortedListView.svelte';
    import type { PageData } from './$types';
    import type { DataRows, Schema } from '$lib/componenets/interactables/SortedList.svelte';
    import PurchaseIcon from 'svelte-material-icons/CartVariant.svelte';
    import CashIcon from 'svelte-material-icons/Cash.svelte';
    import QrcodeIcon from 'svelte-material-icons/Qrcode.svelte';    
    import CardIcon from 'svelte-material-icons/CreditCard.svelte';
    import WithdrawIcon from '$lib/componenets/icons/WithdrawIcon.svelte';
    import DepositIcon from '$lib/componenets/icons/DepositIcon.svelte';
    import CustomerDepositIcon from '$lib/componenets/icons/CustomerDepositIcon.svelte';


    export let data: PageData;

    // Define schema for the transaction list
    const schema: Schema = [
        { fieldName: "id", type: "number", columnHeader: "ID" },
        { fieldName: "orderId", type: "link", columnHeader: "Objednávka", url: "/sales?date=${createdAt}&orderId=${orderId}&backArrow=1", urlParams: ['createdAt', 'orderId'] },
        { fieldName: "cashierId", type: "number", columnHeader: "Pokladník" },
        { fieldName: "type", type: "string", columnHeader: "Typ Platby" },
        { fieldName: "reason", type: "string", columnHeader: "Důvod" },
        { fieldName: "amount", type: "sum", columnHeader: "Částka", class: (row, column) => row[column.fieldName].value.startsWith("-") ? "red" : "green" },
    ];

    const customRenderer = {
        type: (row: any, column: any) => {
            if (row[column.fieldName] === 'cash') {
                return {
                    component: CashIcon,
                    props: { size: "1.5rem" }
                };
            }
            else if (row[column.fieldName] === 'qr') {
                return {
                    component: QrcodeIcon,
                    props: { size: "1.5rem" }
                };
            }
            else if (row[column.fieldName] === 'card') {
                return {
                    component: CardIcon,
                    props: { size: "1.5rem" }
                };
            }
            return { text: '—' };
        },

        reason: (row: any, column: any) => {
            if (row[column.fieldName] === 'purchase') {
                return {
                    component: PurchaseIcon,
                    props: { size: "1.5rem" }
                };
            } else if (row[column.fieldName] === 'withdraw') {
                return {
                    component: WithdrawIcon,
                    props: { size: "1.5rem" }
                };
            } else if (row[column.fieldName] === 'deposit') {
                return {
                    component: DepositIcon,
                    props: { size: "1.5rem" }
                };
            } else if (row[column.fieldName] === 'customer-deposit') {
                return {
                    component: CustomerDepositIcon,
                    props: { size: "1.5rem" }
                };
            }
            return { text: row[column.fieldName] || '—' };
        }
    };
</script>

<ViewTitle title="Transakce" subtitle={`Pokladna ${data.tillDisplayName ?? data.tillId}`} showBackArrow={true}/>

<SortedListView
    data={data.transactions}
    {schema}
    selectors={false}
    customRenderer={customRenderer}
    emptyMessage="Žádné transakce k zobrazení"
/>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;
</style>