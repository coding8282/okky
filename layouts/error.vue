<template>
  <div class="p-4">
    <h2 v-if="error.statusCode === 404">404 ㅜ_ㅜ</h2>
    <h2 v-else>오류 ㅜ_ㅜ</h2>
    <hr>

    <nuxt-link to="/" class="text-muted">
      <icon name="external-link-alt"/> 홈으로 가기
    </nuxt-link>

    <div class="text-center mt-5">
      <icon name="frown" scale="18.0" color="#ea5454"/>
    </div>

    {{error.message}}
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "empty"
};
</script>