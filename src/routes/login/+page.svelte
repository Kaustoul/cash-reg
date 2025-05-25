<script lang="ts">
    import { goto } from '$app/navigation';
    let userId = '';
    let password = '';
    let error: string | null = null;
    let loading = false;

    async function handleLogin(e: Event) {
        e.preventDefault();
        loading = true;
        error = null;
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password })
        });
        loading = false;
        if (res.ok) {
            goto('/catalog'); // Redirect to home or dashboard
        } else {
            const data = await res.json();
            error = data.error || 'Přihlášení selhalo';
        }
    }
</script>

<div class="login-container">

    <form on:submit|preventDefault={handleLogin} class="login-form">
        <h2>Přihlásit se</h2>
        <label>
            ID uživatele
            <input type="number" class="input id" bind:value={userId} required autocomplete="username" />
        </label>
        <label>
            Heslo
            <input type="password" class="input pwd" bind:value={password} required autocomplete="current-password" />
        </label>
        {#if error}
            <div class="error">{error}</div>
        {/if}
        <button type="submit" disabled={loading}>
            {loading ? 'Přihlašuji...' : 'Přihlásit se'}
        </button>
</form>
</div>
    
<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;

    .login-container {
        display: grid;
        place-content: center;
        height: 100vh;
    }

    .login-form {
        margin: 5rem auto;
        padding: 2rem;
        border-radius: vars.$large-radius;
        background: vars.$content-bg-color;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

    h2 {
        text-align: center;
        font-size: vars.$x-large;
        color: vars.$text-color;
        margin: .5rem;
    }

    .login-form label {
        display: flex;
        flex-direction: column;

        font-size: vars.$larger;
    }

    .login-form .error {
        color: vars.$red;
        font-size: vars.$larger;
        text-align: center;
    }

    .id {
        @include inputs.number;
    }

    .pwd {
        @include inputs.text;
    }

    .input {
        padding: 1rem 2.5rem;
        margin: 1rem 0;
    }

    .login-form button {
        @include buttons.btn($btn-color: vars.$accent-color, $btn-height: 3.5rem);
        margin-top: 1.5rem;;
    }

</style>