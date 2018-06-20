<template>
  <div class="mt-3">
    <!-- 제목 -->
    <h5 class="mb-4">
      <span>
        <icon name="bookmark" color="gray" scale="1.2"/> 
        전체 스크랩: {{paging.totalResults}} 개
      </span>
      <button @click="onRefresh()" class="btn btn-outline-secondary btn-sm border-0 float-right">
        <icon name="sync-alt" scale="1.3"/>
      </button>
    </h5>

    <!-- 목록 -->
    <ListLoader v-if="pending" />
    <template v-else>
      <template v-if="articles.length">
        <div v-for="article in articles" :key="article.id">
          <ArticleScrapItem :article="article"/>
        </div>
      </template>
      <ArticleEmpty v-else/>
    </template>

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
import ArticleScrapItem from "~/components/article/list/ArticleScrapItem";

export default {
  components: {
    ArticleScrapItem
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
    onRefresh() {
      this.pending = true;
      this.load();
    },
    async load() {
      try {
        let url = `/members/me/articles/scrapped?pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
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