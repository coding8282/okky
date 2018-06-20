<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light" :class="{'bg-admin':isAdmin}">
    <!-- 토글러 -->
    <button class="navbar-toggler" data-toggle="collapse" data-target="#navbarToggler2">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- 브랜드 -->
    <nuxt-link to="/" class="navbar-brand ml-5">
      <b class="c-text-shadow">OKKY</b>
    </nuxt-link>

    <NavHeaderContext/>
    <NavHeaderMenu/>
  </nav>
</template>

<script>
import NavHeaderContext from "./NavHeaderContext";
import NavHeaderMenu from "./NavHeaderMenu";

export default {
  computed: {
    isAdmin() {
      return this.$store.getters["contextModule/isAdmin"];
    }
  },
  components: {
    NavHeaderContext,
    NavHeaderMenu
  }
};
</script>

<style scoped>
.bg-admin {
  background-color: #ccd9ff !important;
}
</style>