<template>
  <div class="form-group">
    <!-- 라벨 -->
    <label for="nickName">닉네임 <span class="text-danger">*</span></label>
    
    <!-- 닉네임 -->
    <form @submit.prevent="onCheckNickName()" class="input-group">
      <input v-model="nickName" :disabled="nickNameConfirmed" ref="nickName" class="form-control form-control-sm" id="nickName" required>
      <div v-if="!nickNameConfirmed" class="input-group-prepend">
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
    <p class="form-text text-muted c-small-font">사이트 내에서는 <strong class="text-dark">성함을 공개하지 않으며</strong>, 닉네임을 대신 사용합니다.</p>
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
    nickName: {
      get() {
        return this.$store.getters["signupModule/nickName"];
      },
      set(nickName) {
        this.$store.commit("signupModule/setNickName", nickName);
      }
    },
    nickNameConfirmed: {
      get() {
        return this.$store.getters["signupModule/nickNameConfirmed"];
      },
      set(nickNameConfirmed) {
        this.$store.commit("signupModule/setNickNameConfirmed", nickNameConfirmed);
      }
    }
  },
  methods: {
    async onCheckNickName() {
      try {
        this.pending = true;
        let exists = await this.$axios.$get(`/members/exists?nickName=${this.nickName}`);
        if (exists) {
          this.$toast.error(`'${this.nickName}': 이미 사용 중인 별명입니다. 다른 별명을 이용해주세요.`);
          this.focus();
        } else {
          this.nickNameConfirmed = true;
        }
      } catch (e) {
        this.$toast.error(e.response ? e.response.data.message : e);
      } finally {
        this.pending = false;
      }
    },
    onUnlock() {
      this.nickNameConfirmed = false;
      this.focus();
    },
    focus() {
      this.$refs.nickName.focus();
    }
  }
};
</script>