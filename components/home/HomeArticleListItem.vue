<template>
  <div class="c-article-border px-2 py-1">
    <!-- 제목 -->
    <div>
      <span v-if="article.blocked" class="text-muted">
        <icon name="ban" scale=".8" class="mr-1"/>
        <nuxt-link :to="`/articles/${article.id}`" class="text-muted">블락된 게시글입니다.</nuxt-link>
      </span>
      <span v-else-if="article.deletedForce">
        <icon name="times" scale=".9" class="mr-1 text-muted"/>
        <span class="text-muted">관리자에 의해 삭제된 게시글입니다.</span>
      </span>      
      <span v-else class="c-title-font">
        <icon v-if="article.choosed" name="check" scale=".85" class="text-success mr-1"/>
        <nuxt-link :to="`/articles/${article.id}`" :class="choosedItemClass">{{article.title}}</nuxt-link>
        <small v-if="article.replyCount" :class="replyCountClass"> ({{article.replyCount}})</small>
      </span>
    </div>

    <!-- 밑에 -->
    <div class="d-flex w-100 justify-content-between text-muted">
      <nuxt-link :to="`/member/${article.writerId}/profile`" tag="a">
        <small class="text-muted c-tiny-font">
          <img :src="getProfileImage(article.writerId)" width="18" height="18" alt="thumbnail" class="rounded-circle"> 
          <span> {{article.writerName}}</span>
        </small>
      </nuxt-link>
      <small class="pt-2 c-tiny-font"><timeago :since="article.wroteOn" :auto-update="60"/></small>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  }
};
</script>