<script lang="ts">
    import '../styles.scss';
    import Sidebar from "$lib/Sidebar.svelte";

    let selectedIdx: number;

    $: {
        const routes = ['/', '/catalog', '/cashier', '/customers'];
    }
</script>

<div class="grid-container">
    <header>
        <img src="/logo.svg" alt="Logo" style="filter: invert(100%)" height="75"/>
    </header>
    <Sidebar />
    <main>
        <slot></slot>
    </main>
</div>

<style lang="scss">
    @import '../styles.scss';

    .grid-container {
        display: grid;
        grid-template-columns: 275px 1fr;
        grid-template-rows: auto;
        height: 100vh;
    }

    header {
        height: 5rem;
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .sidebar {
        padding: 20px;
    }

    main {
        background-color: $content-bg-color;
        padding: 2.5rem;
    }

    .viewName {
        font-size: 5.5rem;
        margin-bottom: 2rem;
    }
</style>