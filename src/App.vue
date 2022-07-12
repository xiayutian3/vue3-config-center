<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <router-view class="warp-content" />
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
html,
body {
  height: 100%;
  // min-height: 100%;
  // min-height: 100%;
}
.warp-content {
  height: 100%;
}
#app {
  height: 100%;
  // min-height: 100%;
}
</style>
