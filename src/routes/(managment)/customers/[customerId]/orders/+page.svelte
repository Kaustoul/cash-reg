<script lang="ts">
    import OrderList from '$lib/componenets/OrderList.svelte';
    import type { PageData } from './$types';

    export let data: PageData
</script>

<OrderList orders={data.orders} />