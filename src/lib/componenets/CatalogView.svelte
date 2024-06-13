<script lang="ts">
    import type { IProduct } from "$lib/shared/interfaces/product";
    import type { IItem } from "$lib/shared/interfaces/item";
    import { isSingleVariant, formatProductName, singleVariantFullId } from "$lib/shared/utils/product-utils";
    import { fullItemId } from "$lib/shared/utils/item-utils";
    import SearchBar from "$lib/componenets/SearchBar.svelte";
    import BackIcon from 'svelte-material-icons/ChevronLeft.svelte'
    import type { IShoppingCartItem } from "$lib/shared/interfaces/shopping-cart";

    export let onItemClicked:(item: IShoppingCartItem) => void;

    export let products: IProduct[];
    let filteredProducts: IProduct[];
    let searchBar;

    let currentProduct: IProduct | undefined = undefined;

    function viewProductItems(productId: number) {
        currentProduct = products.find((product) => product.productId === productId)!; 
    }

    function toDefaultView(clearSearch: boolean = false) {
        if (clearSearch) {
            searchBar.clear();
        }

        currentProduct = undefined;
    }
</script>

<div class="controls">
    {#if currentProduct === undefined}
       <SearchBar 
            data={products}
            keys={["name", "items.subname"]}
            bind:results={filteredProducts} 
            bind:this={searchBar}
        />
    {:else}
        <button type="button"
            class="back"
            on:click={() => toDefaultView()}
        >
            <BackIcon size="3.5rem"/> 
        </button>
    {/if}
</div>

<div class="container">
    {#if currentProduct === undefined}
        {#each filteredProducts ?? products as product}
            {#if isSingleVariant(product)}
                <button type="button"
                    class="single-item"
                    on:click={() => onItemClicked({
                        productId: product.productId,
                        itemId: product.items[0].itemId,
                        name: formatProductName(product),
                        prices: product.items[0].priceIdxs.map(idx => product.prices[idx]),
                        priceIdx: 0
                    })}
                >
                    <p>{formatProductName(product)}</p>
                </button>
            {:else}
                <button type="button"
                    class="multi-item"
                    on:click={() => viewProductItems(product.productId)}
                >
                    <p>{formatProductName(product)}</p>
                </button>
            {/if}
        {/each}
    {:else}
        {#each currentProduct.items as item}
            <button type="button"
                class="single-item"
                on:click={() => onItemClicked({
                        productId: item.productId,
                        itemId: item.itemId,
                        name: currentProduct.name + " - " + item.subname,
                        prices: item.priceIdxs.map(idx => currentProduct.prices[idx]),
                        priceIdx: 0
                    })}
            >
                <p>{item.subname}</p>
            </button>
        {/each}
    {/if}
</div>

<style lang="scss">
    @use "$lib/styles/vars" as vars;
    @use "$lib/styles/buttons" as buttons;
    @use "$lib/styles/inputs" as inputs;

    .container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: space-evenly;
    
        margin: auto;
    }
    
    .controls {
        display: flex;
        justify-content: space-between;
        align-items: end;

        .back {
            @include buttons.div-btn;
            flex: 0 0 8%;
            margin: 0;
            padding: 0;
        }
    }

    button {
        @include buttons.btn;
       
        
        flex: 0 0 23%;
        height: 5rem;
        position: relative;
        margin-top: .3rem;

        p {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    }

    .single-item {
        border-radius: vars.$medium-radius;
    }

    .multi-item {
        border-radius: 
            vars.$medium-radius
            vars.$medium-radius
            vars.$medium-radius 
            vars.$large-radius
        ;

        box-shadow:
            -1px 1px 0 0 vars.$content-bg-color,
            -5px 5px 0 0 vars.$primary-color,
            -6px 6px 0 0 vars.$content-bg-color,
            -10px 10px 0 0 vars.$primary-color,
        ;
        
        &:hover {
            box-shadow:
                -1px 1px 0 0 vars.$content-bg-color,
                -5px 5px 0 0 lighten($color: vars.$primary-color, $amount: 10%),
                -6px 6px 0 0 vars.$content-bg-color,
                -10px 10px 0 0 lighten($color: vars.$primary-color, $amount: 10%),
            ;
        }
    }

</style>
