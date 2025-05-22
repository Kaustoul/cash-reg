<script lang="ts">
    import CatalogView from "$lib/componenets/CatalogView.svelte";
    import ShoppingCartView from "$lib/componenets/ShoppingCartView.svelte";
    import type { PageData } from "./$types";
    import CustomerIcon from "svelte-material-icons/AccountPlus.svelte";
    import type { IShoppingCart, IShoppingCartItem } from "$lib/shared/interfaces/shopping-cart";
    import { calculateCartTotal, calculateItemTotal } from "$lib/shared/utils/shopping-cart-utils";
    import Decimal from "decimal.js";
    import BasketIcon from "svelte-material-icons/Basket.svelte";
    import CloseIcon from "svelte-material-icons/Close.svelte";
    import Numpad, { type NumpadData } from "$lib/componenets/interactables/Numpad.svelte";
    import QrPaymentModal from "$lib/componenets/modals/QRPaymentModal.svelte";
    import CashPaymentModal from "$lib/componenets/modals/CashPaymentModal.svelte";
    import AccountPaymentModal from "$lib/componenets/modals/AccountPaymentModal.svelte";
    import { formatPricesArray } from "$lib/shared/utils/money-sum-utils";
    import Modal from "$lib/componenets/modals/Modal.svelte";
    import type { IDiscount } from "$lib/shared/interfaces/discount";
    import { CurrencyManager } from "$lib/shared/prices/currency-manager";
    import { shoppingCartStore } from "$lib/shared/stores/shoppingCartStore";
    import CustomerDropdown from "$lib/componenets/CustomerDropdown.svelte";

    export let data: PageData
    let showNoteModal = false;

    $: ({ carts, selectedCart } = $shoppingCartStore);
    $: console.log(carts[selectedCart]);


    let numpadData: NumpadData | null = null;

    function addItemCart(item: IShoppingCartItem) {
        // Adding a weight item
        if (item.unit !== 'ks' && (numpadData === null || numpadData.content.value !== "")) {
            numpadData = {
                title: item.name,
                subtitle: `${formatPricesArray(item.prices)}/${item.unit}`,
                label: "Zadat hmotnost:",
                unit: item.unit,
                content: {
                    type: 'weight',
                    value: "",
                },

                callback: (value: string) => {
                    item.quantity = new Decimal(value);
                    shoppingCartStore.addItem(item);
                    numpadData = null;
                },

            }

            return;
        }
        
        //Adding a piece item
        item.quantity = new Decimal(1);
        shoppingCartStore.addItem(item);
    }

    function setDiscountNumpadData(
        type: IDiscount['type'], 
        targetType: "cart" | "item",
        target: IShoppingCartItem | IShoppingCart
    ): void {
        numpadData = {
            title: targetType == "cart" ? "Sleva na nákup" : (target as IShoppingCartItem).name, 
            label: "Zadejte slevu",
            unit: type === "PRC" ? "%" : CurrencyManager.getCurrency(type).getSymbol(),
            content: {
                type: 'discount',
                value: "",
            },
            callback: (value: string) => {
                const numpadDataCpy = numpadData;
                numpadData = null;

                if (target.discounts === undefined) {
                    target.discounts = [];
                }

                shoppingCartStore.addCartDiscount({
                    type,
                    value,
                    source: "till"
                });

                if (targetType === "item") {
                    calculateItemTotal(target as IShoppingCartItem)
                }

                calculateCartTotal(carts[selectedCart]);
                numpadData = numpadData;
            },
        }
    }
</script>

{#if carts[selectedCart].state === 'qr-payment'}
    <QrPaymentModal appSettings={data.settings}/>
{:else if carts[selectedCart].state === 'cash-payment'}
    <CashPaymentModal/>
{:else if carts[selectedCart].state === 'account-payment'}
    <AccountPaymentModal/>
{/if}

<Modal bind:showModal={showNoteModal}>
    <div slot="header">
        Přidat poznámku
    </div>
    <input type="text" class="note-input" placeholder="Poznámka..." bind:value={carts[selectedCart].note}/>
</Modal>

<main class="grid-container">
    <nav>
        {#each carts as cart, index}
            {#if cart.items.length === 0}
                <button type="button" 
                    on:click={() => shoppingCartStore.selectCart(index)}
                    class={"cart-btn" + (selectedCart === index ? " selected" : "")}
                >
                    
                    <div class="cart-btn-icon"><BasketIcon size="3rem"/></div>
                    <span class="cart-btn-idx">+</span>
                </button>
            {:else} 
                <div class="cart-selector">
                    {#if selectedCart === index} 
                        <button type="button" 
                            on:click|stopPropagation={() => shoppingCartStore.removeCart()}
                            class={"cart-storno"}
                        >
                            <CloseIcon size="2rem"/>
                        </button>
                    {/if}
                    <button type="button" 
                        on:click={() => shoppingCartStore.selectCart(index)}
                        class={"cart-btn" + (selectedCart === index ? " selected" : "")}
                    >
                        <div class="cart-btn-icon"><BasketIcon size="3rem"/></div>
                        <span class="cart-btn-idx">{index + 1}</span>
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
        <CustomerDropdown/>
        <!-- <button type="button"
            class="add-customer-btn"
            on:click={() => {}}
            >
            <CustomerIcon size="4rem"/>
        </button> -->
    </header>
    
    <div class="left">
        {#if !numpadData && carts[selectedCart].state === 'checkout'}
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
                onClose={() => shoppingCartStore.setState("items")}
                bind:cart={carts[selectedCart]}
            />
        {:else if numpadData !== null}
            <Numpad bind:data={numpadData} onClose={() => { numpadData=null; shoppingCartStore.setState("items") }}/>
        {:else}
            <CatalogView products={data.products} onItemClicked={addItemCart}/>
        {/if}
    </div>
    
    <div class="right">
        <ShoppingCartView 
            onNote={() => showNoteModal = true}
            appSettings={data.settings}
            onDiscountPressed={setDiscountNumpadData}
        />
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
        height: 100%;
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
            
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;

            border-radius: vars.$large-radius;
            border: 3px solid vars.$primary-color;
            background-color: vars.$content-bg-color;
            font-size: vars.$large;

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

    .note-input {
        @include inputs.text;
        padding: 2rem;
        border-radius: vars.$large-radius;
        border: 2px solid vars.$accent-color;
    }
</style>
