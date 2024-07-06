<script lang="ts">
    import PlusIcon from 'svelte-material-icons/Plus.svelte';
    import DeleteIcon from 'svelte-material-icons/Close.svelte';
    import { enhance } from '$app/forms';

    export let items: string[] = [];
    export let onAddPressed: (prpos: { [key: string]: any }) => void = () => {};
    export let onItemDeleted: (item: string, props: { [key: string]: any}) => void = () => {};
    export let maxItems: number | undefined = undefined;
    export let props: { [key: string]: any } = {};
    export let deleteEndpoint: string | undefined = undefined;

    async function deleteItem(value: string, idx: number) {
        onItemDeleted(value, props);
        if (deleteEndpoint) {
            const formData = new FormData();
            formData.append('item', value);
            formData.append('priceIdx', props.id);
            formData.append('idx', idx.toString());

            await fetch(deleteEndpoint, {
                method: 'POST',
                body: formData
            });
        }

        items = items.filter(item => item !== value);
    }

</script>


<div class="container">
    {#each items as item, idx}
        <div class="item">
            <span>
                {item}
            </span>
            <form use:enhance method="POST" action={deleteEndpoint !== undefined ? deleteEndpoint : ''}>
                <button type="button"
                    class="btn"
                    on:click={() => deleteItem(item, idx)}
                >
                    <DeleteIcon size={"2rem"}/>
                </button>
            </form>
        </div>
    {/each}
    {#if maxItems === undefined || items.length < maxItems}
        <button type="button"
            class="btn plus"
            on:click={() => onAddPressed(props)}
        >
            <PlusIcon size={"2rem"}/>
        </button>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: .5rem;
    }

    .container > div {
        flex: 0 0 auto;
        padding: 0.3rem;
        // padding: .5rem;        

        border-radius: vars.$large-radius;
    }

    .btn {
        @include buttons.btn($btn-height: auto);
        width: auto;
        flex-grow: 0;
        aspect-ratio: 1;
        border-radius: vars.$large-radius;
    
        &.plus {
            padding: 0.5rem;
        }

    }

    .item {
        background-color: vars.$primary-color;
        color: vars.$text-color;
        display: flex;
        align-items: center;
        justify-content: start;
        
        span {
            padding-left: 1rem;
        }
    }
</style>
