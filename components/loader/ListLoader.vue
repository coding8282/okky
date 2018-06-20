<template>
  <icon name="spinner" color="#eee" :scale="scale" pulse class="d-block m-auto"/>
</template>

<script>
export default {
  props: {
    scale: {
      type: Number,
      default: 4
    }
  }
};
</script>
