<template>
  <div class="container px-4">
    <h3 class="border-bottom pb-1 text-center">회원 가입</h3>

    <form @submit.prevent="onSubmit()" class="my-3">
      <!-- 이메일 -->
      <SignupEmail ref="email"/>

      <!-- 비밀번호 & 비밀번호 확인 -->
      <div class="form-row">
        <!-- 비밀번호 -->
        <div class="col-6">
          <div class="form-group">
            <label for="password">비밀번호 <span class="text-danger">*</span></label>
            <input v-model="request.password" :disabled="pending" type="password" class="form-control form-control-sm" id="password" minlength="6" maxlength="20" required autocomplete="off">
            <p class="form-text text-muted c-small-font">숫자 또는 특수문자 포함 8~20자</p>
          </div>
        </div>
        <!-- 비밀번호 확인 -->
        <div class="col-6">
          <div class="form-group">
            <label for="newPassword">비밀번호 확인 <span class="text-danger">*</span></label>
            <input v-model="password2" :disabled="pending" type="password" class="form-control form-control-sm" id="password2" minlength="6" maxlength="20" required autocomplete="off">
          </div>
        </div>
      </div>

      <!-- 성함 & 닉네임 -->
      <div class="form-row">
        <!-- 성함 -->
        <div class="col-4">
          <div class="form-group">
            <label for="name">성함 <span class="text-danger">*</span></label>
            <input v-model="request.name" :disabled="pending" class="form-control form-control-sm" id="name" required autocomplete="off">
          </div>
        </div>
        <!-- 닉네임 -->
        <div class="col-8">
          <SignupNickName/>
        </div>
      </div>

      <!-- 성별 -->
      <div class="form-group">
        <label for="sex">성별 <span class="text-danger">*</span></label><br/>
        <div class="form-check form-check-inline">
          <input v-model="request.sex" :disabled="pending" class="form-check-input" type="radio" name="inlineRadioOptions" id="male-radio" value="female" required>
          <label class="form-check-label" for="male-radio"><icon name="venus" color="red" scale=".9"/> 여성</label>
        </div>
        <div class="form-check form-check-inline">
          <input v-model="request.sex" :disabled="pending" class="form-check-input" type="radio" name="inlineRadioOptions" id="female-radio" value="male" required>
          <label class="form-check-label" for="female-radio"><icon name="mars" color="blue" scale=".95"/> 남성</label>
        </div>
      </div>      

      <!-- 좌우명 -->
      <div class="form-group">
        <label for="motto">
          좌우명 <span class="text-danger">*</span>
          <button @click.prevent="showMottoPopup()" class="btn btn-outline-primary border-0 btn-sm c-small-font py-0">좌우명 추천</button>
        </label>
        <textarea v-model="request.motto" :disabled="pending" class="form-control form-control-sm" ref="motto" id="motto" placeholder="ex) 즐길 수 없으면 피하라." rows="4" maxlength="100" required></textarea>
        <p class="form-text text-muted c-small-font">자신을 잘 나타내는 문장을 <strong class="text-dark">100자</strong> 이내로 적어주세요. 좌우명은 게시글/답글에 표시됩니다.</p>
      </div>      

      <!-- 자기 소개 -->
      <div class="form-group">
        <label for="desc">자기 소개</label>
        <textarea v-model="request.description" :disabled="pending" class="form-control form-control-sm" rows="3" id="desc" maxlength="200" placeholder="자기를 잘 표현할 수 있는 간단한 소개를 작성해주세요(200자)."></textarea>
      </div>

      <!-- 회원 가입 -->
      <button :disabled="!isConfirmCompleted()||pending"  class="btn btn-outline-success btn-block">
        <icon name="user-plus" scale="1.1" :pulse="pending"/> 회원 가입
      </button>
      <p v-if="!isConfirmCompleted()" class="form-text text-danger c-small-font">이메일과 닉네임을 확인해주세요.</p>
    </form>

    <PopupMotto @mottoSelected="onMottoSelected" ref="popup"/>
  </div>
</template>

<script>
import SignupNickName from "~/components/member/signup/SignupNickName";
import SignupEmail from "~/components/member/signup/SignupEmail";
import PopupMotto from "~/components/popup/PopupMotto";
import { mapGetters } from "vuex";

export default {
  middleware: "notAuthenticated",
  components: {
    SignupNickName,
    SignupEmail,
    PopupMotto
  },
  data() {
    return {
      request: {
        password: "",
        name: "",
        sex: "",
        motto: "",
        description: ""
      },
      password2: "",
      pending: false
    };
  },
  computed: {
    ...mapGetters({
      nickNameConfirmed: "signupModule/nickNameConfirmed",
      emailConfirmed: "signupModule/emailConfirmed",
      email: "signupModule/email",
      nickName: "signupModule/nickName"
    })
  },
  methods: {
    async onSubmit() {
      try {
        this.checkPassword();
        this.pending = true;
        await this.$axios.$post("/members", { ...this.request, email: this.email, nickName: this.nickName });
        this.$toast.success(`감사합니다! 회원 가입을 완료하였습니다.`);
        this.goSigninForce(this.email);
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    },
    onMottoSelected(motto) {
      this.request.motto = motto;
      setTimeout(this.focusMotto, 400);
    },
    checkPassword() {
      if (!this.isMatchPassword()) {
        this.$toast.error("두 비밀번호가 일치하지 않습니다.");
        this.focusPassword();
        throw "두 비밀번호가 일치하지 않습니다.";
      }
    },
    focusPassword() {
      this.$refs.password.focus();
    },
    focusEmail() {
      this.$refs.email.focus();
    },
    focusMotto() {
      this.$refs.motto.focus();
    },
    isConfirmCompleted() {
      return this.nickNameConfirmed && this.emailConfirmed;
    },
    isMatchPassword() {
      return this.request.password === this.password2;
    },
    showMottoPopup() {
      this.$refs.popup.show();
    }
  },
  mounted() {
    this.focusEmail();
    this.$store.commit("signupModule/clear");
  }
};
</script>