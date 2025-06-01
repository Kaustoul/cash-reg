<script lang="ts">
    import Modal from './Modal.svelte';

    export let showModal: boolean = false;
    export let message: string = '';
    export let onConfirm: () => void = () => {};

    function handleAccept() {
        showModal = false;
        onConfirm();
    }
</script>

<Modal bind:showModal>
    <div slot="header">Upozornění</div>
    <div class="container">    
        <div class="alert-message">{message}</div>
        <div class="footer">
            <button class="btn accept-btn" type="button" on:click={handleAccept}>Potvrdit</button>
        </div>
    </div>
</Modal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .container {
        display: flex;
        flex-direction: column;
        padding: 2rem;
        margin: 2rem;
    }
    
    .alert-message {
        font-size: vars.$large;
        margin: 2rem 0;
        text-align: center;
    }

    .footer {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
        .accept-btn {
            @include buttons.btn($btn-color: vars.$green, $btn-height: 3.5rem);
            font-size: vars.$large;
            min-width: 8rem;
        }
    }
</style>