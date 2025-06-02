<script lang="ts"> 
    export let units: string;
    export let min = '';
    export let max = '';
</script>

<div class="inputs">
    <div class="left">
        <input 
            name="max" 
            type="number" 
            class="input-field left" 
            min="0" 
            step="1" 
            placeholder="Max"
            bind:value={max}
        />
        {units}
    </div>
    <span class="text-between">&gt;</span>
    <span class="text-between">množství</span>
    <span class="text-between">≥</span>
    <div class="right">
        <input 
            name="min" 
            type="number" 
            class="input-field" 
            min="0" 
            step="1" 
            placeholder="Min"
            bind:value={min}
        />
        <span>{units}</span>
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .text-between {
        margin: 0.5rem;
        color: vars.$text-color;
        font-size: larger;
    }

    .left {
        display: flex;
        justify-content: end;
        align-items: center;
        flex-grow: 0;
    }

    .right {
        display: flex;
        justify-content: start;
        align-items: center;
        flex-grow: 0;
    }

    .inputs {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: x-large;
        gap: 2rem;
    }

    .input-field {
        @include inputs.number;
        width: 5rem;
    }
</style>
