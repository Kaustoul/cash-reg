<script lang="ts">
    import type { PageData } from './$types';
    import { formatDate } from '$lib/shared/utils/date-utils';
    import EditableSpan from '$lib/componenets/interactables/EditableSpan.svelte';
    import { viewTitleStore } from '$lib/shared/stores/workerStore';
    import EditableFormButtons from '$lib/componenets/interactables/EditableFormButtons.svelte';

    export let data: PageData;
    
    viewTitleStore.set({ title: "Informace", subtitle: `Zaměstnanec ${data.worker.userId}`, showBackArrow: true });
    
    let formData = {
        name: data.worker.name,
        surname: data.worker.surname,
    };

    let editMode = false;
    let isSubmitting = false;

    $: worker = data.worker;
    
    function cancelEdit() {
        editMode = false;
        // Reset form data to original values
        formData = {
            name: worker.name,
            surname: worker.surname,
        };
    }

    async function saveChanges() {
        isSubmitting = true;
        try {
            const formDataToSend = new FormData();
            if (formData.name.trim() === '' || formData.surname.trim() === '') {
                alert('Jméno a příjmení nesmí být prázdné.');
                isSubmitting = false;
                return;
            }

            if (formData.name === worker.name && formData.surname === worker.surname) {
                isSubmitting = false;
                return;
            }

            if (formData.name !== worker.name)
                formDataToSend.append('name', formData.name);
            
            if (formData.surname !== worker.surname)
                formDataToSend.append('surname', formData.surname);

            const response = await fetch('?/updateWorker', {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                editMode = false;
                // window.location.reload();
            } else {
                alert('Nepodařilo se uložit změny.');
            }
        } catch (error) {
            alert('Nepodařilo se uložit změny.');
        } finally {
            isSubmitting = false;
        }
    }

    async function resetPassword() {
        try {
            const response = await fetch('?/resetPassword', {
                method: 'POST',
                body: new FormData() // Empty form data for this action
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Nepodařilo se resetovat heslo.');
            }
        } catch (error) {
            alert('Nepodařilo se resetovat heslo.');
        }
    }
</script>

<div class="worker-detail">
    <div class="form-area">
        <div class="page-title"></div>
        <form class="form">
            <div class="field">
                <span class="label">Jméno:</span>
                <EditableSpan bind:value={formData.name} bind:editMode />
            </div>
            <div class="field">
                <span class="label">Příjmení:</span>
                <EditableSpan bind:value={formData.surname} bind:editMode />
            </div>
        </form>
        <div class="under-form">
            <div class="field">
                <span class="label">Heslo</span>
                <button
                    class="pwd-btn {worker.mustChangePassword ? 'disabled' : ''}"
                    type="button"
                    on:click={resetPassword}
                >
                    {worker.mustChangePassword ? "Heslo bylo resetováno" : "Resetovat heslo" }
                </button>
            </div>
            <div class="field"></div>
        </div>
    </div>
    <div class="info-area">
        <EditableFormButtons 
            bind:editMode 
            bind:isSubmitting
            onConfirm={saveChanges}
            onCancel={cancelEdit}
        />
        <div class="info">
            <div class="field">
                <span class="label">Vytvořen:</span>
                <span class="value">{formatDate(worker.createdAt)}</span>
            </div>
            <div class="field">
                <span class="label">Poslední přihlášení:</span>
                <span class="value">{worker.lastLogin ? formatDate(worker.lastLogin) : "-"}</span>
            </div>
            <div class="field">
                <span class="label">Poslední IP:</span>
                <span class="value">{worker.lastIp ? worker.lastIp : "-"}</span>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/vars' as vars;
    @use '$lib/styles/buttons' as buttons;
    @use '$lib/styles/inputs' as inputs;
    
    .worker-detail {
        display: flex;
        width: 100%;
    }

    .form-area {
        display: flex;
        flex-direction: column;
        flex: 1 0 50%;
    }

    .page-title {
        font-size: vars.$xx-large;
        color: vars.$text-color;
        margin: 2rem;
    }

    .form, .under-form {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: start;
        gap: 3rem 0;
    }

    .under-form {
        margin-top: 3rem;
    }

    .field {
        display: flex;
        flex-direction: column;
        font-size: vars.$large;
        gap: .5rem;
        flex: 0 1 45%;

        .label {
            font-weight: bold;
            color: vars.$text2-color;
            padding: 0 1rem;
        }

        .value {
            padding: 0 2rem;
            color: vars.$text-color;
        }
    }

    .info-area {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;

        .info {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem;
            background-color: vars.$primary-color;
            border-radius: vars.$medium-radius;
        }

        .field {
            .label {
                font-weight: normal;
                color: vars.$text2-color;
                padding: 0 1rem;
                font-size: vars.$larger;
            }

            .value {
                padding: 0 1rem;
                color: vars.$text-color;
                font-size: vars.$larger;
            }
        }
    }

    .pwd-btn {
        @include buttons.btn($btn-color: vars.$red, $btn-height: 4.5rem);
        font-size: vars.$large;
        margin: 0 1rem;
    }
</style>