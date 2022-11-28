import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
    {path: "/", component: "home-comp"},
    {path: "/home", component: "home-comp"},
    {path: "/test", component: "test-comp"},
    {path: "/new-game", component: "newgame-comp"},
    {path: "/previous-game", component: "previousgame-comp"},
    {path: "/sharecode-room", component: "sharecode-comp"},
    {path: "/instructions", component: "instructions-comp"},
    {path: "/waiting-room", component: "waitingroom-comp"},
    {path: "/game", component: "game-comp"},
]);