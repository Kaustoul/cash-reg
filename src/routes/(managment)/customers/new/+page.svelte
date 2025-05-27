<script lang="ts">
    import CustomerForm from '$lib/componenets/CustomerForm.svelte';
    import { goto } from '$app/navigation';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';

    let error: string | null = null;
    let isSubmitting = false;

    viewTitleStore.set({ title: "Nový zákazník", showBackArrow: true });

    async function handleSubmit(event: any) {
        //handeled inside component
        isSubmitting = true;
        error = null;
        const { name, surname, email, discount, balance } = event.detail;

        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, surname, email, discount, balance })
            });
            if (res.ok) {
                const result = await res.json();
                goto(`/customers/${result.id}/detail`, {replaceState: true});
            } else {
                error = "Nepodařilo se vytvořit zákazníka.";
            }
        } catch (e) {
            error = "Chyba při komunikaci se serverem.";
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="new-customer-page">
    {#if error}
        <div class="error">{error}</div>
    {/if}
    <CustomerForm submitLabel="Vytvořit zákazníka" onSubmit={(customerId) => goto(`/customers/${customerId}/detail`, {replaceState: true})} />
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;

    .new-customer-page {
        display: flex;
        justify-content: center;
        font-size: vars.$large;
        width: 40%;
        margin: 0 auto;
    }
</style>