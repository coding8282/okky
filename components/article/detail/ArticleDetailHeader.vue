<template>
  <div class="border-bottom">
    <!-- 쁘사 영역 -->
    <div class="d-flex mb-2">
      <img :src="getProfileImage(article.writerId)" width="80" height="80" alt="thumbnail" class="rounded-circle mr-2 c-img-shadow">
      <div>
        <nuxt-link :to="`/member/${article.writerId}/profile`" tag="h2" class="c-cute-font c-text-shadow mb-0">{{article.writerName}}</nuxt-link>
        <small class="text-muted c-tiny-font">
          <timeago :since="article.wroteOn"/> ({{article.wroteOn|full-time}})
        </small>
      </div>

      <!-- 카운터 -->
      <div class="ml-auto text-muted">
        <small class="mr-2"><icon name="eye"></icon> {{article.hitCount}}</small>
        <small><icon name="comment" scale=".85"></icon> {{article.replyCount}}</small>
      </div>
    </div>

    <p class="text-justify text-muted c-normal-font c-cute-font mb-2">{{article.writerMotto}}</p>
  </div>
</template>

<script>
export default {
  computed: {
    article() {
      return this.$store.getters["articleModule/article"];
    }
  }
};
</script>