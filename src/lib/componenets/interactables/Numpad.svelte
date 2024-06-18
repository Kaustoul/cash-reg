<script context="module" lang="ts">
    export type NumpadData = {
        title: string,
        subtitle?: string,
        subsubtitle: string,
        label: string,
        unit?: IUnit,

        content: {
            type: 'weight' | 'money',
            value: string,
        }

        callback: (value: string) => void;
    }
</script>

<script lang="ts">
    import type { IUnit } from '$lib/shared/interfaces/product';
    import { onMount } from 'svelte';
    import ChevronDownIcon from 'svelte-material-icons/ChevronDown.svelte';

    export let data: NumpadData;
    export let onClose: () => void;

    let ref: HTMLInputElement | null = null;

    onMount(() => {
        if (ref)
            ref.focus();
    });

    function insertAtCursor(text: string) {
        if (ref) {
            console.log(ref.selectionStart, ref?.selectionEnd)
            const start = ref.selectionStart || 0;
            const end = ref.selectionEnd || 0;
            const before = data.content.value.substring(0, start);
            const after = data.content.value.substring(end);
            data.content.value = before + text + after;
            ref.focus();

            // Chrome quirk, Have to defer this until the stack is empty
            setTimeout(function() {
                ref.setSelectionRange(start + text.length, start + text.length);
            }, 0);
        }

        console.log(data.content.value)
    }

    function onInput(e) {
        if (isNaN(parseFloat(e.target.value)) || isNaN(e.target.value))
            return;

        data.content.value = e.target.value;
        console.log(e.taget.value)
    }

    function numberClicked(e: any, num: string) {
        console.log(ref.selectionStart, ref?.selectionEnd)
        insertAtCursor(num);
    }

    function clearInput() {
        data.content.value = "";
        ref.focus();
    }

    function deleteNumber() {
        if (ref) {
            let start = ref.selectionStart || 0;
            const end = ref.selectionEnd || 0;

            console.log(start, end)
            if (start === 0 && end === 0)
                return;
            
            start--;

            const before = data.content.value.substring(0, start);
            const after = data.content.value.substring(end);
            data.content.value = before + after;
            setTimeout(function() {
                ref.setSelectionRange(start, start);
            }, 0);
        }
    }
</script>

<div class="container">
<div class="header">
    <div class="flex">
        <button type="button" class="close" on:click={onClose}>
            <ChevronDownIcon size="5rem"/>
        </button>
        <span class="left">
            {data.title}
        </span>
    </div>
    <div class="column">
        {#if data.subsubtitle !== undefined}
            <span class="right-subtext">
                {data.subsubtitle}
            </span>
        {/if}
        <span class="right">
            {data.subtitle}
        </span>
    </div>
</div>

<div class="content">
    <label for="input">
        {data.label}
    <div>
        <input type="text" id="input" class="number"
            bind:this={ref}
            value={data.content.value}
            on:change={onInput}
            on:focus={(e) => e.target.select()}
        />
        
        {#if data.unit !== undefined}
            <span class="unit">{data.unit}</span>
        {/if}
    </div>
    </label>
</div>

<div class="numpad">
   <!-- <button type="button" class="numpad-btn">BTN</button>
    <button type="button" class="numpad-btn">BTN</button>
    <button type="button" class="numpad-btn">BTN</button>
    <button type="button" class="numpad-btn">BTN</button> -->
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "1")}>1</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "2")}>2</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "3")}>3</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={deleteNumber}>Smazat</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "4")}>4</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "5")}>5</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "6")}>6</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={clearInput}>Smazat vše</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "7")}>7</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "8")}>8</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "9")}>9</button>
    <button type="button" class="numpad-btn"></button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, ".")}>,</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "0")}>0</button>
    <button type="button" class="numpad-btn"></button>
    <button type="button" class="numpad-btn" on:click={() => data.callback(data.content.value)}>Přidat</button>
</div>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .header {
        flex-grow: 0;

        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: .2rem;
        background-color: vars.$second-accent-color;
        border-radius: .5rem;
        
        .left {
            font-size: 2.5rem;
        }

        .right {
            margin-right: 1rem;
            font-size: 2rem;
            text-align: right;
        }

        .right-subtext {
            margin-right: 1rem;
            font-size: 1.5rem;
            text-align: right;
            color: vars.$text2-color;
        }
    }

    .content {
        width: 100%;
        flex: 1 1 auto;

        display: flex;
        align-items: center;
        justify-content: center;

        input {
            @include inputs.number;
            text-align: center;
            font-size: xx-large;
            height: 4rem;
        }

        label {
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: xx-large;
        }

        .unit {
            font-size: xx-large;
            font-family: 'Roboto Mono', monospace;
            padding: 0;
            margin: 0;
        }
    }

    .numpad {
        flex-grow: 0;
        align-self: center;
        width: 100%;

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: .2rem;
        background-color: vars.$content-bg-color;
        border-radius: .5rem;
        margin: 1rem;

        max-width: 50rem;

        font-size: xx-large;
    }

    .numpad-btn {
        @include buttons.btn($btn-color: vars.$primary-color);
        border-radius: .5rem;
        height: 6rem;
    }

    .column {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-evenly;

        gap: .2rem;
        justify-self: end;
    }

    .flex {
        display: flex;
        gap: .2rem;
        align-items: center;
    }

    .close {
        @include buttons.div-btn;
        cursor: pointer;
    }
</style>
