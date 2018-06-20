<template>
  <section>
    <HomeTopBanner/>
    <HomeArticleList/>
  </section>
</template>

<script>
import HomeTopBanner from "@/components/home/HomeTopBanner";
import HomeArticleList from "@/components/home/HomeArticleList";

export default {
  components: {
    HomeTopBanner,
    HomeArticleList
  }
};
</script>
