<template>
  <div>
    <!-- 타이틀 -->
    <div class="d-flex justify-content-between mb-2">
      <h4>검색</h4>
    </div>

    <!-- 검색 -->
    <form @submit.prevent="onSubmit()" class="form-inline mb-3">
      <div class="input-group">
        <input v-model="keyword" ref="search" type="search" class="form-control form-control-sm" placeholder="전체 게시글 검색">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary btn-sm"><icon name="search"/></button>
        </div>
        <div class="input-group-append">
          <button @click="onClear()" type="button" class="btn btn-outline-secondary btn-sm"><icon name="eraser"/></button>
        </div>
      </div>
    </form>    

    <!-- 게시글 목록 -->
    <ListLoader v-if="pending"/>
    <div v-else>
      <small class="text-muted text-right d-block">전체: {{paging.totalResults}} 개</small>
      <template v-if="articles.length">
        <div v-for="article in articles" :key="article.id">
          <ArticleItem :article="article"/>
        </div>
      </template>
      <ArticleEmpty v-else/>
    </div>

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
import ArticleItem from "@/components/article/list/ArticleItem";

export default {
  components: {
    ArticleItem
  },
  data() {
    return {
      articles: [],
      paging: {},
      pageNo: 1,
      pageSize: 15,
      keyword: "",
      pending: false
    };
  },
  methods: {
    onSubmit() {
      this.$router.push({
        path: "/articles",
        query: {
          search: this.keyword
        }
      });
    },
    onFetch(pageNo) {
      this.pageNo = pageNo;
      this.load();
      this.focus();
    },
    onClear() {
      this.pageNo = 1;
      this.keyword = "";
      this.$router.push("/articles");
      this.focus();
    },
    async load() {
      try {
        this.pending = true;
        let url = `/articles?pageNo=${this.pageNo}&pageSize=${this.pageSize}&search=${this.keyword || ""}`;
        let { content, paging } = await this.$axios.$get(url);
        this.articles = content;
        this.paging = paging;
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    },
    focus() {
      this.$refs.search.focus();
    }
  },
  watch: {
    "$route.query"(keyword) {
      this.load();
    }
  },
  mounted() {
    this.keyword = this.$route.query.search;
    this.load();
  }
};
</script>