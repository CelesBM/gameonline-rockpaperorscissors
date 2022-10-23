import {state} from "../../state";

class Header extends HTMLElement {
   
    constructor() {
        super();
        this.render();
        }
    
    render(){
        const shadow = this.attachShadow( {mode: "open"} );
        const div = document.createElement("div");
        const style = document.createElement("style");
        const currentState = state.getState();
        const userName = currentState["userName-1"];
        const userRivalName = currentState["userName-2"];
        const roomid = currentState.roomid;
         
        div.innerHTML = `
        <div class="container">
            <div class="container__users">
                <p class="myName">${userName}</p>
                <p class="opponent">${userRivalName}</p>
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