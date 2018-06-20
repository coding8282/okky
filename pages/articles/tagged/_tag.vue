<template>
  <div>
    <!-- 태그 타이틀 -->
    <h4>태그 - <span class="badge badge-info">{{tag}}</span></h4>

    <!-- 검색 -->
    <form @submit.prevent="onSubmit(1)" class="form-inline my-2 my-lg-0 mb-4">
      <div class="input-group">
        <input v-model="keyword" class="form-control form-control-sm" ref="search" type="search" :placeholder="`태그 '${tag}' 내에서 재검색`">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary btn-sm" type="submit">
            <icon name="search"/>
          </button>
        </div>
      </div>
    </form>

    <!-- 게시글 목록 -->
    <ListLoader v-if="pending"/>
    <div v-else v-for="article in articles" :key="article.id">
      <ArticleTagItem :article="article"/>
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
import ArticleTagItem from "@/components/article/list/ArticleTagItem";

export default {
  components: {
    ArticleTagItem
  },
  data() {
    return {
      articles: [],
      paging: {},
      pageNo: 1,
      pageSize: 10,
      keyword: "",
      pending: false
    };
  },
  computed: {
    tag() {
      return this.$route.params.tag;
    }
  },
  methods: {
    onSubmit(pageNo) {
      this.pageNo = pageNo;
      this.load();
    },
    onFetch(pageNo) {
      this.pageNo = pageNo;
      this.load();
    },
    onClear() {
      this.pageNo = 1;
      this.keyword = "";
      this.load();
    },
    async load() {
      this.pending = true;
      let url = `/articles/tags/${this.tag}?pageNo=${this.pageNo}&pageSize=${this.pageSize}&search=${this.keyword}`;
      let { content, paging } = await this.$axios.$get(url);
      this.articles = content;
      this.paging = paging;
      this.pending = false;
    },
    focus() {
      this.$refs.search.focus();
    }
  },
  created() {
    this.load();
  }
};
</script>
