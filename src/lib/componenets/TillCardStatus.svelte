<script lang="ts">
    import CashRegisterIcon  from 'svelte-material-icons/CashRegister.svelte';
    import CloseIcon  from 'svelte-material-icons/CloseCircleOutline.svelte';
    import CheckIcon  from 'svelte-material-icons/CheckCircleOutline.svelte';
    import PauseIcon  from 'svelte-material-icons/PauseCircleOutline.svelte';
    import WorkingIcon  from 'svelte-material-icons/AccountSupervisorCircleOutline.svelte';
    import type { TillSessionType } from '$lib/shared/interfaces/till-session';

    export let state: TillSessionType;
    export let cashierId: number | null;

    let colorClass: string = '';

    switch (state) {
        case 'CLOSED':
            colorClass = 'red';
            break;
        case 'OPEN':
            colorClass = 'green';
            break;
        case 'INACTIVE':
            colorClass = 'accent';
            break;
        case 'PAUSED':
            colorClass = 'yellow';
            break;
    }
</script>

<div class={`card-status`}>
    <div class="status-icon">
        <CashRegisterIcon size="6rem" />
        <div class="status-subicon">
            {#if state === 'CLOSED'}
                <CloseIcon size="3rem" />
            {:else if state === 'OPEN'}
                <CheckIcon size="3rem" />
            {:else if state === 'INACTIVE'}
                <WorkingIcon size="3rem" />
            {:else if state === 'PAUSED'}
                <PauseIcon size="3rem" />
            {/if}
        </div>
    </div>
    <div class="status-text-area">
        {#if state === 'CLOSED'}
            <span class="status-text {colorClass}">Zavřená</span>
        {:else if state === 'OPEN'}
            <span class="status-text {colorClass}">Otevřená</span>
        {:else if state === 'INACTIVE'}
            <span class="status-text {colorClass}">Otevřená</span>
        {:else if state === 'PAUSED'}
            <span class="status-text {colorClass}">Pauza</span>
        {/if}

        {#if cashierId}
            <span class="cashier">
                Pokladní {cashierId}
            </span>
        {/if}
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
        color: vars.$red;
    }

    .green {
        color: vars.$green;
    }

    .accent {
        color: vars.$accent-color;
    }

    .yellow {
        color: vars.$yellow;
    }
</style>
