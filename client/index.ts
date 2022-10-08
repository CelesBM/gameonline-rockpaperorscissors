import "./components/button-new";
import "./components/button-room";
import "./components/hands";
import "./pages/home";
import "./pages/new-game";
import "./pages/previous-game";
import "./pages/sharecode-room";
import "./pages/instructions";
import "./router";
import { Router } from "@vaadin/router";

function main(){
    Router.go("/home");
};

main();