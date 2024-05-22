<script context="module" lang="ts">
    export type DataRow = {
        [key: string]: any;
    };
</script>

<script lang="ts">
    import MultiSelector from './MultiSelector.svelte';
    import { ensureArray } from '$lib/shared/utils';

    export let data: DataRow[];
    export let schema: {
        fieldName: string,
        type: "string" | "number" | "unsortable" | "selector",
        columnHeader: string
        props?: {
            [key: string]: any
        }

    }[];
    export let clickableRows: boolean = false;
    export let onRowClick: (productId: number) => void = () => {};
    export let idFieldName: string = "id";
    let selectedProducts: (string | number)[] = [];
    function toggleProductSelection(id: string | number) {
        const productIndex = selectedProducts.indexOf(id);
        if (productIndex < 0) {
            selectedProducts.push(id);
        } else {
            selectedProducts.splice(productIndex, 1);
        }

    }
    function isSelected(id: string | number) {
        return selectedProducts.includes(id);
    }
</script>

<table>
    <thead>
        <tr>
            <th></th>
            {#each schema as column}
                <th class="text">
                    <span>{column.columnHeader}</span>
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each data as row}
            <tr class={clickableRows ? "clickable" : ""}>
                <td class="selector">
                    <div class="selectorContainer">   
                        <input type="checkbox" checked={isSelected(row[idFieldName])} on:change={() => toggleProductSelection(row.id)}/>
                    </div>
                </td>
                {#each schema as column}
                    <td class="text" on:click={() => onRowClick(Number(row[idFieldName]))}>
                        {#if column.type === 'selector'}
                            <MultiSelector 
                                items={ensureArray(row[column.fieldName])} 
                                maxItems={column.props ? column.props.maxSelectorItems : undefined}
                                onAddPressed={column.props ? column.props.selectorOnAdd : () => {}}
                                formAction={column.props ? column.props.formAction: undefined}
                                props={{id: Number(row[idFieldName])}}
                            />
                        {:else}
                            <span>{row[column.fieldName]}</span>
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style lang="scss">
    @use 'sass:math';
    @import '../../../styles.scss';

    table {
        width: 100%;

        border-collapse: collapse;
        color: $text-color;
        font-family: 'Roboto', sans-serif;

        border: 1px solid $second-accent-color;
        border-radius: $large-radius;
    }

    th, td {
        text-align: center;
        vertical-align: middle;
        padding: 0;
    }
    
    .text {
        padding: 1rem;
    }

    input[type="checkbox"] {
        cursor: pointer;    

        display: grid;
        place-items: center;

        appearance: none;
        $size: 1.5rem;
        height: $size;
        width: $size;

        margin: 0;
        border-radius: $full-radius;
        border: 2px solid $text-color;

        &:checked::before {
            content: '';
            display: block;
            
            $spacing: .65rem;
            width: $size - $spacing;
            height: $size - $spacing;

            border-radius: $full-radius;
            background: $accent-color;
        }
    }

    th {
        background-color: $accent-color;
        color: $text-color;
    }

    tr:nth-child(even) {
        background-color: $bg-color;
    }

    .clickable:hover {
        background-color: $highlight-color;
        cursor: pointer;
    }

    // td that contains a span

    td {
        padding: 1rem;
    }

    .selector {
        width: 1.8rem;
    }

    .selectorContainer {
        flex-grow: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
</style>