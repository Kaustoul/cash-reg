<script context="module" lang="ts">
    export type NumpadData = {
        title: string,
        subtitle?: string,
        subsubtitle?: string,
        label: string,
        returnLabel?: string,
        confirmLabel?: string,
        unit?: IUnit,

        content: {
            type: 'weight' | 'money',
            value: string,
        }

        callback: (value: string) => void;
        moneyCallback?: (value: Decimal) => void;
    }
</script>

<script lang="ts">
    import type { IUnit } from '$lib/shared/interfaces/product';
    import Decimal from 'decimal.js';
    import type { IShoppingCart } from '$lib/shared/interfaces/shopping-cart';
    import { onMount } from 'svelte';
    import ChevronLeftIcon from 'svelte-material-icons/ChevronLeft.svelte';
    import { formatDecimal } from '$lib/shared/utils';
    import ReloadIcon from 'svelte-material-icons/Reload.svelte';

    export let data: NumpadData;
    export let onClose: () => void;
    export let cart: IShoppingCart | undefined = undefined;

    let ref: HTMLInputElement | null = null;
    onMount(() => {
        if (ref)
            ref.focus();
    });

    function insertAtCursor(text: string) {
        if (ref) {
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
    }

    function onInput(e) {
        if (isNaN(parseFloat(e.target.value)) || isNaN(e.target.value))
            return;

        data.content.value = e.target.value;
    }

    function numberClicked(e: any, num: string) {
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

    function onConfirm() {
        if (data.content.type === 'money') {
            addMoney(new Decimal(data.content.value));
            data.content.value = "";
            return;
        }

        data.callback(data.content.value);
    }

    function addMoney(value: Decimal) {
        if (cart === undefined)
            return;

        cart.checkout.payedAmount = cart.checkout.payedAmount.add(value);

        if (cart.checkout.payedAmount.gte(cart.total["CZK"].value)) {
            cart.state = "cash-payment"; 
        }
    }

</script>

<div class="container">
<div class="header">
    <div class="flex">
        <button type="button" class="close" on:click={onClose}>
            <ChevronLeftIcon size="5rem"/>
            {#if data.returnLabel !== undefined}
                <span class="return-label">{data.returnLabel}</span>
            {/if}
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
            {#if data.subtitle !== undefined}
                {data.subtitle}
            {/if}
        </span>
    </div>
</div>

<div class="content">
    {#if data.content.type === 'money'}
        <div class="money">
            <button type="button" class="money-btn" 
                on:click={() => addMoney(new Decimal(500))}
            >500</button>
            <button type="button" class="money-btn" 
                on:click={() => addMoney(new Decimal(1000))}
            >1000</button>
            <button type="button" class="money-btn" 
                on:click={() => addMoney(new Decimal(2000))}
            >2000</button>
            <button type="button" class="money-btn" 
                on:click={() => addMoney(new Decimal(50))}
            >50</button>
            <button type="button" class="money-btn" 
                on:click={() => addMoney(new Decimal(100))}
            >100</button>
            <button type="button" class="money-btn" 
                on:click={() => addMoney(new Decimal(200))}
            >200</button>
        </div>
        <div class="checkout-container">
            <div class="checkout-spacer" />
            <div class="checkout-status">
                <div class="left">
                    {#if cart !== undefined}
                        <span class="checkout-status-title">Zaplaceno:</span>
                        <span class="checkout-status-price">
                            {formatDecimal(cart.checkout.payedAmount)} Kč
                        </span>
                    {/if}
                </div>
                <div class="right">
                    {#if cart !== undefined}
                        <span class="checkout-status-title">Zbývá:</span>
                        <span class="checkout-status-price">
                            {formatDecimal(new Decimal(cart.total["CZK"].value)
                                .minus(cart.checkout.payedAmount))} Kč
                        </span>
                    {/if}
                </div>
            </div>
            <button type="button" class="checkout-reset" 
                on:click={() => cart.checkout.payedAmount = new Decimal(0)}
            >
                <ReloadIcon size="3rem" /> 
            </button>

        </div>
    {/if}
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
    <button type="button" class="numpad-btn red" on:click|preventDefault={deleteNumber}>Smazat</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "4")}>4</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "5")}>5</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "6")}>6</button>
    <button type="button" class="numpad-btn red" on:click|preventDefault={clearInput}>Smazat vše</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "7")}>7</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "8")}>8</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "9")}>9</button>
    <button type="button" class="numpad-btn disabled" ></button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, ".")}>,</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "0")}>0</button>
    <button type="button" class="numpad-btn" on:click|preventDefault={(e) => numberClicked(e, "00")}>00</button>
    <button type="button" class="numpad-btn green" 
        on:click={onConfirm}
    >{data.confirmLabel !== undefined ? data.confirmLabel : "Přidat"}</button>
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
        justify-content: space-between;
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
            font-size: vars.$x-large;
        }

        .right {
            margin-right: 1rem;
            font-size: vars.$large;
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
        margin: 1rem 0;
        
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        input {
            @include inputs.number;
            text-align: center;
            font-size: vars.$larger;
            height: 3rem;
        }

        label {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: vars.$larger;
        }

        .unit {
            font-size: vars.$large;
            font-family: 'Roboto Mono', monospace;
            padding: 0;
            margin: 0;
        }
    }

    .numpad {
        flex-grow: 0;
        align-self: center;
        width: 100%;
        margin-bottom: .5rem;

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: .2rem;
        background-color: vars.$content-bg-color;
        border-radius: .5rem;

        max-width: 50rem;

        font-size: vars.$larger;
    }

    .return-label {
        font-size: vars.$larger;
    }

    .numpad-btn {
        @include buttons.btn($btn-color: vars.$primary-color);
        border-radius: .5rem;
        height: 4rem;
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

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .money {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: .5rem;

        .money-btn {
            @include buttons.btn($btn-color: vars.$bg-color);
            flex: 0 1 30%;
            height: 3rem;
            width: 9rem;

            font-size: vars.$larger;
            font-family: 'Roboto Mono', monospace;
        }
    }

    .checkout-container {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .checkout-status {
        min-width: 23rem;
        display: flex;
        flex-direction: column;
        margin: 1rem;
        width: 100%;
        max-width: 30rem;    
        background-color: vars.$primary-color;
        padding: 1rem;
        border-radius: vars.$large-radius;

        .left, .right {
            font-size: vars.$larger;
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .checkout-status-price {
            font-family: 'Roboto Mono', monospace;
        }
    }

    .checkout-reset {
        @include buttons.div-btn;
        cursor: pointer;

        width: 3rem;
    }

    .checkout-spacer {
        width: 5rem;
    }

    .red {
        @include buttons.btn($btn-color: vars.$red);
        font-size: vars.$larger;
    }

    .green {
        @include buttons.btn($btn-color: vars.$green);
        font-size: vars.$larger;
    }
</style>
