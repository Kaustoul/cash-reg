<script lang="ts">
    import CatalogView from "$lib/componenets/CatalogView.svelte";
    import ShoppingCartView from "$lib/componenets/ShoppingCartView.svelte";
    import type { PageData } from "./$types";
    import CustomerIcon from "svelte-material-icons/AccountPlus.svelte";
    import { writable } from "svelte/store";
    import type { IShoppingCart, IShoppingCartItem } from "$lib/shared/interfaces/shopping-cart";
    import { addItemToCart } from "$lib/shared/utils/shopping-cart-utils";
    import Decimal from "decimal.js";

    export let data: PageData
    let carts: IShoppingCart[] = [{items: [], total: {}}];
    let selectedCart = 0;

    function addItemCart(item: IShoppingCartItem) {
        item.quantity = new Decimal(1);
        addItemToCart(carts[selectedCart], item);

        carts = carts;
    }
</script>

<main class="grid-container">
    <nav>
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
        <CatalogView products={data.products} onItemClicked={addItemCart}/>
    </div>
    
    <div class="right">
        <ShoppingCartView cart={carts[selectedCart]}/>
    </div>
</main>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

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
        min-height: 6rem;
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
    }

    .left {
        grid-area: left;
        padding: 2.5rem;
        background-color: vars.$content-bg-color;
    }

    .right {
        grid-area: right;
        background-color: vars.$content-bg-color;
    }

    .add-customer-btn {
        @include buttons.div-btn;
        cursor: pointer;

        margin-right: .7rem;
    }
</style>
