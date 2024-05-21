<script lang="ts">
    import PlusIcon from 'svelte-material-icons/Plus.svelte';
    import DeleteIcon from 'svelte-material-icons/Close.svelte';
    import { enhance } from '$app/forms';

    export let items: string[] = [];
    export let onAddPressed: (prpos: { [key: string]: any }) => void = () => {};
    export let onItemDeleted: (item: string, props: { [key: string]: any}) => void = () => {};
    export let maxItems: number | undefined = undefined;
    export let props: { [key: string]: any } = {};
    export let formAction: string | undefined = undefined;

    async function deleteItem(value: string) {
        console.log(formAction)
        onItemDeleted(value, props);
        
        if (formAction) {
            const formData = new FormData();
            formData.append('item', value);
            formData.append('id', props.id);

            await fetch(formAction, {
                method: 'POST',
                body: formData
            });
        }

        items = items.filter(item => item !== value);
    }
</script>


<div class="container">
    {#each items as item}
        <div class="item">
            <span>
                {item}
            </span>
            <form use:enhance method="POST" action={formAction !== undefined ? formAction : ''}>
                <button class="btn" on:click={() => deleteItem(item)}><DeleteIcon size={"2rem"}/></button>
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
    }

    .container > div {
        flex: 0 0 auto;
        padding: 0.3rem;
        padding: .5rem .3rem;        

        border-radius: $large-radius;
    }

    .btn {
        aspect-ratio: 1;
        border-radius: $large-radius;
        padding: 0.3rem;
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