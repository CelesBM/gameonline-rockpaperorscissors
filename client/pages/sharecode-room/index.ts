import { Router } from "@vaadin/router";
import { state } from "../../state";

class ShareCode extends HTMLElement {
    shadow: ShadowRoot;
    
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open'});
    }

    //tiene que escuchar que hace el otro jugador y, cuando este en linea, ir a las instrucciones.
    connectedCallback() {
        this.render(); 
        const currentState = state.getState();

        //state.listenRoom()
        //state.subscribe(()=> {
            //probando
        //    state.setOnline();
            


            //esto estaba antes
            //if(window.location.pathname.toString() == "/sharecode-room" && 
            //currentState.playerOneOnline == true && currentState.playerTwoOnline == true){
            //    Router.go("/instructions");
            //}
        //})
      }

    render(){
        const div = document.createElement("div");
        
        div.innerHTML=`
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

    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
    };
  }
  
  customElements.define("sharecode-comp", ShareCode);
