import { Router } from "@vaadin/router";
import { state } from "../../state";

class Instructions extends HTMLElement {
    shadow: ShadowRoot;

    connectedCallback(){
        this.render(); 
        const button = this.querySelector(".button")
        const currentState = state.getState();
     

        button.addEventListener("click", (e)=>{
            e.preventDefault()
            state.setOnline("playerOne", ()=> {
                state.listenRoom();
                Router.go("waiting-room")
            }); 
        });
    }
  
    render(){

        this.innerHTML = `
        <div class="container">
            <header-comp class="header"></header-comp>
            <div class="container__text">
                <p class="instructions">Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos</p>
                <button class="button">¡Jugar!</button>
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
            margin: -5px;
        }

        .instructions{
            font-family: 'Indie Flower', cursive;
            font-size: 45px;
            text-align: center;
            margin: 10px 40px 0px 40px;
        }

        .button{
            font-family: 'Luckiest Guy', cursive;
            font-size: 27px;
            color: #D8FCFC;
            background-color: #006CFC;
            border: 7px solid #001997;
            border-radius: 10px;
            padding: 3px 70px;
            margin-top: 25px;
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

       this.appendChild(style);
    };
  }
  
  customElements.define("instructions-comp", Instructions);