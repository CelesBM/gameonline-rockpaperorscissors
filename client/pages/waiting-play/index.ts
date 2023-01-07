import { Router } from "@vaadin/router";
import { createInflateRaw } from "zlib";
import { state } from "../../state";

//UNA VEZ QUE AMBOS ELIJAN UNA JUGADA DEBE IR A LOS RESULTADOS, SI NO, A INSTRUCTIONS.
class WaitingPlay extends HTMLElement {
    shadow: ShadowRoot;
    timer: number = 8;

    //playStart(){
        //const interval = setInterval(()=> {
        
            //this.render(); 
            //const currentState = state.getState();
            //const rtdb = currentState.rtdb;
    
            //const playerOneReady = rtdb.playerOne.start;
            //const playerTwoReady = rtdb.playerTwo.start;
    
            //if(playerOneReady && playerTwoReady) {
            //    Router.go("/game")
            //} else if(this.timer == 0) {
            //    clearInterval(interval);
            //    Router.go("/instructions");
            //}
            //this.timer--
            //}, 3000)
    //}

    //connectedCallback(){
    //    this.playStart(); 
   // }
   
   
  
    render(){

        const currentState = state.getState();
        
        this.innerHTML=`
        <div class="container">
            <header-comp class="header"></header-comp>
            <div class="container__text">
                <p class="text">Esperando la jugada de tu contrincante ...</p>
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
  
  customElements.define("waitingplay-comp", WaitingPlay);