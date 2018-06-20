import Vue from "vue";
import Paginate from "vuejs-paginate";
import ListLoader from "~/components/loader/ListLoader";
import ArticleEmpty from "~/components/article/list/ArticleEmpty";

Vue.component("Paginate", Paginate);
Vue.component("ListLoader", ListLoader);
Vue.component("ArticleEmpty", ArticleEmpty);