<script>
  import Header from "./Header.svelte";
  import "../node_modules/paper-css/paper.min.css";
</script>

<style>
  @page {
    size: letter;
  }
  div {
    background-color: white;
  }
</style>

<div class="letter">
  <Header />
</div>
