<script lang="ts">
    import BackIcon from 'svelte-material-icons/ChevronLeft.svelte'
    export let title: string;
    export let subtitle: string | undefined = undefined;
    export let showBackArrow: boolean = false;
</script>

<div class="viewTitle">
    {#if showBackArrow}
        <div class="back-btn" on:click={() => history.back()}>
            <BackIcon height="5rem" width="5rem"/>
        </div>
    {/if}
    <div class="title">
        <b>{title}</b>
    </div>
    {#if subtitle !== undefined}
        <span class="viewSubtitle">{subtitle}</span>
    {/if}
</div>

<style lang="scss">
    @import '../styles.scss';

    .back-btn {
        align-self: center;
        cursor: pointer;
        display: flex;
    }

    .title {
        margin-right: 1rem;
    }

    .viewTitle {
        display: flex;
        align-items: baseline;
        // justify-content: start;
        margin-bottom: 1rem;
    }
</style>