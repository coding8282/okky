<template>
  <div>
    <!--타이틀-->
    <h3 class="c-text-shadow mb-4">
      <icon name="bars" color="gray" scale="1.4"/>
      옼희 Change Log
    </h3>

    <!--로그 목록-->
    <ListLoader v-if="pending"/>
    <template v-else>
      <div v-for="log in logs" :key="log.id" class="d-flex border-bottom py-3 text-muted">
        <div class="mr-4">
          <small>{{log.logedOn|date}}</small>
        </div>
        <div>
          <icon :name="icon(log.type)" class="mr-1 text-primary"/>
          <i class="text-dark text-justify">{{log.body}}</i>
          <a @click="onDelete(log.id)" class="btn btn-outline-danger py-0 px-1 mx-1 border-0">X</a>
        </div>
      </div>
    </template>

    <!-- 작성부 -->
    <form v-if="isAdmin" @submit.prevent="onSubmit()" class="input-group mt-5">
      <!--이력 유형-->
      <div class="input-group-prepend mr-2">
        <select v-model="request.type" class="custom-select" required>
          <option selected>FEATURE</option>
          <option>FIX</option>
          <option>IMPROVMENT</option>
          <option>REGRESSION</option>
          <option>OTHERS</option>
        </select>
      </div>

      <!--글-->
      <textarea v-model="request.body" rows="3" class="form-control form-control-sm" required maxlength="200" placeholder="이력 내용을 입력하세요(200자)"></textarea>

      <!--버튼-->
      <div class="input-group-append">
        <button class="btn btn-outline-success btn-sm">
          <icon v-if="pending" name="spinner" scale=".75" color="gray" pulse class="mr-1 text-success"/>
          <span>작성</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        request: {},
        logs: [],
        pending: false
      };
    },
    methods: {
      icon(type) {
        const map = [];
        map["FEATURE"] = "plus";
        map["FIX"] = "wrench";
        map["IMPROVMENT"] = "battery-full";
        map["REGRESSION"] = "exclamation";
        map["OTHERS"] = "info-circle";
        return map[type];
      },
      clearRequest() {
        this.request = {};
      },
      async load() {
        try {
          this.pending = true;
          let {content} = await this.$axios.$get("/changelogs");
          this.logs = content;
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        } finally {
          this.pending = false;
        }
      },
      async onSubmit() {
        try {
          await this.$axios.$post(`/changelogs`, this.request);
          this.clearRequest();
          this.load();
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        }
      },
      async onDelete(logId) {
        try {
          await this.$axios.$delete(`/changelogs/${logId}`);
          this.load();
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        }
      },
    },
    created() {
      this.load();
    }
  }
</script>
