<script lang="ts">
 import { onMount } from 'svelte';
 import QRCode from 'easyqrcodejs'

    export let sum: string;

    let node: any;
    const sepaString = `BCD
001
1
SCT
GIBACZPX
Radek Svěrák
CZ9608000000002890023093
${sum}
CZK
test
001`;

    onMount(() => {
        const sepaString = `BCD
001
1
SCT
GIBACZPX
Radek Svěrák
CZ9608000000002890023093
${sum}
CZK
test
001`;

        const options = {
            text: sepaString,
            width: 420,
            height: 420,
            quietZone: 20,
            logo: 'src/logo.svg',
            logoWidth: 160,
            logoHeight: 100,
    };
    new QRCode(node, options);
  });
</script>

<div bind:this={node}></div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;

    div {
        background-color: white;
        padding: .3rem;
        border-radius: vars.$medium-radius;
    }
    
    div :global(canvas) {
  }
</style>
