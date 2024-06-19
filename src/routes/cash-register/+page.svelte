<script lang="ts">
    import CatalogView from "$lib/componenets/CatalogView.svelte";
    import ShoppingCartView from "$lib/componenets/ShoppingCartView.svelte";
    import type { PageData } from "./$types";
    import CustomerIcon from "svelte-material-icons/AccountPlus.svelte";
    import type { IShoppingCart, IShoppingCartItem } from "$lib/shared/interfaces/shopping-cart";
    import { addItemToCart } from "$lib/shared/utils/shopping-cart-utils";
    import Decimal from "decimal.js";
    import BasketIcon from "svelte-material-icons/Basket.svelte";
    import CloseIcon from "svelte-material-icons/Close.svelte";
    import Numpad, { type NumpadData } from "$lib/componenets/interactables/Numpad.svelte";
    import { formatPrice } from "$lib/shared/utils";
    import QrPaymentModal from "$lib/componenets/modals/QRPaymentModal.svelte";
    import CashPaymentModal from "$lib/componenets/modals/CashPaymentModal.svelte";

    export let data: PageData
    let carts: IShoppingCart[] = [emptyCart()];
    let selectedCart = 0;

    let numpadData: NumpadData | null = null;

    function emptyCart(): IShoppingCart {
        return {
            items: [],
            total: {},
            state: "items",
            checkout: {
                payedAmount: new Decimal(0)
            },
            tillId: 1,
        }
    }

    function addItemCart(item: IShoppingCartItem) {
        if (item.unit !== 'ks' && (numpadData === null || numpadData.content.value !== "")) {
            numpadData = {
                title: item.name,
                subtitle: `${formatPrice(item.prices[item.priceIdx])}/${item.unit}`,
                label: "Zadat hmotnost:",
                unit: item.unit,
                content: {
                    type: 'weight',
                    value: "",
                },
                callback: (value: string) => {
                    item.quantity = new Decimal(value);
                    insertToCart(carts[selectedCart], item);
                    numpadData = null;
                },

            }
            return;
        }

        item.quantity = new Decimal(1);
        insertToCart(carts[selectedCart], item);
    }

    function insertToCart(cart: IShoppingCart, item: IShoppingCartItem) {
        if (carts[selectedCart].items.length === 0) {
            carts.push(emptyCart());
        }

        addItemToCart(cart, item);
        carts = carts;
    }

    function stornoCart() {
        carts.splice(selectedCart, 1);
        selectedCart = 0;

        carts = carts;
    }

    async function finalizeCart() {
        const data = new FormData();
        data.set('cart', JSON.stringify(carts[selectedCart]));

        const res = await fetch('?/finalizeOrder', {
            method: 'POST',
            body: data
        });

       stornoCart(); 
    }
</script>

