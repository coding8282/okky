<template>
  <div>
    <!-- 로그인 된 경우 툴바 -->
    <div v-if="isAuthenticated">
      <nuxt-link to="/member/me/notification" class="btn btn-outline-secondary border-0 m-0 px-1 py-0">
        <icon name="bell" :color="notificationCount?'purple':'gray'" scale="1.05"/>
      </nuxt-link>
      <span v-if="notificationCount" class="mr-1">{{notificationCount}}</span>
      <nuxt-link to="/member/me/info" class="btn btn-outline-secondary border-0 m-0 px-1 py-0" tag="a">
        <icon name="user" color="gray"/>
      </nuxt-link>
      <button class="btn btn-outline-secondary border-0 m-0 px-1 py-0 mr-1" data-toggle="modal" data-target="#signoutModal">
        <icon name="sign-out-alt" color="gray"/>
      </button>
    </div>

    <!-- 로그인 되지 않은 경우 툴바 -->
    <div v-else>
      <nuxt-link to="/member/signin" class="btn btn-outline-secondary border-0 m-0 px-1 py-0 mr-1" tag="a">
        <icon name="sign-in-alt"/>
      </nuxt-link>
      <nuxt-link to="/member/signup" class="btn btn-outline-secondary border-0 m-0 px-1 py-0" tag="a">
        <icon name="user-plus"/>
      </nuxt-link>
    </div>

    <!-- 로그아웃 팝업 -->
    <div class="modal fade" id="signoutModal" tabindex="-1" role="dialog" aria-labelledby="signoutModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">정말로 로그아웃 할까요?</div>
          <div class="modal-footer justify-content-between">
            <button class="btn btn-outline-secondary btn-sm" data-dismiss="modal">닫기</button>
            <button @click="onSignout()" class="btn btn-warning btn-sm float-right" data-dismiss="modal">로그아웃</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notificationCount: 0
    };
  },
  methods: {
    onSignout() {
      this.$store.dispatch("contextModule/processSignout");
      this.$toast.success("안녕히 가세요 ㅜㅜ");
      this.goHome();
    },
    async loadReplyWroteNotificationCount() {
      try {
        this.notificationCount = await this.$axios.$get(`/members/me/notifications/count`);
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      }
    },
    installNotificationCounter() {
      this.loadReplyWroteNotificationCount();
      setInterval(this.loadReplyWroteNotificationCount, 120 * 1000);
    }
  },
  mounted() {
    if (this.isAuthenticated) {
      this.installNotificationCounter();
    }
  }
};
</script>
