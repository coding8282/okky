import cookie from "vue-cookie";

export default function(context) {
    if (!cookie.get("context")) {
        return context.redirect("/");
    }
}