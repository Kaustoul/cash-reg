<script lang="ts">
    import CashIcon from 'svelte-material-icons/Cash.svelte';
    import RightArrowIcon from 'svelte-material-icons/ArrowRightBold.svelte';
    import CashRegisterIcon from 'svelte-material-icons/CashRegister.svelte';

    export let size: string = "2rem";
</script>

<div>
    <CashIcon {size} />
    <RightArrowIcon {size} />
    <CashRegisterIcon {size} />
</div>

