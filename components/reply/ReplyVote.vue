<template>
  <div>
    <!--로더-->
    <icon v-if="pending" name="spinner" pulse class="text-muted mr-2" scale=".9"/>

    <!-- 추천 -->
    <a @click="toggleVote('UP')" class="btn btn-sm p-0" :class="{disabled:pending}">
      <icon name="thumbs-up" scale="1.2" :color="reply.upVotedByMe?'#555':'#ddd'"/>
    </a>
    <small class="mr-0 c-vote-count">{{reply.upVoteCount}}</small>

    <!-- 비추천 -->
    <a @click="toggleVote('DOWN')" class="btn btn-sm p-0 ml-2" :class="{disabled:pending}">
      <icon name="thumbs-down" scale="1.2" :color="reply.downVotedByMe?'#555':'#ddd'"/>
    </a>
    <small class="c-vote-count">{{reply.downVoteCount}}</small>
  </div>
</template>

<script>
  import sound from "~/utils/soundUtil";

  export default {
    props: {
      reply: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        pending: false,
      };
    },
    methods: {
      async toggleVote(direction) {
        this.checkAuthenticated();
        try {
          this.pending = true;
          let result = await this.$axios.$put(`/replies/${this.reply.id}/votes/toggle`, {direction});
          Object.assign(this.reply, result);
          if (this.reply.upVotedByMe) {
            sound.play("up");
          } else if (this.reply.downVotedByMe) {
            sound.play("down");
          }
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        } finally {
          this.pending = false;
        }
      }
    }
  };
</script>

<style scoped>
  p {
    font-size: 0.85rem;
    color: #555;
  }
</style>
