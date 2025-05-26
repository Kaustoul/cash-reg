<script lang="ts">
    import type { ITillSession } from '$lib/shared/interfaces/till-session';
    import { formatDate } from '$lib/shared/utils/date-utils';

    export let sessions: {sessionStart: ITillSession, sessionEnd: ITillSession}[];

    function formatDuration(start: Date | string | number, end: Date | string | number | null) {
        if (!end) return "—";
        const ms = new Date(end).getTime() - new Date(start).getTime();
        if (ms < 0) return "—";
        const mins = Math.floor(ms / 60000);
        const hours = Math.floor(mins / 60);
        const remMins = mins % 60;

        if (hours === 0 && remMins === 0) return "0m";
        if (hours === 0) return `${remMins}m`;
        return `${hours}h ${remMins}m`;
    }
</script>

<div class="sessions-log">
    {#each sessions as session}
        <div class="session-card">
            <div class="session-line open">
                <span class="label green">Začátek směny</span>
                <span class="center">Zaměstnanec: {session.sessionStart.cashierId}</span>
                <span class="time">{formatDate(session.sessionStart.createdAt)}</span>
            </div>
            <hr class="divider" />
            <div class="session-line close">
                <div class="box-corner">
                    <span>
                        ┕━━━
                    </span>
                </div>
                {#if session.sessionEnd}
                    <span class="label red">Konec směny</span>
                    <div class="time">
                        <span class="">Doba: {formatDuration(session.sessionStart.createdAt, session.sessionEnd.createdAt)}</span>
                        <span class="">{formatDate(session.sessionEnd.createdAt)}</span>
                    </div>
                {:else}
                    <span class="label accent">Směna probíhá</span>
                    <span class="time">Doba: {formatDuration(session.sessionStart.createdAt, Date.now())}</span>
                {/if}
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/text-styles' as textStyles;

    .sessions-log {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .session-card {
        background-color: vars.$primary-color;
        border-radius: vars.$medium-radius;
        padding: 1.2rem 2rem;
        display: flex;
        flex-direction: column;
        gap: .7rem;
    }

    .session-line {
        display: flex;
        align-items: baseline;
        gap: 2rem;
        font-size: vars.$larger;
        width: 100%;


        .label {
            font-size: vars.$large;
            font-weight: bold;
            flex: 0 0 20%;
        }
    }

    .time {
        display: flex;
        flex-direction: row;
        flex: 0 0 30%;
        gap: 2rem;
        margin-left: auto;
        justify-content: end;
    }

    .divider {
        border: none;
        border-top: 2px solid vars.$second-accent-color;
        margin: 0.1rem 0;
    }

    .green {
        color: vars.$green;
    }

    .red {
        color: vars.$red;
    }

    .accent {
        color: vars.$accent-color;
    }

    .box-corner {
        display: flex;
        flex-direction: column;
        justify-content: baseline;
        align-items: flex-start;
        color: vars.$text2-color;
    }

    .center {
        display: flex;
        flex: 1 0 20%;
        justify-content: center;
    }
</style>