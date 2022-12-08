import { Router } from "@vaadin/router";
import { state } from "../../state";

class ShareCode extends HTMLElement {

    connectedCallback() {
        this.render(); 
        const currentState = state.getState();

        const button = this.querySelector(".button");
        console.log(button)

        //a partir del click, userOnline-1 pasa de false a true:
        button.addEventListener("click", (e)=> {
            e.preventDefault();
            state.setOnline();
            //Router.go("/waiting-room");
        })

      }

    render(){
        
        this.innerHTML=`
        <div class="container">
            <div class="container__text">
                <p class="sharecode">Compartí el código:</p>
                <b class="code">${state.getState().roomid}</b>
                <p class="rival">con tu contrincante</p>
                <button class="button">Listo</button>
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
            line-height: 25px;
        }
        @media (min-width: 769px) {
            .container__text{        
            margin: 50px 0px;
            }}

        .sharecode, .code, .rival{
            font-family: 'Indie Flower', cursive;
            font-size: 40px;
        }

        .button{
            font-family: 'Luckiest Guy', cursive;
            font-size: 27px;
            color: #D8FCFC;
            background-color: #006CFC;
            border: 7px solid #001997;
            border-radius: 10px;
            padding: 3px 70px;
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
  
  customElements.define("sharecode-comp", ShareCode);
