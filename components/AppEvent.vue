<template>
  <div></div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("contextModule/checkToken");
  }
};
</script>
