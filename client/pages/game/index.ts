import { Router } from "@vaadin/router";
import { state } from "../../state";

class Game extends HTMLElement {
    shadow: ShadowRoot;

    constructor(){
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.render();
    }

    render(){

        const currentState = state.getState();
        var timer: number = 4;
        const div = document.createElement("div");
    

        div.innerHTML = `
        <div class="container">
            <p class="timer"></p>
            <div class="container-hands">
                <hands-comp class="hand" hand="rock"></hands-comp>
                <hands-comp class="hand" hand="paper"></hands-comp>
                <hands-comp class="hand" hand="scissor"></hands-comp>
            </div>
        </div>
        `;

        const style = document.createElement("style");

        style.innerHTML=`
        .container{
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;

        .container-hands{
            display: flex;
            top: 86px;
            position: relative;
            margin: -15px 60px
        }
                @media (min-width: 769px) {
                .container-hands{        
                top: 157px;
                margin: 0px 600px
                }}
                
        .hand{
            margin: 0px 20px;
        }
                @media (min-width: 769px) {
                .hand{        
                margin: 0px 100px;
                }};
        `;

       this.appendChild(style);
    };
  }
  
  customElements.define("game-comp", Game);