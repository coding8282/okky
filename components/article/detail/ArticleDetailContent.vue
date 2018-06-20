<template>
  <div class="my-3">
    <div v-if="!article.blocked&&article.deletedForce" class="d-flex">
      <!-- 아이디 -->
      <span class="mr-1 text-muted c-normal-font pt-1">#{{article.id|shorten}}</span>

      <!-- 태그 -->
      <div class="mb-1">
        <span v-for="(tag,i) in article.tags" :key="i" class="badge badge-info mr-1">
          <nuxt-link :to="`/articles/tagged/${tag}`">
            {{tag}}
          </nuxt-link>
        </span>
      </div>
    </div>

    <!-- 타이틀 -->
    <h5 class="text-justify">
      <span v-if="!article.blocked&&!article.deletedForce">{{article.title}}</span>
    </h5>
    
    <!-- 글내용 -->
    <template v-if="article.blocked">
      <icon name="ban" scale="15" class="d-block m-auto text-danger" />
    </template>
    <template v-if="article.deletedForce">
      <icon name="times" scale="15" class="d-block m-auto text-danger" />
    </template>
    <template v-else>
      <p class="text-justify mt-4">{{article.body}}</p>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    article() {
      return this.$store.getters["articleModule/article"];
    }
  },
  filters: {
    shorten(articleId) {
      if (!articleId) {
        return null;
      }
      return articleId.substring(0, 7) + "..";
    }
  }
};
</script>
