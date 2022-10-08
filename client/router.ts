import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
    {path: "/", component: "home-comp"},
    {path: "/home", component: "home-comp"},
    {path: "/new-game", component: "newgame-comp"},
    {path: "/previous-game", component: "previousgame-comp"},
    {path: "/sharecode-room", component: "sharecode-comp"},
    {path: "/instructions", component: "instructions-comp"},
]);