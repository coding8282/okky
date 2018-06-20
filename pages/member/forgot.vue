<template>
  <div class="container">
    <form @submit.prevent="onSubmit()">
      <!-- 이메일 -->
      <div class="form-group">
        <input v-model="email" :disabled="pending" type="email" ref="email" class="form-control" placeholder="이메일" required>
        <small class="form-text text-muted">비밀번호를 재설정합니다.</small>
      </div>

      <!-- 버튼 -->
      <button :disabled="pending" class="btn btn-outline-success btn-block">비밀번호 재설정</button>
    </form>

    <!-- 링크 -->
    <div class="text-right text-muted">
      <nuxt-link to="/member/signin" tag="small">로그인</nuxt-link> |
      <nuxt-link to="/member/signup" tag="small">회원 가입</nuxt-link>
    </div>

    <!-- 로더 -->
    <icon v-if="pending" name="spinner" scale="3" color="#ccc" pulse class="d-block m-auto mt-3"/>

    <!-- 팝업 -->
    <PopupInitPassword @passwordInitialized="onPasswordInitialized()" ref="modal" :email="email"/>
  </div>
</template>

<script>
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import PopupInitPassword from "~/components/popup/PopupInitPassword";

export default {
  middleware: "notAuthenticated",
  components: {
    PopupInitPassword
  },
  data() {
    return {
      email: "",
      pending: false
    };
  },
  methods: {
    onSubmit() {
      this.pending = true;
      setTimeout(this.onSubmitInternal, 1500);
    },
    onSubmitInternal() {
      this.createCognitoUser(this.email).forgotPassword({
        onSuccess: this.onSuccess,
        onFailure: this.onFailure
      });
    },
    onPasswordInitialized() {
      this.$toast.success("비밀번호 재설정을 완료하였습니다.");
      this.goSigninForce(this.email);
    },
    focus() {
      this.$refs.email.focus();
    },
    showPopup() {
      this.$refs.modal.show();
    },

    // private
    onSuccess(result) {
      this.pending = false;
      this.showPopup();
    },
    onFailure(err) {
      this.pending = false;
      if (err.code === "UserNotFoundException") {
        this.$toast.error("존재하지 않는 회원 이메일입니다.");
      } else if (err.code === "LimitExceededException") {
        this.$toast.error("비밀번호를 너무 많이 수정 요청하였습니다. 잠시 후에 다시 시도해주세요.");
      } else {
        this.$toast.error(err.message);
      }
    }
  },
  mounted() {
    this.focus();
  }
};
</script>