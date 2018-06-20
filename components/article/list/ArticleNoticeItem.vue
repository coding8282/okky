<template>
  <div class="c-article-border px-2 py-1 c-notice-bg">
    <section v-if="article">
      <!-- 태그 -->
      <div>
        <nuxt-link v-for="tag in article.tags" :key="tag" :to="`/articles/tagged/${tag}`" class="badge badge-secondary mr-1">
          {{tag}}
        </nuxt-link>
        <small class="c-tiny-font pt-2 text-muted float-right">
          <timeago :since="article.wroteOn" :auto-update="60" />
        </small>
      </div>

      <!-- 제목 -->
      <div>
        <span class="c-title-font">
          <icon v-if="article.choosed" name="check" scale=".85" class="text-success mr-1"/>
          <nuxt-link :to="`/articles/${article.id}`" :class="{'text-success':article.choosed}">
            <b><icon name="bell" scale=".9" color="#999"/> {{article.title}}</b>
            <small v-if="article.replyCount" :class="replyCountClass"> ({{article.replyCount}})</small>
          </nuxt-link>
        </span>
      </div>
    </section>

    <!-- 없는 경우 -->
    <section v-else>
      <span><icon name="bell" scale=".9" color="#999"/> 표시할 공지사항이 없습니다.</span>
    </section>    
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: false
    }
  },
  computed: {
    replyCountClass() {
      const count = this.article.replyCount;
      return {
        "text-muted": count < 5,
        "text-info": 5 <= count && count < 10,
        "text-danger": count >= 10
      };
    }
  }
};
</script>