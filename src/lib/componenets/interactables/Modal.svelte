<script lang="ts">
    import CloseIcon from 'svelte-material-icons/Close.svelte';
	export let showModal: boolean;
	let dialog: any;

    $: if (dialog && !showModal) dialog.close();
	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
    on:click|stopPropagation
>
<div class="contianer">
    <div class="close" on:click={() => dialog.close()}>
        <CloseIcon size={"3rem"} />  
    </div>
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
    @import '../../../styles.scss';
    dialog {
        background-color: $content-bg-color;
        border: none;
        border-radius: $large-radius;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}

	dialog {
        color: $text-color;
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
        position: absolute;
        top: 1rem;
        right: 1rem;
        cursor: pointer;
        color: $primary-color;

        &:hover {
            color: $red;
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
        border-bottom: 2px solid $accent-color;
    }
</style>