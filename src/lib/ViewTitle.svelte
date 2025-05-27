<script lang="ts">
    import BackIcon from 'svelte-material-icons/ChevronLeft.svelte'
    export let title: string;
    export let subtitle: string | undefined = undefined;
    export let showBackArrow: boolean = false;
</script>

<div class="container">
    {#if showBackArrow}
        <button type="button"
            class="back-btn"
            on:click={() => history.back()}
        >
            <BackIcon height="5rem" width="5rem"/>
        </button>
    {/if}
    <div class="title">
        <b>{title}</b>
    </div>
    {#if subtitle !== undefined}
        <span class="subtitle">{subtitle}</span>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/text-styles' as ts;

    .back-btn {
        @include buttons.div-btn;
        align-self: center;
        cursor: pointer;
        display: flex;
    }
    
    .container {
        display: flex;
        align-items: baseline;
        margin-bottom: 2rem;
    }

    .title {
        @include ts.view-title;
        margin-right: 1rem;
    }
    
    .subtitle {
        @include ts.view-subtitle;
    }
</style>
