<script lang="ts">
    import { selectAll } from "../input-handlers";

    export let value: string = "";
    export let onChange: (event: any) => void;
    export let minWidth: string = "1ch";

    let input;
    function updateSize(event: any): void {
        value = event.target.value;

        if (value === "") {
            value = "1";
        }

        onChange(event);
        input.style.width = `${value.length}ch`;
    }


</script>

<input 
    type="number" 
    class="input" 
    {value} 
    on:keyup={updateSize}
    on:click|stopPropagation
    on:focus={(e) => e.target.select()}
    bind:this={input}
    style={`width: ${value !== undefined ? value.length : 1}ch; min-width: ${minWidth}`}
/>


<style lang="scss">
    @use '$lib/styles/inputs' as inputs;

    .input {
        @include inputs.number;
        padding: 0;
        margin: 0;
        text-align: center;
    }
</style>
