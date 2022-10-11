import { Router } from "@vaadin/router";
import { state } from "../../state";

class ShareCode extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.render()
    }
  
    render(){
        const shadow = this.attachShadow({mode: 'open'});
        
        shadow.innerHTML=`
    <div class="container">
      <div class="container__text">
        <p class="sharecode">Compartí el código:</p>
        <b class="code">${state.getState().roomid}</b>
        <p class="rival">con tu contrincante</p>
      </div>
        <div class="container-hands">
        <hands-comp class="hand" hand="rock"></hands-comp>
        <hands-comp class="hand" hand="paper"></hands-comp>
        <hands-comp class="hand" hand="scissor"></hands-comp>
    </div>
    </div>
    `;

        const style = document.createElement("style")
        style.innerHTML=`
        .container{
            display: flex;
            flex-direction: column;
            align-items: center;
            }
        .container__text{
            margin: 92px 0px;
            text-align: center;
        }
        @media (min-width: 769px) {
            .container__text{        
            margin: 50px 0px;
            }}
        .sharecode, .code, .rival{
            font-family: 'Indie Flower', cursive;
            font-size: 40px;
        }
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

    shadow.appendChild(style)
    };
  }
  
  customElements.define("sharecode-comp", ShareCode);
