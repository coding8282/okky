import Vuex from "vuex";
import articleModule from "./modules/articleModule";
import signupModule from "./modules/signupModule";
import contextModule from "./modules/contextModule";

const store = () =>
    new Vuex.Store({
        modules: {
            articleModule,
            signupModule,
            contextModule
        }
    });

export default store;