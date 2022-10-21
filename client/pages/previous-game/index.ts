import { Router } from "@vaadin/router";
import { state } from "../../state";

class PreviousGame extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open'});
    }

    connectedCallback() {
        this.render();
        const currentState = state.getState();
        
        const button = this.shadow.querySelector(".button");
        const form =  this.shadow.querySelector(".form");
        //const inputCode = (this.shadow.querySelector(".input-code") as HTMLInputElement);    
        //const inputName = (this.shadow.querySelector(".input-name") as HTMLInputElement); 
        //  hasta acá lee todo
  
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target as any;
            //currentState.roomId = target.inputCode.value;
            currentState.roomid = target.code.value;

            //state.setRivalName(target.inputName.value);
            state.setRivalName(target.name.value);

          //currentState.roomid = inputCode.value;
            state.signInRival(()=> {
                //state.setState(currentState);
                state.accessToRoom(()=> {
                    state.listenRoom()
                    Router.go("/instructions");
                })
            });        
        });


    }
    render(){

        const div = document.createElement("div");
        const style = document.createElement("style");

        div.innerHTML = `
    <div class="container">
        <h1 class="title">Piedra Papel ó Tijera</h1>
        <form class="form"> 
          <input type="text" id="code" name="code" class="input-code" placeholder="Ingresa tu código">
          <input type="text" id="name" name="name" class="input-name" placeholder="Ingresa tu nombre">
          <button class="button">Ingresar a la sala</button>
        </form>    
        <div class="container-hands">
          <hands-comp class="hand" hand="rock"></hands-comp>
          <hands-comp class="hand" hand="paper"></hands-comp>
          <hands-comp class="hand" hand="scissor"></hands-comp>
        </div>
    </div>
    `;

        style.innerHTML=`
        .container{
            display: flex;
            flex-direction: column;
            align-items: center;
            }
        .title{
            font-family: 'Indie Flower', cursive;
            font-size: 80px;
            color: #009048;
            line-height: 100px;
            text-align: center;
            margin-top: 40px;
            margin-bottom: 30px;
            }
                @media (min-width: 769px){
                .title{
                    margin-top: 5%;
                    margin-bottom: 125px;
                }}
        form{
            display: flex;
            flex-direction: column;
            align-items: center;
            }
        .input-code, .input-name{
            height: 40px;
            width: 294px;
            font-family: 'Luckiest Guy', cursive;
            font-size: 27px;
            border: 7px solid #001997;
            border-radius: 10px;
            margin-bottom: 10px;
            text-align: center;
            }
            @media (min-width: 769px){
                .input{
                    margin-bottom: 35px;
                }}
        .button{
            font-family: 'Luckiest Guy', cursive;
            font-size: 27px;
            color: #D8FCFC;
            background-color: #006CFC;
            border: 7px solid #001997;
            border-radius: 10px;
            padding: 3px 40px;
            }
        .container-hands{
            display: flex;
            top: 55px;
            position: relative;
            margin: -15px 60px
            }
                @media (min-width: 769px) {
                .container-hands{        
                top: 50px;
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

    this.shadow.appendChild(div);
    this.shadow.appendChild(style);
    }
}

customElements.define("previousgame-comp", PreviousGame);