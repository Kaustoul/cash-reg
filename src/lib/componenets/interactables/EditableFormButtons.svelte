<script lang="ts">
    import EditIcon from 'svelte-material-icons/AccountEdit.svelte';
    import AcceptIcon from 'svelte-material-icons/CheckCircle.svelte';
    import CancelIcon from 'svelte-material-icons/Cancel.svelte';
    import DeleteIcon from 'svelte-material-icons/Delete.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    export let editMode: boolean = false;
    export let isSubmitting: boolean = false;
    export let onConfirm: () => Promise<void> = async () => {};
    export let onCancel: () => void = () => {};
    export let onDelete: () => void = () => {};

    function toggleEditMode() {
        editMode = true;
        $page.url.searchParams.set('edit', '1');
        goto($page.url.pathname + $page.url.search, { keepfocus: true, replaceState: true });
    }

    function cancel() {
        editMode = false;
        $page.url.searchParams.delete('edit');
        goto($page.url.pathname + $page.url.search, { keepfocus: true, replaceState: true });
        onCancel();
    }

    async function confirm() {
        editMode = false;
        $page.url.searchParams.delete('edit');
        goto($page.url.pathname + $page.url.search, { keepfocus: true, replaceState: true });
        isSubmitting = true;
        await onConfirm().finally(() => {
            isSubmitting = false;
        });
    }
</script>

<div class="buttons">
    {#if editMode}
        <div class="edit-mode">
            <button 
                class="cancel-btn" 
                type="button"
                on:click={cancel}
                disabled={isSubmitting}
                >
                <CancelIcon size="1.5rem" />
                Zrušit
            </button>
            <button 
                class="accept-btn" 
                type="button"
                on:click={confirm}
                disabled={isSubmitting}
            >
                <AcceptIcon size="1.5rem" />
                {isSubmitting ? '...' : 'Uložit'}
            </button>
        </div>
    {:else}
        <button 
            class="edit-btn" 
            type="button"
            on:click={toggleEditMode}
        >
            <EditIcon size="2.5rem" />
            Upravit
        </button>
    {/if}
    <button 
        class="delete-btn {editMode? 'disabled' : ''}" 
        type="button"
        on:click={onDelete}
    >
        <DeleteIcon size="2.5rem" />
        Smazat
    </button>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .edit-mode {
        display: flex;
        gap: 1rem;
        width: 100%;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .edit-btn {
        @include buttons.btn($btn-color: vars.$yellow, $btn-height: 4rem);
        width: 100%;
        font-size: vars.$larger;
        font-weight: bold;
    }

    .accept-btn {
        @include buttons.btn($btn-color: vars.$green, $btn-height: 4rem);
        width: 100%;
        font-size: vars.$larger;
        flex: 0 0 48%;
    }

    .cancel-btn {
        @include buttons.btn($btn-color: vars.$red, $btn-height: 4rem);
        width: 100%;
        font-size: vars.$larger;
        flex: 0 0 48%;
    }

    .delete-btn {
        @include buttons.btn($btn-color: vars.$red, $btn-height: 4rem);
        width: 100%;
        font-size: vars.$larger;
        font-weight: bold;
    }
</style>