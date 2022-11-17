import { Router } from "@vaadin/router";
import { state } from "../../state";


class Game extends HTMLElement {
    shadow: ShadowRoot;
    userName: string;
    rivalName: string;
    roomid: any;
    timer: any;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open'});
        //this.userName = state.getState().userName;
        //this.rivalName = state.getState().rivalName;
        //this.roomid = state.getState().roomid;
        this.render();
      }

    render() {
        const currentState = state.getState();

        const div = document.createElement("div");
        
        div.innerHTML= `
        <div class="container">
            <p class="number">5</p>
            <div class="container-hands">
                <hands-comp class="hand" hand="rock"></hands-comp>
                <hands-comp class="hand" hand="paper"></hands-comp>
                <hands-comp class="hand" hand="scissor"></hands-comp>
            </div>
        </div>
      `;

      const handEl = div.querySelectorAll("hands-comp");
      
      handEl.forEach((e)=> {
        e.addEventListener("click", ()=>{
            const move = e.getAttribute("hand");
            if(move == "rock"){
                clearTimeout(this.timer);
                state.setMove("piedra").then(()=> {
                    Router.go("/waiting-room")
                })
            }
            if(move == "paper"){
                clearTimeout(this.timer);
                state.setMove("papel").then(()=> {
                    Router.go("/waiting-room")
                })
            }
            if(move == "scissor"){
                clearTimeout(this.timer);
                state.setMove("tijera").then(()=> {
                    Router.go("/waiting-room")
                })
            }
            
        })
      })

      const style = document.createElement("style");

      style.innerHTML=`
      .container{
            display: flex;
            flex-direction: column;
            align-items: center;
            }

      `;

    this.appendChild(div);
    this.appendChild(style);
    }
  }

  customElements.define("game-comp", Game);