<template>
  <div class="form-group">
    <!-- 라벨 -->
    <label for="email">이메일 <span class="text-danger">*</span></label>
    
    <!-- 이메일 -->
    <form @submit.prevent="onCheckEmail()" class="input-group">
      <input v-model="email" :disabled="emailConfirmed" ref="email" class="form-control form-control-sm" type="email" id="email" required>
      <div v-if="!emailConfirmed" class="input-group-prepend">
        <button class="btn btn-sm btn-outline-success">
          <icon v-if="pending" name="spinner" scale=".9" pulse/>
          <icon v-else name="question" scale=".9"/> 
          확인
        </button>
      </div>
      <div v-else class="input-group-prepend">
        <button @click="onUnlock()" type="button" class="btn btn-sm btn-outline-danger">
          <icon name="lock-open" scale=".9"/>
        </button>
        <button disabled class="btn btn-sm btn-success">
          <icon name="check" scale=".9"/> 완료
        </button>
      </div>
    </form>        

    <!-- 설명 -->
    <p class="form-text text-muted c-small-font">이메일을 외부에 제공하지 않으니 안심하셔도 좋습니다.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pending: false
    };
  },
  computed: {
    email: {
      get() {
        return this.$store.getters["signupModule/email"];
      },
      set(email) {
        this.$store.commit("signupModule/setEmail", email);
      }
    },
    emailConfirmed: {
      get() {
        return this.$store.getters["signupModule/emailConfirmed"];
      },
      set(emailConfirmed) {
        this.$store.commit("signupModule/setEmailConfirmed", emailConfirmed);
      }
    }
  },
  methods: {
    async onCheckEmail() {
      try {
        this.pending = true;
        let exists = await this.$axios.$get(`/members/exists?email=${this.email}`);
        if (exists) {
          this.$toast.error(`'${this.email}': 이미 사용 중인 이메일입니다. 다른 이메일을 이용해주세요.`);
          this.focus();
        } else {
          this.emailConfirmed = true;
        }
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    },
    onUnlock() {
      this.emailConfirmed = false;
      this.focus();
    },
    focus() {
      this.$refs.email.focus();
    }
  }
};
</script>