<template>
  <div class="c-article-border px-2 py-1">
    <!-- 태그 -->
    <div>
      <nuxt-link v-for="tag in article.tags" :key="tag" :to="`/articles/tagged/${tag}`" class="badge badge-info mr-1">
        {{tag}}
      </nuxt-link>
    </div>

    <!-- 제목 -->
    <div>
      <button @click.prevent="onToggleScrap()" class="btn btn-sm m-0 p-0 mr-1">
        <icon name="bookmark" :color="article.scrappedByMe?'green':'#bbb'" scale="1.0" class="p-0" />
      </button>
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
      </span>
    </div>

    <!-- 프로필 -->
    <div class="d-flex w-100 justify-content-between">
      <nuxt-link :to="`/member/${article.writerId}/profile`">
        <small class="c-tiny-font text-muted">
          <img :src="getProfileImage(article.writerId)" width="20" height="20"  :alt="article.writerName" class="rounded-circle"> {{article.writerName}}
        </small>
      </nuxt-link>
      <small class="c-tiny-font pt-2 text-muted">
        <timeago :since="article.wroteOn" :auto-update="60" />
      </small>
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
  },
  methods: {
    async onToggleScrap() {
      try {
        await this.$axios.$put(`/articles/${this.article.id}/scraps/toggle`);
        this.article.scrappedByMe = !this.article.scrappedByMe;
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      }
    }
  }
};
</script>
