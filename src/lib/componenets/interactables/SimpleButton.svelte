<script lang="ts">
    export let text: string = "Button";
    export let onClick: () => void;
    // export let bgColor: string 
  </script>
  
<button class="btn" on:click={onClick}>
    {text}
</button>

<style lang="scss">
    @import '../../../styles.scss';

.btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: $primary-color;
    color: #fff;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    transition: background-color 0.3s;
    width: 100%;
    height: 100%;

    &:hover {
    background-color: $highlight-color;
    }
}
</style>