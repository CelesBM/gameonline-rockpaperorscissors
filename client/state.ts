import { database } from "firebase-admin";
import { runInThisContext } from "vm";
import {ref, onValue, connectDatabaseEmulator, update} from "firebase/database"
import { rtdb } from "./db";
import { captureRejectionSymbol } from "events";
import { Router } from "@vaadin/router";
import { callbackify } from "util";

const API_BASE_URL = "http://localhost:3004";
//type User = {name: string, userId: string}; 
type Play = "piedra" | "papel" | "tijera";
type Player =   "playerOne" | "playerTwo";
//type DataRoom = { id: number, };

const state = {

    data: {

        userId:"",
        userName: "",
        rtdbData: {}, 
        roomid: "",
        rtdbRoomid: "",
        rtdb: {},
        creator: "",

        currentGame: {
			myPlay: "",
			botPlay: "",
		},

        history: {
			myScore: 0,
			botScore: 0,
		},
    },

    listeners: [],

    getState() {
        return this.data
    },

    setState(newState) {
        this.data = newState;
        for(const cb of this.listeners) { cb() }
        console.log(`Soy el state, he cambiado:`, this.data);
    },
    
    subscribe(callback: (any) => any) {
        this.listeners.push(callback);
    },

    listenRoom(callback?){
        const currentState = this.getState();

        const roomRef = ref(rtdb, "/rooms" + currentState.rtdbRoomid);  
        onValue(roomRef, (snap)=> {
            currentState.rtdb = snap.val();
            this.setState(currentState);
        })
        console.log("listenRoom", currentState)
    },

    setName(userName) {
        const currentState = this.getState();
        currentState.userName = userName
        this.setState(currentState);
    },
    
    signIn(callback?){
        const currentState = this.getState();

        if(currentState.userName) {
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name: currentState.userName })
            }).then((res) => { return res.json() })
              .then((data) => { 
                console.log("data:", data),
                currentState.userId = data.id;
                this.setState(currentState);
                callback ? callback(): false;
            }).catch(err => console.log(err))
        }
    },

    rivalPlayer(callback?){
        const currentState = state.getState();
        const rtdbRoomid = currentState.rtdbRoomid;
        const name = currentState.name;
        this.setState(currentState);

        fetch(API_BASE_URL + "/rival-player", {
            mode: "cors",
            method: "patch",
            headers: { "content-type": "application/json" },
            body: JSON.stringify( {name: name, rtdbRoomid: rtdbRoomid})
        }); 
      },
    
    askNewRoom(callback?){
        const currentState = this.getState();

        if(currentState.userId) {
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: { "content-type": "application/json", },
                body: JSON.stringify({ userid: currentState.userId, name: currentState.name }),
            })
            .then((res) => { return res.json() }
                 ).then((data//: DataRoom//
                 ) => {
                     const roomid = data.id;
                     const rtdbRoomid = data.roomLongid;
                     currentState.rtdbRoomid = rtdbRoomid
                     currentState.roomid = roomid;
                     this.setState(currentState);
                     callback ? callback() : false;
                     })
            .catch(err => console.log(err))
        } 
    },

    accessToRoom(callback?){
        const currentState = this.getState;
        const roomid = currentState.roomid;
        const userId = currentState.userId;
        const rtdbRoomid = currentState.rtdbRoomid;

        console.log("roomid", currentState.roomid)
                console.log("rtdb", currentState.rtdbRoomid)

        if(currentState.roomid) {
            fetch(API_BASE_URL + "/rooms/" + roomid + "?userid=" + userId, {
                method: "get",
                headers: { "content-type": "application/json"}
            }).then(res => { return res.json() }
             ).then((data)=> {
                currentState.rtdbRoomid = data.rtdbRoomid;  
                this.setState(currentState);
                callback ? callback(): false;
            })
        } 
    },

    createRoom(callback?) {
        const currentState = this.getState();

        fetch(API_BASE_URL + "/rooms", {
          method: "post",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: currentState.name, id: currentState.id }),
        }).then(res => { return res.json() }
               ).then(data => {
                   currentState.roomid = data.roomid;
                   currentState.rtdbRoomid = data.rtdbRoomid;
                   currentState.userName = data.userName;
                   this.setState(currentState);
                   callback ? callback() : false;
                   })
          .catch(err => console.log(err))    
      },

        //400 BAD REQUEST //postman lo lee bien   NO LEE EL RTDBROOMID PORQUE APARECEN "" CUANDO INICIO JUEGO, VER
    playerReady(ownerOrRival: Player, callback?){
        const currentState = this.getState();
       const rtdbRoomid = currentState.rtdbRoomid;
        console.log(ownerOrRival, rtdbRoomid)

        fetch(API_BASE_URL + "/ready", {
             mode: "cors",
             method: "patch",
             headers: { "content-type": "application/json"},
             body: JSON.stringify({ Player: ownerOrRival, rtdbRoomid: currentState.rtdbRoomid }),
        }).then(res => { return res.json() }
               ).then(data => {
                   currentState.Player = data.Player;
                   currentState.rtdbRoomid = data.rtdbRoomid;
                   this.setState(currentState);
                   
                   callback ? callback() : false;
                   }).catch(err => console.log(err))
    },

    setScore(result) {
		const currentState = this.getState();

		if(result == "win"){ currentState.history.myScore ++ } 
        else if (result == "lose"){ currentState.history.botScore ++ }
    },

    restartGame() {
		const currentState = this.getState();

		currentState.currentGame.myPlay = "";
		currentState.currentGame.botPlay = "";
		this.setState(currentState);
	  },

    setMove(move: Play, callback?){
		const currentState = this.getState().currentGame;
        const roomid = currentState.roomid;
        const userId = currentState.userId;
		
        if(this.data.userName == this.data.roomid ){
            currentState.myPlay == move;
            this.data.roomid.myPlay == move;
        } else {
            currentState.botPlay == move;
            this.data.roomid.botPlay == move;
        }
        return fetch(API_BASE_URL + "/rooms/" + roomid + "?userid=" + userId + move, {
            method: "post",
            headers: { "content-type": "application/json" ,
            "Cross-Origin-Resource-Policy": "cross-origin"}, 
        }).then((res)=> {res.json()})
          .then((r)=> { return r })

		this.setScore();
	},

    setMovePlayerOne(){},

    changePlayPlayerOne(){},

    whoWins(myPlay: Play, botPlay: Play) {
		
		const winRock: boolean = myPlay == "piedra" && botPlay == "tijera";
		const winPaper: boolean = myPlay == "papel" && botPlay == "piedra";
		const winScissor: boolean = myPlay == "tijera" && botPlay == "papel";
		const win = [winRock, winPaper, winScissor].includes(true);
		
		const loseRock: boolean = myPlay == "piedra" && botPlay == "papel";
		const losePaper: boolean = myPlay == "papel" && botPlay == "tijera";
		const loseScissor: boolean = myPlay == "tijera" && botPlay == "piedra";
		const lose = [loseRock, losePaper, loseScissor].includes(true);

		if (win == true){ return "win" } 
        else if(lose == true){ return "lose" } 
        else { return "tie" }
	},

    savedData(){
		const currentHistory = this.getState();
		localStorage.setItem("data", JSON.stringify(currentHistory));
	},
        
}

export {state};