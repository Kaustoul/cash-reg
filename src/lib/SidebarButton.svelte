<script lang="ts">
    import MissingIcon from 'svelte-material-icons/AlertCircle.svelte';

    export let text: string = "NavButton";
    export let icon = MissingIcon;
    export let selected: boolean = false;
    export let disabled: boolean = false;
    export let onClick: () => void;
</script>

<div class="list-btn {selected ? 'selected' : ''} {disabled ? 'disabled' : ''}"
    on:click={onClick}>
    <svelte:component this={icon} size="1.5rem"/>
    <span>{text}</span>
</div>

<style lang="scss">
    @import '../styles.scss';
</style>