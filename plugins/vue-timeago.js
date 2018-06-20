import Vue from "vue";
import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
    name: 'Timeago',
    locale: 'ko',
    locales: {
        'ko': require('date-fns/locale/ko'),
    }
});