<template>
  <div>
    <!-- 헤더부 -->
    <section class="d-flex justify-content-between mb-2">
      <h4>
        <icon :name="article.boardId|toBoardIcon" scale="1.4" color="#999"/>
        <span class="c-text-shadow"> {{article.boardId|toBoardName}}</span>
      </h4>
      <button v-if="isShowWriteButton()" @click="onWrite()" class="btn btn-success btn-sm">
        <icon name="pencil-alt" scale=".8"/> 새 글 쓰기
      </button>
    </section>

    <!-- 메시지 -->
    <section v-if="article.choosed" class="alert alert-success">
      <icon name="info-circle" scale=".9" /> 관리자에 의해 선택된 글입니다.
    </section>
    <section v-if="article.blocked" class="alert alert-danger">
      <icon name="info-circle" scale=".9" /> 관리자에 의해 블락된 글입니다.
    </section>
    <section v-if="article.deletedForce" class="alert alert-danger">
      <icon name="info-circle" scale=".9" /> 관리자에 의해 삭제된 글입니다.
    </section>

    <!-- 본문 박스 -->
    <section class="border p-3" :class="articleClass">
      <ListLoader v-if="pendingArticle"/>
      <div v-else>
        <ArticleDetailHeader/>
        <ArticleDetailContent/>
        <ArticleDetailControl/>
      </div>
    </section>

    <!--답글 영역-->
    <section class="border mt-3" :class="{'py-2':pendingReplies}">
      <ListLoader v-if="pendingReplies"/>
      <div v-else>
        <!--답글 헤더-->
        <header class="p-2 bg-light">
          <span><icon name="comment" color="#aaa"/> 답글 {{article.replyCount}}</span>
          <icon v-if="pendingReplies" name="spinner" scale="1.6" color="gray" pulse class="float-right"/>
        </header>

        <!--답글-->
        <Reply @replyDeleteCompleted="loadReplies()" @pinToggled="loadReplies()" v-for="reply in replies"
               :key="reply.id" :reply="reply"/>

        <!--답글 쓰기-->
        <ReplyWrite @replyWroteCompleted="onReplyWroteCompleted()"/>
      </div>
    </section>
  </div>
</template>

<script>
  import ArticleDetailHeader from "@/components/article/detail/ArticleDetailHeader";
  import ArticleDetailContent from "@/components/article/detail/ArticleDetailContent";
  import ArticleDetailControl from "@/components/article/detail/ArticleDetailControl";
  import Reply from "@/components/reply/Reply";
  import ReplyWrite from "@/components/reply/ReplyWrite";
  import {mapGetters, mapMutations} from "vuex";

  export default {
  data() {
    return {
      pendingArticle: true,
      pendingReplies: true
    };
  },
  computed: {
    articleId() {
      return this.$route.params.id;
    },
    requesterId() {
      return this.authenticatedId || "$anynomous";
    },
    ...mapGetters({
      article: "articleModule/article",
      replies: "articleModule/replies"
    }),
    articleClass() {
      return {
        "c-blocked-bg": this.article.blocked || this.article.deletedForce,
        "c-choosed-bg": this.article.choosed
      };
    }
  },
  components: {
    ArticleDetailHeader,
    ArticleDetailContent,
    ArticleDetailControl,
    Reply,
    ReplyWrite
  },
  methods: {
    ...mapMutations({
      setArticle: "articleModule/setArticle",
      setReplies: "articleModule/setReplies",
      setArticleReplyCount: "articleModule/setArticleReplyCount"
    }),
    async loadArticle() {
      try {
        let article = await this.$axios.$get(`/articles/${this.articleId}`, {
          headers: { "x-requester-id": this.requesterId }
        });
        let { motto } = await this.$axios.$get(`/members/${article.writerId}`);
        this.setArticle({ ...article, writerMotto: motto });
        this.$axios.$post(`/articles/${this.articleId}/hit-count/increase`);
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pendingArticle = false;
      }
    },
    async loadReplies() {
      try {
        let { content, paging } = await this.$axios.$get(`/articles/${this.articleId}/replies`, {
          headers: { "x-requester-id": this.requesterId }
        });
        let replyIds = _.map(content, "id").join();
        if (replyIds.length > 0) {
          let commentCounts = await this.$axios.$get(`/replies/${replyIds}/comments/count`);
          for (let i = 0; i < content.length; i++) content[i].commentCount = commentCounts[i];
        }
        this.setReplies(content);
        this.setArticleReplyCount(paging.totalResults);
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pendingReplies = false;
      }
    },
    onReplyWroteCompleted() {
      this.loadReplies();
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
    },
    onWrite() {
      this.checkAuthenticated();
      this.$router.push(`/boards/${this.article.boardId}/write`);
    },
    isShowWriteButton() {
      return this.article.boardId !== "notice" || this.isAdmin;
    }
  },
  created() {
    this.loadArticle();
    this.loadReplies();
  }
};
</script>
