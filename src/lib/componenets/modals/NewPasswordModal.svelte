<script lang="ts">
    import Modal from '$lib/componenets/modals/Modal.svelte';

    export let showModal: boolean = false;
    export let newPassword: string;
    export let onAccept: () => void;

    let revealed = false;
    function reveal() {
        revealed = true;
    }
</script>

<Modal bind:showModal closable={false}>
    <div slot="header">Nové heslo</div>
    <div class="content">
        <div class="warning">
            <span class="text-1">
                Bylo vám vygenerováno nové heslo.<br>
            </span>
            <span class="text-2">
                Uložte si ho, nebude zobrazeno znovu!
            </span>
        </div>
        <div class="password-area">
            {#if revealed}
                <span class="password">{newPassword}</span>
            {:else}
                <button class="reveal-btn" type="button" on:click={reveal}>
                    Zobrazit heslo
                </button>
            {/if}
        </div>
        <button class="accept-btn {revealed ? "" : "disabled"}" type="button" on:click={onAccept}>
            Pokračovat
        </button>
    </div>
</Modal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;
    @use '$lib/styles/text-styles' as textStyles;

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        padding: 2rem;
        min-width: 30rem;
    }

    .password-area {
        margin: 2rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: center;
        width: 100%;
    }

    .warning {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: vars.$large;
        gap: 1rem;
    }

    .password {
        @include textStyles.mono-font;
        
        font-size: vars.$large;
        background: vars.$primary-color;
        border-radius: vars.$medium-radius;

        width: calc(100% - 4rem);
        text-align: center;

        padding: 1rem 2rem;
        border-radius: 1rem;
        letter-spacing: 0.2rem;
        user-select: all;
    }

    .reveal-btn {
        @include buttons.btn($btn-color: vars.$primary-color, $btn-height: 5rem);

        font-size: vars.$larger;
        border-radius: vars.$medium-radius;
        background: vars.$primary-color;
        font-weight: bold;
        width: 100%;
    }

    .accept-btn {
        @include buttons.btn($btn-color: vars.$accent-color, $btn-height: 5rem);
        width: 100%;
        font-size: vars.$large;
        font-weight: bold;
    }

    .text-1 {
        font-size: vars.$large;
    }

    .text-2 {
        font-size: vars.$large;
        color: vars.$red;
        font-style: italic;
    }

</style>