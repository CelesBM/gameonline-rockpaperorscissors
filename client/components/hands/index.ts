const hands = {
	rock: require("url:../../images/piedra.png"),
	paper: require("url:../../images/papel.png"),
    scissor: require("url:../../images/tijera.png"),
};

    class Hand extends HTMLElement {
        shadow: ShadowRoot;
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: "open" });
            this.render();
        }
        render(){
            const div = document.createElement("div");
            const style = document.createElement("style");
            const hand = this.getAttribute("hand");
           
            style.innerHTML = `
            .hand{
                height: 138px;
                width: 66px;
            }
            @media (min-width: 769px) {
                .hand{        
                    height: 170px;
                    width: 70px;;
            }}
            `;

            div.innerHTML = `
            <img class="hand" src=${hands[hand]}></img>
            `;

            this.shadow.appendChild(style);
            this.shadow.appendChild(div)
        }
    }
    customElements.define("hands-comp", Hand);