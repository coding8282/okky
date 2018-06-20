import cookie from "vue-cookie";

export default function({ redirect, }) {
    if (cookie.get("context")) {
        return redirect("/");
    }
}