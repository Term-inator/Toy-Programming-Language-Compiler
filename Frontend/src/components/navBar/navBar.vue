<template>
  <div class="navbar">
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  name: "navBar"
}
</script>

<style scoped>
.navbar {
  display: flex;
  position: fixed;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .5);
  background: white;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
</style>