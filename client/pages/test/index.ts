import { Router } from "@vaadin/router";
import { state } from "../../state";

class Test extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open'});
      }

      connectedCallback() {
        this.render(); 
        const currentState = state.getState();
        
        state.listenRoom()

        state.subscribe(()=>{
            if(currentState.online.prueba == false ) {
                console.log("player not online") 
            } else if 
               (currentState.online.prueba == true ) {
                    console.log("player online")
                }
        })
        
        //state.setState(currentState)


      }

      render(){
        const div = document.createElement("div");
        
        div.innerHTML=`
        <div class="container">
                <p class="probando">Probando que el player esté online</p>
        
        </div>
        `;

        this.shadow.appendChild(div);
      }
   
    };
  
  
  customElements.define("test-comp", Test);