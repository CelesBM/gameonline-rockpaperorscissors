import { throws } from "assert";
import {state} from "../../state";

class Header extends HTMLElement {
    playerOneName: string;
    playerTwoName: string;
    playerOneScore: number;
    playerTwoScore: number;
   
    constructor() {
        super();
        this.render();
        }
    
    render(){
        const shadow = this.attachShadow( {mode: "open"} );
        const div = document.createElement("div");
        const style = document.createElement("style");
        const currentState = state.getState();
        //let userName = currentState["userName-1"];
        //let userRivalName = currentState["userName-2"];
        //let userName = currentState.userName;
        const roomid = currentState.roomid;
        const data = currentState.rtdbData;

        this.playerOneName = data.playerOne.name;
        this.playerTwoName = data.playerTwo.name;
        this.playerOneScore = data.playerOne.score;
        this.playerTwoScore = data.playerTwo.score;

        // <p class="myName">${userName}</p>
        //  <p class="opponent">${userRivalName}</p>
         
        div.innerHTML = `
        <div class="container">
            <div class="container__users">

            <p class="myName">${this.playerOneName}:${this.playerOneScore}</p>
            <p class="opponent">${this.playerTwoName}:${this.playerTwoScore}</p>

               
            </div>
            <div class="container__room">
                <b class="room">Sala</b>
                <p class="code">${roomid}</p>
            </div>
        </div>
        `;

        style.innerHTML = `
        .container{
            display: flex;
            align-items: flex-end;
            margin: -15px 0px 7px 0px;
            font-family: 'Indie Flower', cursive;
            font-size: 25px;
            line-height: 25px;
        }

        .container__users{
            color: #ff8000;
            margin-right: 220px;
        }
        `;
       
        shadow.appendChild(div);
        shadow.appendChild(style);
        }
    }

    customElements.define("header-comp", Header);