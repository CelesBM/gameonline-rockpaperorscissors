class ButtonRoom extends HTMLElement {
   
    constructor() {
        super();
        this.render();
        }
    
    render(){
        const shadow = this.attachShadow( {mode: "open"} );
        const style = document.createElement("style");
        const button = document.createElement("button");
        button.className = "root";
           
        style.innerHTML = `
        .root{
            font-family: 'Luckiest Guy', cursive;
            font-size: 27px;
            color: #D8FCFC;
            background-color: #006CFC;
            border: 7px solid #001997;
            border-radius: 10px;
            padding: 3px 41px;
        }
        `
        button.textContent = this.textContent;
        shadow.appendChild(button);
        shadow.appendChild(style);
        }
    }

    customElements.define("button-room", ButtonRoom);