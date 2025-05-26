<script lang="ts">
    import { pushState } from '$app/navigation';
    import CloseIcon from 'svelte-material-icons/Close.svelte';
	export let showModal: boolean;
    export let onDialogClosed: () => void = () => {};
    export let form: any | undefined = undefined;
    export let closable: boolean = true;
    let dialog: any;

    function closeModal() {
        onDialogClosed();
        showModal = false;
    }

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
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={closeModal}
	on:click|self={() => closable ? closeModal : () => {}}
    on:click|stopPropagation
>
<div class="contianer">
    {#if closable}
        <button class="close" on:click={closeModal}>
            <CloseIcon size={"3rem"} />  
        </button>
    {/if}
    <div class="head">

        <div class="title">
            <slot name="header" />
        </div>
        <hr />
    </div>
        <slot />
        <!-- <div class="footer">
            <slot name="footer" />
        </div> -->
    </div>
</dialog>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    dialog {
        background-color: vars.$content-bg-color;
        border: none;
        border-radius: vars.$large-radius;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}

	dialog {
        color: vars.$text-color;
        padding: 1.5rem 2rem 2rem 2rem;

        div: {
            margin: 1rem;
        
        }
    }
    
    .container {
        margin: 3rem;

        padding: 3rem;
    }

    .head {
        margin-bottom: 2.5rem;
    }

    .title {
        margin: 0;
        margin-right: .7rem;
        font-weight: bold;
        padding: 1rem 1rem 0 0;
        font-size: 3.7rem;
    }

    .close {
        @include buttons.div-btn;
        position: absolute;
        top: 1rem;
        right: 1rem;
        cursor: pointer;
        color: vars.$primary-color;

        &:hover {
            color: vars.$red;
        }
    }

    .footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 1.5rem;
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

    hr {
        border: none;
        border-bottom: 2px solid vars.$accent-color;
    }
</style>
