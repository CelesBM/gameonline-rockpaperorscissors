import "./components/button-new";
import "./components/button-room";
import "./components/hands";
import "./components/header"
import "./pages/home";
import "./pages/test";
import "./pages/new-game";
import "./pages/previous-game";
import "./pages/sharecode-room";
import "./pages/instructions";
import "./pages/waiting-room";
import "./pages/game";
import "./pages/waiting-play";
import "./router";
import { Router } from "@vaadin/router";

function main(){
    Router.go("/");
};

main();