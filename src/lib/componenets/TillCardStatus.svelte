<script lang="ts">
    import CashRegisterIcon  from 'svelte-material-icons/CashRegister.svelte';
    import CloseIcon  from 'svelte-material-icons/CloseCircleOutline.svelte';
    import CheckIcon  from 'svelte-material-icons/CheckCircleOutline.svelte';
    import PauseIcon  from 'svelte-material-icons/PauseCircleOutline.svelte';
    import WorkingIcon  from 'svelte-material-icons/AccountSupervisorCircleOutline.svelte';
    import type { TillStatus } from '$lib/shared/interfaces/till';

    export let status: TillStatus;

    let colorClass: string = '';

    switch (status) {
        case 'closed':
            colorClass = 'red';
            break;
        case 'open':
            colorClass = 'green';
            break;
        case 'active':
            colorClass = 'accent';
            break;
        case 'paused':
            colorClass = 'yellow';
            break;
    }
</script>

<div class={`card-status`}>
    <div class="status-icon">
        <CashRegisterIcon size="4rem" />
        <div class="status-subicon">
            {#if status === 'closed'}
                <CloseIcon size="2rem" />
            {:else if status === 'open'}
                <CheckIcon size="2rem" />
            {:else if status === 'active'}
                <WorkingIcon size="2rem" />
            {:else if status === 'paused'}
                <PauseIcon size="2rem" />
            {/if}
        </div>
    </div>
    Zavřená
</div>

<style lang="scss">
    @use "$lib/styles/vars" as vars;
    
    $subicon-size: 2rem;
    .status-icon {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        position: relative;

        &::before {
            content: '';
            width: $subicon-size;
        }
    }

    .status-subicon {
        width: $subicon-size;
        border-radius: 50%;
        aspect-ratio: 1;
        background-color: vars.$bg-color;
        transform: translateX(- $subicon-size);

        display: grid;
        place-items: center;
    }

    .card-status {
        background-color: vars.$bg-color;
        border-radius: vars.$large-radius;
        width: 10rem;
        
        font-size: x-large;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }

    .red {
        background-color: vars.$red;
    }

    .green {
        background-color: vars.$green;
    }

    .accent {
        background-color: vars.$accent-color;
    }

    .yellow {
        background-color: vars.$yellow;
    }
</style>
