<template>
  <div class="mt-3">
    <!-- 타이틀 -->
    <h5 class="mb-4">
      <icon name="newspaper" color="gray" scale="1.2"/> 
      내가 쓴 게시글: {{paging.totalResults}} 개
    </h5>

    <!-- 목록 -->
    <ListLoader v-if="pending"/>
    <template v-if="articles.length">
      <div v-for="article in articles" :key="article.id">
        <ArticleItem :article="article"/>
      </div>
    </template>
    <ArticleEmpty v-else/>

    <!-- 페이징 -->
    <Paginate v-if="paging.pageResults>0"
        class="mt-3"
        :page-count="paging.finalPageNo"
        :page-range="6"
        :margin-pages="2"
        :click-handler="onFetch"
        :prev-text="'<'"
        :prev-class="'page-link px-2 py-1'"
        :next-text="'>'"
        :next-class="'page-link px-2 py-1'"
        :container-class="'pagination btn-sm'"
        :page-class="'page-item'"
        :page-link-class="'page-link px-2 py-1'"
      >
    </Paginate>  
  </div>
</template>

<script>
import ArticleItem from "~/components/article/list/ArticleItem";

export default {
  components: {
    ArticleItem
  },
  data() {
    return {
      articles: [],
      paging: {
        totalResults: 0,
        finalPageNo: 1
      },
      pageNo: 1,
      pageSize: 10,
      pending: true
    };
  },
  methods: {
    onFetch(pageNo) {
      this.pageNo = pageNo;
      this.load();
    },
    async load() {
      try {
        let url = `/members/me/articles?pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
        let { content, paging } = await this.$axios.$get(url);
        this.articles = content;
        this.paging = paging;
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    }
  },
  created() {
    this.load();
  }
};
</script>