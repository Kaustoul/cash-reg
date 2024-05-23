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
            formData.append('id', props.id);
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
                <button class="btn" on:click={() => deleteItem(item, idx)}><DeleteIcon size={"2rem"}/></button>
            </form>
        </div>
    {/each}
    {#if maxItems === undefined || items.length < maxItems}
        <div class="btn" on:click={() => onAddPressed(props)}><PlusIcon size={"2rem"}/></div>
    {/if}
</div>

<style lang="scss">
    @import '../../../styles.scss';
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

        border-radius: $large-radius;
    }

    .btn {
        aspect-ratio: 1;
        border-radius: $large-radius;
    }

    .item {
        background-color: $primary-color;
        color: $text-color;
        display: flex;
        align-items: center;
        justify-content: start;

        font-size: large;
        
        span {
            padding-left: 1rem;
        }
    }
</style>