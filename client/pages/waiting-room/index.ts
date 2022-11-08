import { Router } from "@vaadin/router";
import { createInflateRaw } from "zlib";
import { state } from "../../state";

class WaitingRoom extends HTMLElement {
    shadow: ShadowRoot;

    connectedCallback(){
        this.render(); 
        const currentState = state.getState();

        state.listenRoom()
        state.subscribe(()=> {

            const interval = setInterval(()=> {
            currentState.ready = true;


 // if(currentState.ready() == true ){ 


                
            if(currentState["player-1-ready"] == true && currentState["player-2-ready"] == true){
               clearInterval(interval);
               Router.go("/game");
            }}, 5000);
        })
        
        state.setState(currentState);
    }
   
   
  
    render(){

        const currentState = state.getState();
        const userNewGame = currentState["userName-1"];
        
        this.innerHTML=`
        <div class="container">
            <header-comp class="header"></header-comp>
            <div class="container__text">
                <p class="text">Esperando a que ${userNewGame} presione ¡Jugar! ...</p>
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
        .container{
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        } 
        
        .container__text{
            font-family: 'Indie Flower', cursive;
            font-size: 45px;
            text-align: center;
            margin: 70px 40px 70px 40px;
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

       this.appendChild(style)
    };
  }
  
  customElements.define("waitingroom-comp", WaitingRoom);