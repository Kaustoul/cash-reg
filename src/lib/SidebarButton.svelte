<script lang="ts">
    import MissingIcon from 'svelte-material-icons/AlertCircle.svelte';

    export let text: string = "NavButton";
    export let icon = MissingIcon;
    export let selected: boolean = false;
    export let disabled: boolean = false;
    export let onClick: () => void;
    export let hidden: boolean = false;
</script>

<button type="button" 
    class="list-btn {selected ? 'selected' : ''} {disabled ? 'disabled' : ''} {hidden ? 'hidden' : ''}"
    on:click={onClick}
>
    <svelte:component this={icon} size="1.5rem"/>
    <span>{text}</span>
</button>

<style lang="scss">
    @use '$lib/styles/buttons' as buttons;
  
    .list-btn {
        @include buttons.list-btn($btn-height: 2.5rem);
        width: 100%;
        height: auto;
        font-size: larger;
    }
</style>
