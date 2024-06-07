<script lang="ts">
    import Modal from "./Modal.svelte";
    import { enhance } from "$app/forms";

    export let showModal = false;

    let fileInputText = "Vyberte soubor";
    let file: string;

    $: if (file) {
        fileInputText = file.split('\\').pop()!;
    }
</script>

<Modal bind:showModal>
    <div slot="header">
        <span>Importovat produkty</span>
    </div>

    <form 
        method="POST"
        enctype="multipart/form-data"
        use:enhance
        action="?/importCSV"
    >
        <label class="input">
            <span>Vyberte '.csv' soubor:</span>
            <input type="file" bind:value={file} accept=".csv" name="csv"/>
            <div class="file-input">{fileInputText}</div>
        </label>

        <button class="btn" on:click={() => showModal = false}>
            Importovat
        </button>
    </form>
</Modal>

<style lang="scss">
    @use "$lib/styles/vars" as vars;
    @use "$lib/styles/buttons" as buttons;

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .input {
        display: flex;
        justify-content: space-between;
    }

    input[type="file"] {
        display: none;
    }

    label span {
        font-size: x-large;
    }

    .file-input {
        @include buttons.btn;
        flex-basis: 40%;
        flex-grow: 0;
    }

    .btn {
        @include buttons.btn($btn-color: vars.$accent-color, $btn-height: 3.5rem);
        align-self: flex-end;
        width: 10rem;
    }
</style>
