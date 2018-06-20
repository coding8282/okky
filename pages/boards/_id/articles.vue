<template>
  <div>
    <!-- 툴바 -->
    <div class="d-flex justify-content-between mb-2">
      <h4 class="c-text-shadow"><icon :name="boardId|toBoardIcon" scale="1.3" color="#999"/> {{boardId|toBoardName}}</h4>
      <button v-if="showWriteButton" @click="onWrite()" class="btn btn-success btn-sm">
        <icon name="pencil-alt" scale=".8"/> 새 글 쓰기
      </button>
    </div>

    <!-- 검색 -->
    <form @submit.prevent="onSearch()" class="form-inline my-2 my-lg-0 mb-4">
      <div class="input-group">
        <input v-model="keyword" ref="search" type="search" class="form-control form-control-sm" placeholder="검색어를 입력해주세요">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary btn-sm">
            <icon name="search"/>
          </button>
          <button @click="onClear()" class="btn btn-outline-secondary btn-sm" type="button">
            <icon name="eraser"/>
          </button>
        </div>
      </div>
    </form>

    <!-- 게시글 목록 -->
    <ListLoader v-if="pending"/>
    <div v-else>
      <small class="text-muted text-right d-block">전체: {{paging.totalResults}} 개</small>
      <ArticleNoticeItem v-if="boardId!=='notice'" :article="notice" class="mb-2"/>
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
import ArticleItem from "~/components/article/list/ArticleItem";
import ArticleNoticeItem from "~/components/article/list/ArticleNoticeItem";

export default {
  components: {
    ArticleItem,
    ArticleNoticeItem
  },
  data() {
    return {
      notice: {},
      articles: [],
      paging: {},
      pageNo: 1,
      pageSize: 10,
      keyword: "",
      pending: false,
      pendingNotice: false
    };
  },
  computed: {
    boardId() {
      return this.$route.params.id;
    },
    showWriteButton() {
      return !(this.boardId == "notice" && !this.isAdmin);
    }
  },
  methods: {
    onSearch() {
      this.loadArticles();
    },
    onClear() {
      this.pageNo = 1;
      this.keyword = "";
      this.loadArticles();
      this.focus();
    },
    onFetch(pageNo) {
      this.pageNo = pageNo;
      this.loadArticles();
    },
    onWrite() {
      this.checkAuthenticated();
      this.$router.push(`/boards/${this.boardId}/write`);
    },
    async loadArticles() {
      try {
        this.pending = true;
        this.notice = await this.$_loadNotice();
        let { content, paging } = await this.$_loadArticles();
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
    },
    async $_loadArticles() {
      let url = `/boards/${this.boardId}/articles?pageNo=${this.pageNo}&pageSize=${this.pageSize}&search=${this.keyword}`;
      let result = await this.$axios.$get(url);
      if (result.content.length) {
        let articleIds = _.map(result.content, "id").join();
        let replyCounts = await this.$axios.$get(`/articles/${articleIds}/replies/count`);
        for (let i = 0; i < result.content.length; i++) result.content[i].replyCount = replyCounts[i];
      }
      return result;
    },
    async $_loadNotice() {
      let { content } = await this.$axios.$get("/boards/notice/articles?pageSize=1");
      let notice = content[0];
      if (notice) {
        notice.replyCounts = await this.$axios.$get(`/articles/${notice.id}/replies/count`);
      }
      return notice;
    }
  },
  mounted() {
    this.loadArticles();
  }
};
</script>