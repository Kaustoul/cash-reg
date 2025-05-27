<script lang="ts">
    import EditIcon from 'svelte-material-icons/AccountEdit.svelte';
    import AcceptIcon from 'svelte-material-icons/CheckCircle.svelte';
    import CancelIcon from 'svelte-material-icons/Cancel.svelte';

    export let editMode: boolean = false;
    export let isSubmitting: boolean = false;
    export let onConfirm: () => Promise<void> = async () => {};
    export let onCancel: () => void = () => {};
</script>

<div class="buttons">
    {#if editMode}
        <button 
            class="cancel-btn" 
            type="button"
            on:click={onCancel}
            disabled={isSubmitting}
        >
            <CancelIcon size="1.5rem" />
            Zrušit
        </button>
        <button 
            class="accept-btn" 
            type="button"
            on:click={onConfirm}
            disabled={isSubmitting}
        >
            <AcceptIcon size="1.5rem" />
            {isSubmitting ? '...' : 'Potvrdit'}
        </button>
    {:else}
        <button 
            class="edit-btn" 
            type="button"
            on:click={() => editMode = !editMode}
        >
            <EditIcon size="2.5rem" />
            Upravit
        </button>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .buttons {
        display: flex;
        gap: 1rem;
    }

    .edit-btn {
        @include buttons.btn($btn-color: vars.$yellow, $btn-height: 4rem);
        width: 100%;
        font-size: vars.$larger;
        font-weight: bold;
    }

    .accept-btn {
        @include buttons.btn($btn-color: vars.$green, $btn-height: 3.5rem);
        width: 100%;
        font-size: vars.$larger;
        flex: 0 0 48%;
    }

    .cancel-btn {
        @include buttons.btn($btn-color: vars.$red, $btn-height: 3.5rem);
        width: 100%;
        font-size: vars.$larger;
        flex: 0 0 48%;
    }
</style>