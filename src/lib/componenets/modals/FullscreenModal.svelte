<script lang="ts">
    import { onDestroy, onMount } from "svelte";

	export let showModal: boolean;
    export let onDialogClosed: () => void = () => {};

    export let onCancel: () => void;
    export let onConfirm: () => void;

    function closeModal() {
        onDialogClosed();
        showModal = false;
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
        event.preventDefault();
        }
    }

    onMount(() => {
        if (dialog) {
            dialog.addEventListener('keydown', handleKeyDown);
        }
    });

    onDestroy(() => {
        if (dialog) {
            dialog.removeEventListener('keydown', handleKeyDown);
        }
    });

    $: {
        if (dialog && !showModal) {
            dialog.close();
        }
    }

	$: { 
        if (dialog && showModal) {
            dialog.showModal();
        }
    }

    let dialog: any;

</script>


<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
    bind:this={dialog}
    on:close={closeModal}
    on:click|stopPropagation
>
        <div class="content">
            <slot />
        </div>
        <div class="buttons">
            <button type="button" class="cancel" on:click={onCancel}>Zrušit</button>
            <button type="button" class="confirm" on:click={onConfirm}>Dokončit</button>
        </div>
</dialog>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .modal {
        width: 100%;
        height: 100%;

        display: flex;
    }

    .content {
        border: 4px solid vars.$accent-color;
        border-radius: vars.$large-radius;
        width: 100%;
    }
    
    .buttons {
        display: flex;
        justify-content: center;
        gap: 20%;
        margin-top: 2rem;
        width: 100%;
    }

    .cancel {
        @include buttons.btn($btn-color: vars.$red, $btn-height: 3.5rem);
        max-width: 30rem;
        font-size: larger;
    }

    .confirm {
        @include buttons.btn($btn-color: vars.$green, $btn-height: 3.5rem);
        max-width: 30rem;
        font-size: larger;
    }

    dialog {
        background-color: vars.$content-bg-color;
        border: none;
        border-radius: vars.$large-radius;

        width: 80vw;
        height: 80vh;

        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        overflow: hidden;

        &:focus {
            outline: none;
        }

        &> * {
            max-width: 1400px;
        }
	}

	dialog::backdrop {
		background: vars.$content-bg-color;
	}

	dialog {
        color: vars.$text-color;
        padding: 1.5rem 2rem 2rem 2rem;

        div: {
            margin: 1rem;
        
        }
    }
    

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

</style>
