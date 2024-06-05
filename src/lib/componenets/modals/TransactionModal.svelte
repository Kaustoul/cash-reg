<script lang="ts">
    import { enhance } from '$app/forms';
    import Modal from './Modal.svelte';

    export let showModal: boolean = false;
    export let type: 'deposit' | 'withdraw';
</script>

<Modal bind:showModal>
    <div slot="header">
        {#if type === 'deposit'}
            Vložit peníze
        {:else if type === 'withdraw'}
            Vybrat peníze
        {/if}
    </div>
    <form use:enhance>
        
    </form>
</Modal>
