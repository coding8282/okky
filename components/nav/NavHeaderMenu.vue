<template>
  <div class="collapse navbar-collapse" id="navbarToggler2">
    <!-- 검색 -->
    <form @submit.prevent="onSubmit()" class="form-inline mt-4">
      <div class="input-group">
        <input v-model="keyword" ref="search" type="search" class="form-control form-control-sm" placeholder="검색어를 입력하세요">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary btn-sm"><icon name="search"/></button>
        </div>
      </div>
    </form>

    <!-- 메뉴 -->
    <ul class="navbar-nav mr-auto mt-2">
      <li class="nav-item">
        <nuxt-link to="/boards/notice/articles"  class="nav-link">
          <icon :name="'notice'|toBoardIcon" scale=".9" class="mr-2"/> 공지사항
        </nuxt-link>
      </li>
      <li class="nav-item">
        <nuxt-link to="/boards/life/articles" class="nav-link">
          <icon :name="'life'|toBoardIcon" scale=".9" class="mr-2"/> 사는얘기
        </nuxt-link>
      </li>
      <li class="nav-item">
        <nuxt-link to="/boards/qna/articles" class="nav-link">
          <icon :name="'qna'|toBoardIcon" scale=".9" class="mr-2"/>&nbsp; Q&amp;A
        </nuxt-link>
      </li>
      <li class="nav-item">
        <nuxt-link to="/boards/study/articles" class="nav-link">
          <icon :name="'study'|toBoardIcon" class="mr-2"/> 스터디
        </nuxt-link>
      </li>
      <li class="nav-item">
        <nuxt-link to="/boards/forum/articles" class="nav-link">
          <icon :name="'forum'|toBoardIcon" class="mr-2"/> 포럼
        </nuxt-link>
      </li>
      <li class="nav-item">
        <nuxt-link @click.native="closeToggler()" to="/miscs/about" class="nav-link l-github mb-1 py-0">
          <icon name="info-circle" scale=".75"/> About
        </nuxt-link>
      </li>
      <li class="nav-item">
        <a href="https://github.com/coding8282" class="nav-link l-github py-0" target="_blank">
          <icon name="code-branch" scale=".8"/> Github Issues
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: ""
    };
  },
  methods: {
    onSubmit() {
      this.goSearch();
      this.clearKeyword();
      this.closeToggler();
    },
    clearKeyword() {
      this.keyword = "";
    },
    closeToggler() {
      $(".collapse").collapse("hide");
    },
    goSearch() {
      this.$router.push({
        path: "/articles",
        query: {
          search: this.keyword
        }
      });
    },
    focus() {
      this.$refs.search.focus();
    }
  }
};
</script>

<style scoped>
.nuxt-link-active {
  font-weight: 900;
  text-shadow: 1px 1px #ddd;
}
.l-github {
  border-left: solid 4px #ccc;
  padding-left: 7px;
  font-size: 0.8rem;
  color: #333;
}
</style>
