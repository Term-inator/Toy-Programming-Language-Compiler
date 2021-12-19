<template>
  <div class="nav-bar-item" @click="iClick">
    <slot name="item-icon"></slot>
    <div :class={active:isActive}>
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "navBarItem",
  props: {
    name: String
  },
  computed: {
    isActive() {
      return this.$route.path.indexOf(this.name) !== -1
    }
  },
  methods: {
    iClick() {
        this.$router.push({name: this.name})
    }
  }
}
</script>

<style scoped>
.nav-bar-item {
  width: flex;
  height: 8vh;
  padding: 0 4vw 0 4vw;
  text-align: center;
  font-size: 5vh;
  border-radius: 5px;
  cursor: pointer;
}

.nav-bar-item:hover {
    color: black;
    background-color: rgba(0, 0, 0, .1);
}

.active {
    color: black;
    font-family: siyuan;
}
</style>