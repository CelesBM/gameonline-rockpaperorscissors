import { Router } from "@vaadin/router";
import { state } from "../../state";

class Instructions extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
      super();
      this.render()
    }
  
    render(){
        const shadow = this.attachShadow({mode: 'open'});
        
        shadow.innerHTML=`
    <div class="container">
        <header-comp class="header"></header-comp>
        <div class="container__text">
            <p class="instructions">Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos</p>
            <button class="button">¡Jugar!</button>
        <div class="container-hands">
            <hands-comp class="hand" hand="rock"></hands-comp>
            <hands-comp class="hand" hand="paper"></hands-comp>
            <hands-comp class="hand" hand="scissor"></hands-comp>
        </div>
    </div>
    `;

        const style = document.createElement("style")
        style.innerHTML=`
        `;

    shadow.appendChild(style)
    };
  }
  
  customElements.define("instructions-comp", Instructions);