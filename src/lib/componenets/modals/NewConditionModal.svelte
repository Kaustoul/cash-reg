<script lang="ts">
    import Modal from '$lib/componenets/modals/Modal.svelte';
    import { enhance } from "$app/forms";
    import ConditionInput from './ConditionInput.svelte';


    export let showModal: boolean = false;
    export let units: string;

    let min = '';
    let max = '';

    $: {
        if (showModal) {
            min = '';
            max = '';
        }
    }

    function onSubmit() {
        showModal = false;
    }
</script>
<Modal bind:showModal>
    <div slot="header">
        Přidat podmínku
    </div>
    <form method='POST' action="?/newCondition" >
        <div class="inputs-header">
            <span>
                Množstevní podmínka
            </span>
        </div>
        <ConditionInput units={units} bind:min bind:max/>
        <div class="footer">
            <button class="btn" on:click={onSubmit}>
                Přidat
            </button>
        </div>
    </form>
</Modal>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    .inputs-header{
        font-size: xx-large;
        color: vars.$text-color;
        margin-bottom: 1.5rem;
        text-decoration: underline;
    }

    .footer {
        display: flex;
        justify-content: end;

        .btn {
            @include buttons.btn($btn-color: vars.$green);
            margin-top: 1.5rem;
            font-size: x-large;
            height: 3.5rem;
            width: 8rem;
            flex-grow: 0;
        }
    }
</style>
