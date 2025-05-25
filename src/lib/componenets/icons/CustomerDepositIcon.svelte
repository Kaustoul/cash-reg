<script lang="ts">
    import CashIcon from 'svelte-material-icons/Cash.svelte';
    import RightArrowIcon from 'svelte-material-icons/ArrowRightBold.svelte';
    import CustomerIcon from 'svelte-material-icons/Account.svelte';

    export let size: string = "2rem";
</script>

<div>
    <CashIcon {size} />
    <RightArrowIcon {size} />
    <CustomerIcon {size} />
</div>

