import { Router } from "@vaadin/router";
import { state } from "../../state";

export class NewGame extends HTMLElement {

    connectedCallback() {
      //const currentState = state.getState();
      this.render();
      const form = this.querySelector(".form");

      form.addEventListener("submit", (e)=> {
        e.preventDefault();
        const target = e.target as any;
        state.setName(target.name.value);
        state.signIn(()=> {
          state.askNewRoom(()=> {
            state.accessToRoom(()=> {
              Router.go("/sharecode-room");
            })
          })
        })
      })
    }

    render() {
      this.innerHTML = `
    <div class="container" >
      <h1 class="title">Piedra Papel ó Tijera</h1>
        <form class="form">
          <div>
            <label class="form__label">Tu nombre</label>
          </div>
            <input class="form__input" type="text" name="name">
            <button class="form__button">Empezar</button>
        </form>
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
                margin-bottom: 92px;
                }}
      form{
        display: flex;
        flex-direction: column;
        align-items: center;
        }
      .form__label{
         font-family: 'Odibee Sans', cursive;
         font-size: 47px;
         }
      .form__input{
            height: 40px;
            width: 265px;
            font-family: 'Luckiest Guy', cursive;
            font-size: 27px;
            border: 7px solid #001997;
            border-radius: 10px;
            margin-bottom: 13px;
            text-align: center;
            }
      .form__button{
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
    }
  }

  customElements.define("newgame-comp", NewGame);