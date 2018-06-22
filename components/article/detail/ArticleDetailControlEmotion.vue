<template>
  <div class="mt-5">
    <section>
      <!-- 좋아요 -->
      <div class="d-inline mr-2">
        <a @click.prevent="onDoEmotion('LIKE')" class="btn btn-sm m-0 p-0" :class="{disabled:pending}">
          <icon name="heart" :color="emotionStatus.myEmotionType==='LIKE'?'red':'#bbb'" scale="1.5" class="p-0"/>
        </a>
        <span class="icon-counter">{{emotionStatus.likeCount}}</span>
      </div>

      <!-- 재밌어요 -->
      <div class="d-inline mr-2">
        <a @click.prevent="onDoEmotion('FUN')" class="btn btn-sm m-0 p-0" :class="{disabled:pending}">
          <icon name="poo" :color="emotionStatus.myEmotionType==='FUN'?'blue':'#bbb'" scale="1.5" class="p-0"/>
        </a>
        <span class="icon-counter">{{emotionStatus.funCount}}</span>
      </div>

      <!-- 고마워요 -->
      <div class="d-inline mr-2">
        <a @click.prevent="onDoEmotion('THANKS')" class="btn btn-sm m-0 p-0" :class="{disabled:pending}">
          <icon name="smile" :color="emotionStatus.myEmotionType==='THANKS'?'orange':'#bbb'" scale="1.5" class="p-0"/>
        </a>
        <span class="icon-counter">{{emotionStatus.thanksCount}}</span>
      </div>

      <!-- 슬퍼요 -->
      <div class="d-inline mr-2">
        <a @click.prevent="onDoEmotion('SAD')" class="btn btn-sm m-0 p-0" :class="{disabled:pending}">
          <icon name="meh" :color="emotionStatus.myEmotionType==='SAD'?'orange':'#bbb'" scale="1.5" class="p-0"/>
        </a>
        <span class="icon-counter">{{emotionStatus.sadCount}}</span>
      </div>

      <!-- 화나요 -->
      <div class="d-inline mr-2">
        <a @click.prevent="onDoEmotion('ANGRY')" class="btn btn-sm m-0 p-0" :class="{disabled:pending}">
          <icon name="frown" :color="emotionStatus.myEmotionType==='ANGRY'?'red':'#bbb'" scale="1.5" class="p-0"/>
        </a>
        <span class="icon-counter">{{emotionStatus.angryCount}}</span>
      </div>

      <!--로더-->
      <icon v-if="pending" name="spinner" pulse class="text-muted"/>

      <!-- 스크랩 -->
      <div class="d-inline float-right">
        <a @click.prevent="onToggleScrap()" class="btn btn-sm m-0 p-0">
          <icon name="bookmark" :color="article.scrappedByMe?'green':'#bbb'" scale="1.5" class="p-0"/>
        </a>
        <span class="icon-counter">{{article.scrapCount}}</span>
      </div>
    </section>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
  import sound from "~/utils/soundUtil";

  export default {
    data() {
      return {
        emotionStatus: {},
        pending: false,
      };
    },
    computed: {
      ...mapGetters({
        article: "articleModule/article"
      })
    },
    methods: {
      ...mapMutations({
        toggleScrap: "articleModule/toggleScrap",
        setArticleScrapCount: "articleModule/setArticleScrapCount"
      }),
      async loadEmotionStatus() {
        try {
          this.emotionStatus = await this.$axios.$get(`/articles/${this.article.id}/emotions?memberId=${this.authenticatedId}`);
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        }
      },
      async onDoEmotion(emotion) {
        try {
          this.pending = true;
          this.checkAuthenticated();
          this.emotionStatus = await this.$axios.$put(`/articles/${this.article.id}/emotions/${emotion}`);
          sound.play(this.emotionStatus.myEmotionType);
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        } finally {
          this.pending = false;
        }
      },
      async onToggleScrap() {
        try {
          this.checkAuthenticated();
          let count = await this.$axios.$put(`/articles/${this.article.id}/scraps/toggle`);
          this.setArticleScrapCount(count);
          this.toggleScrap();
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        }
      }
    },
    created() {
      this.loadEmotionStatus();
    }
  };
</script>
