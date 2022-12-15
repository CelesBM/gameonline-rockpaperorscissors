import { Router } from "@vaadin/router";
import { parentPort } from "worker_threads";
import { state } from "../../state";


class Game extends HTMLElement {
    shadow: ShadowRoot;
    counter: number = 5;

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
                <hands-comp class="hand-rock" hand="rock"></hands-comp>
                <hands-comp class="hand-paper" hand="paper"></hands-comp>
                <hands-comp class="hand-scissor" hand="scissor"></hands-comp>
            </div>
        </div>
      `;

      const style = document.createElement("style");

      style.textContent = ``

      this.shadow.appendChild(div);
      this.shadow.appendChild(style);

      const handEl = div.querySelectorAll("hands-comp");
      const rockEl = div.querySelector(".hand-rock");
      const paperEl = this.querySelector(".hand-paper");
      const scissorEl = this.querySelector(".hand-scissor");

      handEl.forEach((hand)=> {

        hand.addEventListener("click", (e: any)=>{
            const move = hand.getAttribute("hand");

            if(currentState["algoplayer1"] == "") {
                if(move == "rock") {
                    console.log("player X elegió piedra");
                    //rockEl.style.display = "initial";
                    //paperEl.style.display  = "none";
                    //scissorEl.style.display = "none";
                    state.setMove("piedra");
                    //state.setMovePlayerOne(move, () => {
                        //state.changePlayPlayerOne(() => {})
                    //});
                } else if(move == "paper"){
                    console.log("player X elegió piedra");
                    //rockEl.style.display = "none";
                    //paperEl.style.display  = "initial";
                    //scissorEl.style.display = "none";
                    state.setMove("papel");
                    //state.setMovePlayerOne(move, () => {
                      //  state.changePlayPlayerOne(() => {})
                    //});
                } else if(move == "scissor"){
                    console.log("player X elegió piedra");
                    //rockEl.style.display = "none";
                    //paperEl.style.display  = "none";
                    //scissorEl.style.display = "initial";
                    state.setMove("tijera");
                    //state.setMovePlayerOne(move, () => {
                    //    state.changePlayPlayerOne(() => {})
                    //});
                }
            }


           
        })
            
        })
      

    

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