{#if carts[selectedCart].state === 'qr-payment'}
    <QrPaymentModal bind:cart={carts[selectedCart]} onConfirm={finalizeCart}/>
{:else if carts[selectedCart].state === 'cash-payment'}
    <CashPaymentModal bind:cart={carts[selectedCart]} onConfirm={finalizeCart}/>
{/if}

<main class="grid-container">
    <nav>
        {#each carts as cart, index}
            {#if cart.items.length === 0}
                <button type="button" 
                    on:click={() => selectedCart = index}
                    class={"cart-btn" + (selectedCart === index ? " selected" : "")}
                >
                    
                    <div class="cart-btn-icon"><BasketIcon size="3rem"/></div>
                    <div class="cart-btn-idx">+</div>
                </button>
            {:else} 
                <div class="cart-selector">
                    {#if selectedCart === index} 
                        <button type="button" 
                            on:click|stopPropagation={stornoCart}
                            class={"cart-storno"}
                        >
                            <CloseIcon size="2rem"/>
                        </button>
                    {/if}
                    <button type="button" 
                        on:click={() => selectedCart = index}
                        class={"cart-btn" + (selectedCart === index ? " selected" : "")}
                    >
                        <div class="cart-btn-icon"><BasketIcon size="3rem"/></div>
                        <div class="cart-btn-idx">{index + 1}</div>
                    </button>
                    {#if selectedCart === index} 
                        <div class="storno-spacer"></div>
                    {/if}
                </div>
            {/if}
        {/each}
    </nav>
    
    <header>
        <button type="button"
            class="home-btn"
            on:click={() => history.back()}
        >
            <img src="/logo.svg" alt="Logo" style="filter: invert(100%)" height="75"/>
        </button>
        <button type="button"
            class="add-customer-btn"
            on:click={() => {}}
            >
            <CustomerIcon size="4rem"/>
        </button>
    </header>
    
    <div class="left">
        {#if carts[selectedCart].state === 'checkout'}
            <Numpad 
                data={{
                    title: "",
                    label: "Zaplatit:",
                    returnLabel: "Zpět na položky",
                    confirmLabel: "Zaplatit",
                    content: {
                        type: 'money',
                        value: "",
                    },
                    callback: (value) => {},
                }} 
                onClose={() => carts[selectedCart].state = 'items'}
                bind:cart={carts[selectedCart]}
            />
        {:else if numpadData !== null}
            <Numpad data={numpadData} onClose={() => numpadData=null}/>
        {:else}
            <CatalogView products={data.products} onItemClicked={addItemCart}/>
        {/if}
    </div>
    
    <div class="right">
        <ShoppingCartView bind:cart={carts[selectedCart]} onEmptyCart={stornoCart}/>
        <div class="right-buttons">
        </div>
    </div>
</main>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .grid-container {
        display: grid;
        grid-template-columns: 7.5rem 1fr 1fr;
        grid-template-rows: auto 1fr;
        height: 100vh;
        grid-template-areas:
            "header header right"
            "nav left right";

        grid-gap: .2rem;
    }

    header {
        grid-area: header;
        min-height: 5.8rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        align-items: center;

        button {
            @include buttons.div-btn;
            cursor: pointer;
        }
    }

    nav {
        grid-area: nav;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        margin: 1rem 0;
        color: vars.$text-color;

        .cart-selector {
            display: flex;

            .storno-spacer {
                width: 2rem;
            }
        }

        .cart-btn {
            @include buttons.div-btn;
            cursor: pointer;
            
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            ovelflow: hidden;

            border-radius: vars.$large-radius;
            border: 3px solid vars.$primary-color;
            background-color: vars.$content-bg-color;
            font-size: xx-large;

            &.selected {
                color: vars.$accent-color;
            }

            .cart-btn-icon {
                display: flex;
                justify-content: center;
                align-items: center;

                padding: .5rem .5rem .5rem .3rem;
                border-radius: vars.$large-radius;
                background-color: vars.$content-bg-color;
            }

            .cart-btn-idx {
                padding: .5rem .5rem .5rem .2rem;
                border-radius: vars.$large-radius;
            }
        }

        .cart-storno {
            display: contents;
            @include buttons.div-btn;
            cursor: pointer;
            border-radius: vars.$large-radius; 
            width: 2rem;
            height: 2rem;
            aspect-ratio: 1;
            transform: translate(1.5rem, -.5rem);

            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;

            color: vars.$red;
            background-color: vars.$content-bg-color;
            border: 3px solid vars.$primary-color;

        }
    }
    
    .weight-form {
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;

        input {
            @include inputs.number;
        }
    }

    .left {
        @include inputs.scrollable;
        grid-area: left;
        background-color: vars.$content-bg-color;
    }


    .right {
        grid-area: right;
        background-color: vars.$content-bg-color;
        overflow: none;
    }


    .add-customer-btn {
        @include buttons.div-btn;
        cursor: pointer;

        margin-right: .7rem;
    }
</style>
