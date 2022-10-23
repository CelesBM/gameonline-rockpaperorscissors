import { Router } from "@vaadin/router";
import { state } from "../../state";

class WaitingRoom extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.render()
    }
  
    render(){
        const shadow = this.attachShadow({mode: 'open'});

        const currentState = state.getState();
        const userRivalName = currentState["userName-2"];
        
        shadow.innerHTML=`
        <div class="container">
            <header-comp class="header"></header-comp>
            <div class="container__text">
                <p class="text">Esperando a que ${userRivalName} presione ¡Jugar! ...</p>
            </div> 
            <div class="container-hands">
                <hands-comp class="hand" hand="rock"></hands-comp>
                <hands-comp class="hand" hand="paper"></hands-comp>
                <hands-comp class="hand" hand="scissor"></hands-comp>
            </div>
        </div>
        `;

        const style = document.createElement("style");

        style.innerHTML=`
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
  
  customElements.define("waitingroom-comp", WaitingRoom);