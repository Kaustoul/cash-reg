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
        <CashRegisterIcon size="6rem" />
        <div class="status-subicon">
            {#if status === 'closed'}
                <CloseIcon size="3rem" />
            {:else if status === 'open'}
                <CheckIcon size="3rem" />
            {:else if status === 'active'}
                <WorkingIcon size="3rem" />
            {:else if status === 'paused'}
                <PauseIcon size="3rem" />
            {/if}
        </div>
    </div>
    <div class="status-text-area">
        {#if status === 'closed'}
            <span class="status-text">Zavřená</span>
        {:else if status === 'open'}
            <span class="status-text">Otevřená</span>
        {:else if status === 'active'}
            <span class="status-text">Otevřená</span>
        {:else if status === 'paused'}
            <span class="status-text">Pauza</span>
        {/if}

        <span class="cashier">
            Pokladní 00
        </span>
    </div>
</div>

<style lang="scss">
    @use "$lib/styles/vars" as vars;
    
    $subicon-size: 3rem;
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
        border-radius: 100%;
        aspect-ratio: 1;
        background-color: vars.$bg-color;
        transform: translateX(- $subicon-size);

        display: grid;
        place-items: center;
    }

    .card-status {
        background-color: vars.$content-bg-color;
        border-radius: vars.$medium-radius;
        height: 100%;
        width: 100%;
        font-size: vars.$large;

        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        padding: 1rem;
    }

    .status-text-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;

        .cashier {
            font-size: vars.$larger;
            color: vars.$text2-color;
        }
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
