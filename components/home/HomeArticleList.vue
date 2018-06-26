<template>
  <div>
    <!-- 공지사항 -->
    <section class="mb-5">
      <h4 class="c-text-shadow">
        <icon :name="'notice'|toBoardIcon" color="#999"/> 공지사항
        <nuxt-link to="/boards/notice/articles" class="float-right">
          <icon name="ellipsis-h" color="gray"/>
        </nuxt-link>
        <nuxt-link v-if="isAdmin" to="/boards/notice/write" class="float-right mr-2">
          <icon name="pencil-alt" color="gray" scale=".85"/>
        </nuxt-link>
      </h4>
      <ListLoader v-if="pendingNotices"/>
      <div v-else>
        <template v-if="notices.length">
          <div v-for="article in notices" :key="article.id">
            <ArticleNoticeItem :article="article"/>
          </div>
        </template>
        <ArticleEmpty v-else/>
      </div>
    </section>

    <!-- 베스트/CHOICE -->
    <section class="mb-5">
      <h4 class="c-text-shadow"><icon name="thumbs-up" color="#999"/> BEST/CHOICE</h4>
      <ListLoader v-if="pendingBests"/>
      <div v-else>
        <template v-if="bests.length">
          <div v-for="article in bests" :key="article.id">
            <HomeArticleListItem :article="article"/>
          </div>
        </template>
        <ArticleEmpty v-else/>

        <template v-if="choices.length">
          <div v-for="article in choices" :key="article.id+'dummy'">
            <HomeArticleListItem :article="article"/>
          </div>
        </template>
        <ArticleEmpty v-else/>
      </div>
    </section>

    <!-- 사는얘기 -->
    <section class="mb-5">
      <h4 class="c-text-shadow">
        <icon :name="'life'|toBoardIcon" color="#999"/> 사는얘기
        <nuxt-link to="/boards/life/articles">
          <icon name="ellipsis-h" color="gray" class="float-right"/>
        </nuxt-link>
        <nuxt-link v-if="isAuthenticated" to="/boards/life/write" class="float-right mr-2">
          <icon name="pencil-alt" color="gray" scale=".85"/>
        </nuxt-link>
      </h4>
      <ListLoader v-if="pendingLifes"/>
      <div v-else>
        <template v-if="lifes.length">
          <div v-for="article in lifes" :key="article.id">
            <HomeArticleListItem :article="article"/>
          </div>
        </template>
        <ArticleEmpty v-else/>
      </div>
    </section>

    <!-- Q&A -->
    <section class="mb-5">
      <h4 class="c-text-shadow">
        <icon :name="'qna'|toBoardIcon" color="#999"/> Q&amp;A
        <nuxt-link to="/boards/qna/articles" class="float-right">
          <icon name="ellipsis-h" color="gray"/>
        </nuxt-link>
        <nuxt-link v-if="isAuthenticated" to="/boards/qna/write" class="float-right mr-2">
          <icon name="pencil-alt" color="gray" scale=".85"/>
        </nuxt-link>
      </h4>
      <ListLoader v-if="pendingQnas"/>
      <div v-else>
        <template v-if="qnas.length">
          <div v-for="article in qnas" :key="article.id">
            <HomeArticleListItem :article="article"/>
          </div>
        </template>
        <ArticleEmpty v-else/>
      </div>
    </section>

    <!-- 배너 -->
    <HomeArchBanner/>

    <!-- 버그/건의사항 -->
    <section class="mb-5">
      <h4 class="c-text-shadow">
        <icon :name="'bug'|toBoardIcon" color="#999"/> 버그/건의사항
        <nuxt-link to="/boards/bug/articles" class="float-right">
          <icon name="ellipsis-h" color="gray"/>
        </nuxt-link>
        <nuxt-link v-if="isAuthenticated" to="/boards/bug/write" class="float-right mr-2">
          <icon name="pencil-alt" color="gray" scale=".85"/>
        </nuxt-link>
      </h4>
      <ListLoader v-if="pendingStudies"/>
      <div v-else>
        <template v-if="bugs.length">
          <div v-for="article in bugs" :key="article.id">
            <HomeArticleListItem :article="article"/>
          </div>
        </template>
        <ArticleEmpty v-else/>
      </div>
    </section>
  </div>
</template>

<script>
  import HomeArticleListItem from "./HomeArticleListItem";
  import ArticleNoticeItem from "~/components/article/list/ArticleNoticeItem";
  import HomeArchBanner from "@/components/home/HomeArchBanner";

  export default {
  components: {
    HomeArticleListItem,
    ArticleNoticeItem,
    HomeArchBanner
  },
  data() {
    return {
      notices: [],
      bests: [],
      choices: [],
      lifes: [],
      qnas: [],
      bugs: [],
      pendingNotices: true,
      pendingBests: true,
      pendingChoices: true,
      pendingLifes: true,
      pendingQnas: true,
      pendingStudies: true
    };
  },
  async created() {
    this.loadFromBoard("notice", 2).then(notices => {
      this.notices = notices;
      this.pendingNotices = false;
    });

    this.loadFromBoard("best", 3).then(bests => {
      this.bests = bests;
      this.pendingBests = false;
    });

    this.loadFromBoard("choice", 2).then(choices => {
      this.choices = choices;
      this.pendingChoices = false;
    });

    this.loadFromBoard("life", 10).then(lifes => {
      this.lifes = lifes;
      this.pendingLifes = false;
    });

    this.loadFromBoard("qna", 10).then(qnas => {
      this.qnas = qnas;
      this.pendingQnas = false;
    });

    this.loadFromBoard("bug", 3).then(bugs => {
      this.bugs = bugs;
      this.pendingStudies = false;
    });
  },
  methods: {
    async loadFromBoard(boardId, pageSize) {
      let { content } = await this.$axios.$get(`/boards/${boardId}/articles?pageSize=${pageSize}`);
      if (content.length) {
        let articleIds = _.map(content, "id").join();
        let replyCounts = await this.$axios.$get(`/articles/${articleIds}/replies/count`);
        for (let i = 0; i < content.length; i++) content[i].replyCount = replyCounts[i];
      }
      return content;
    }
  }
};
</script>
