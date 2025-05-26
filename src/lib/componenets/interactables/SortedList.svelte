<script context="module" lang="ts">
    export type DataRows = {
        [key: string]: any;
    }[];

    export type Schema = {
        fieldName: string,
        type: "string" | "number" | "unsortable" | "selector" | "json" | "link" | "sum" | "decimal",
        columnHeader: string,
        jsonToString?: (obj: any) => string,
        customData?: any,
        searchKey?: boolean,
        props?: {
            [key: string]: any
        }
        url?: string,
        urlParams?: string[],
        class?: (row: any, column: any) => string

    }[];
</script>

<script lang="ts">
    import MultiSelector from './MultiSelector.svelte';
    import { ensureArray, formatDecimal } from '$lib/shared/utils';
    import { formatSum } from '$lib/shared/utils/money-sum-utils';

    export let data: DataRows;
    export let schema: Schema;
    export let clickableRows: boolean = false;
    export let onRowClick: (id: number) => void = () => {};
    export let idFieldName: string = "idx";
    export let selected: (string | number)[] = [];
    export let defaultJsonToString: (obj: any) => string = (obj) => JSON.stringify(obj);
    export let selectors: boolean = true;
    export let customRenderer: { [fieldName: string]: (row: any, column: any) => any } = {};
    export let emptyMessage: string = "Žádná data k zobrazení";

    function toggleProductSelection(idx: number, id?: string | number) {
        const selection = idFieldName === "idx" ? idx : id!;
        const selectedIdx = selected.indexOf(selection);
        if (selectedIdx < 0) {
            selected.push(selection);
        } else {
            selected.splice(selectedIdx, 1);
        }
        // We have to reasign the value so that svelte knows to rerender
       selected = selected; 
    }
    
    function isSelected(idx: number, id?: string | number) {
        if (idFieldName === "idx") {
            return selected.includes(idx);
        }

        return selected.includes(id!);
    }

    function parseUrlWithParams(url: string | undefined, urlParams: string[] | undefined, row: any): string {
        console.log("Parsing URL with params:", url, urlParams, row);
        if (!row || !url) return '#';
        if (!urlParams) return row.url;
        let result = url;
        if (urlParams && Array.isArray(urlParams)) {
            for (const param of urlParams) {
                console.log("Replacing param:", param, "with value:", row[param]);
                result = result.replace("${" + param + "}", encodeURIComponent(row[param]));
            }
        }
        return result;
    }
</script>

<table>
    <thead>
        <tr>
            {#if selectors}
                <th></th>
            {/if}
            {#each schema as column}
                <th class="text">
                    <span>{column.columnHeader}</span>
                </th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#if !data || data.length === 0}
            <tr>
                <td colspan={selectors ? schema.length + 1 : schema.length} class="text">
                    <div class="empty">{emptyMessage}</div>
                </td>
            </tr>
        {:else}
            {#each data as row, idx}
                <tr class={clickableRows ? "clickable" : ""}>
                    {#if selectors}
                        <td class="selector">
                            <div class="selectorContainer">   
                                <input 
                                    type="checkbox" 
                                    checked={isSelected(idx, row[idFieldName])}
                                    on:change={() => toggleProductSelection(idx, row[idFieldName])}
                                />
                            </div>
                        </td>
                    {/if}
                    {#each schema as column}
                        <td class="text" on:click={() => {onRowClick(Number(row[idFieldName]));} }>
                            {#if customRenderer && customRenderer[column.fieldName]}
                                {#if customRenderer[column.fieldName](row, column).component}
                                    <svelte:component this={customRenderer[column.fieldName](row, column).component} {...customRenderer[column.fieldName](row, column).props} />
                                {:else if customRenderer[column.fieldName](row, column).text}
                                    {customRenderer[column.fieldName](row, column).text}
                                {:else}
                                    {@html customRenderer[column.fieldName](row, column)}
                                {/if}
                            {:else}
                                {#if column.customData}
                                    <span>{row[column.fieldName].customData}</span>
                                {:else}
                                    {#if column.type === 'selector'}
                                        <MultiSelector 
                                            items={ensureArray(row[column.fieldName])} 
                                            maxItems={column.props ? column.props.maxSelectorItems : undefined}
                                            onAddPressed={column.props ? column.props.selectorOnAdd : () => {}}
                                            deleteEndpoint={column.props ? column.props.deleteEndpoint: undefined}
                                            props={{
                                                id: column.props && column.props.selectorIdField 
                                                ? row[column.props.selectorIdField] 
                                                : Number(row[idFieldName])
                                            }}
                                        />
                                    {:else if column.type === 'json'}
                                        <span>{column.jsonToString === undefined ? defaultJsonToString(row[column.fieldName]) : column.jsonToString(row[column.fieldName])}</span>
                                    {:else if column.type === 'sum'}
                                            <span class="mono {column.class ? column.class(row, column) : ""}">{formatSum(row[column.fieldName])}</span>
                                    {:else if column.type === 'decimal'}
                                            <span class="mono {column.class ? column.class(row, column) : ""}">{formatDecimal(row[column.fieldName])}</span>
                                    {:else if column.type === 'number'}
                                            <span class="mono {column.class ? column.class(row, column) : ""}">{row[column.fieldName]}</span>
                                    {:else if column.type === 'link'}
                                        {#if row[column.fieldName] && column.url} 
                                            <a
                                                href={parseUrlWithParams(column.url, column.urlParams, row)}
                                                rel="noopener noreferrer"
                                            >
                                                {row[column.fieldName]}
                                            </a>
                                        {:else}
                                            <span class="second-accent">—</span>
                                        {/if}
                                    {:else}
                                        <span>{row[column.fieldName]}</span>
                                    {/if}
                                {/if}
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        {/if}
    </tbody>
</table>

<style lang="scss">
    @use 'sass:math';
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/text-styles' as textStyles;

    table {
        width: 100%;
        overflow-y: hidden;

        border-collapse: collapse;
        color: vars.$text-color;
        font-family: 'Roboto', sans-serif;

        border: 1px solid vars.$second-accent-color;
        border-radius: vars.$large-radius;
    }

    thead {
        position: sticky; 
        top: 0;
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
        border-radius: vars.$full-radius;
        border: 2px solid vars.$text-color;

        &:checked::before {
            content: '';
            display: block;
            
            $spacing: .65rem;
            width: $size - $spacing;
            height: $size - $spacing;

            border-radius: vars.$full-radius;
            background: vars.$accent-color;
        }
    }

    th {
        padding: .5rem 0;
        background-color: vars.$accent-color;
        color: vars.$text-color;
    }

    tr:nth-child(even) {
        background-color: vars.$bg-color;
    }

    .clickable:hover {
        background-color: vars.$highlight-color;
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

    .second-accent {
        color: vars.$second-accent-color;
    }

    .mono {
        @include textStyles.mono-font;
    }

    .green {
        color: vars.$green;
    }
    
    .red {
        color: vars.$red;
    }

    .empty {
        margin: 2rem 0;
        font-size: vars.$large;
        color: vars.$text2-color;
        text-align: center;

    }
</style>
