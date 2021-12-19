<template>
  <div id="app">
    <navBar>
        <navBarItem name="mainpage">
            <div slot="item-text">工作区</div>
        </navBarItem>
        <navBarItem name="astPage">
            <div slot="item-text">语法树</div>
        </navBarItem>
        <!-- <navBarItem>
            <div slot="item-text"></div>
        </navBarItem>
        <navBarItem></navBarItem>
        <navBarItem></navBarItem>
        <navBarItem></navBarItem>
        <navBarItem></navBarItem> -->
    </navBar>
    <router-view></router-view>
  </div>
</template>

<script>
import navBar from "@/components/navBar/navBar";
import navBarItem from "@/components/navBar/navBarItem";

export default {
  name: 'app',
  components: {
    navBar,
    navBarItem
  }
}
</script>

<style>
@import "assets/css/base.css";

#app {
    height: 100vh;
    width: 100%;
    font-family: normal;
}
</style>
