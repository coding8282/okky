<template>
  <div class="container">
    <h3 class="border-bottom pb-1 text-center">로그인</h3>
    
    <!-- 폼 -->
    <form @submit.prevent="onSubmit()">
      <div class="form-group">
        <input v-model="request.Username" :disabled="pending" ref="Username" type="email" class="form-control" placeholder="이메일" required>
      </div>
      <div class="form-group">
        <input v-model="request.Password" :disabled="pending" ref="Password" type="password" class="form-control" placeholder="비밀번호" required>
      </div>
      <button :disabled="pending" class="btn btn-outline-success btn-block">로그인</button>
    </form>

    <!-- 링크 -->
    <div class="text-right text-muted">
      <nuxt-link :to="`/member/forgot?email=${request.Username}`" tag="small">비밀번호 초기화</nuxt-link> |
      <nuxt-link to="/member/signup" tag="small">회원 가입</nuxt-link>
    </div>

    <!-- 로더 -->
    <icon v-if="pending" name="spinner" scale="3" color="#ccc" pulse class="d-block m-auto mt-3"/>

    <!-- 팝업 -->
    <PopupVerify @verifyCompleted="onVerifyCompleted()" ref="modal" :email="request.Username"/>
  </div>
</template>

<script>
import { AuthenticationDetails } from "amazon-cognito-identity-js";
import PopupVerify from "~/components/popup/PopupVerify.vue";

export default {
  middleware: "notAuthenticated",
  components: {
    PopupVerify
  },
  data() {
    return {
      request: {
        Username: "",
        Password: ""
      },
      pending: false
    };
  },
  mounted() {
    this.initEmail();
    this.focus();
  },
  methods: {
    onSubmit() {
      this.pending = true;
      this.authenticate();
    },
    onVerifyCompleted() {
      this.pending = true;
      this.authenticate();
    },
    authenticate() {
      let that = this;
      let authDetails = new AuthenticationDetails(this.request);
      let cognitoUser = this.createCognitoUser(this.request.Username);
      that.$store.commit("contextModule/setCognitoUser", cognitoUser);
      cognitoUser.authenticateUser(authDetails, {
        onSuccess({ idToken }) {
          that.pending = false;
          that.$axios.setToken(idToken.jwtToken);
          that.store();
        },
        onFailure(err) {
          that.pending = false;
          if (err.code === "UserNotFoundException") {
            that.$toast.error("해당 회원은 존재하지 않습니다.");
          } else if (err.code === "NotAuthorizedException") {
            that.$toast.error("해당 회원은 존재하지 않거나 비밀번호가 맞지 않습니다.");
          } else if (err.code === "UserNotConfirmedException") {
            that.$toast.error("이메일이 인증되지 않았습니다. 인증코드를 입력해주세요.");
            that.showPopup();
          } else {
            that.$toast.error(err.message);
          }
        }
      });
    },
    async store() {
      try {
        let context = await this.$axios.$get("/members/me");
        this.$store.commit("contextModule/setContext", context);
        this.$toast.success(`어서오세요!`);
        this.goHomeForce();
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      }
    },
    focus() {
      if (this.request.Username) {
        this.$refs.Password.focus();
      } else {
        this.$refs.Username.focus();
      }
    },
    initEmail() {
      if (this.$route.query.email) {
        this.request.Username = this.$route.query.email;
      }
    },
    showPopup() {
      this.$refs.modal.show();
    }
  }
};
</script>