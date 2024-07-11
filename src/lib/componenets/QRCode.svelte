<script lang="ts">
 import { onMount } from 'svelte';
 import QRCode from 'easyqrcodejs'
    import type { ISettings } from '$lib/shared/interfaces/settings';

    export let sum: string;
    export let sepa: ISettings['sepaSettings'];
    let node: any;

    onMount(() => {
        const sepaString = `SPD*1.0*ACC:${sepa.iban}*AM:${sum}*CC:CZK*RN:${sepa.recipientName}*MSG:${sepa.paymentReason}`;

        const options = {
            text: sepaString,
            width: 300,
            height: 300,
            quietZone: 20,
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
