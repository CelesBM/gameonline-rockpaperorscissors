import { database } from "firebase-admin";
import { runInThisContext } from "vm";
import {ref, onValue, connectDatabaseEmulator, update} from "firebase/database"
import { rtdb } from "./db";
import { captureRejectionSymbol } from "events";
//import { Router } from "express";
import { Router } from "@vaadin/router";
import { callbackify } from "util";

const API_BASE_URL = "http://localhost:3004";
   
type Play = "piedra" | "papel" | "tijera";
type Player =   "playerOne" | "playerTwo";
type DataRoom = { id: number, }

interface CreateRoom {
    roomid: number,
    rtdbRoomid: number,
    ["userName-1"]: string,
    ["userName-2"]: string
  }

const state = {

    data: {
        "userId-1": "",
        "userId-2": "",
        "userOnline-1": false,
        "userOnline-2": false,
        "userReady-1": false,
        "userReady-2": false,
        "ready": "",

        roomid: "",
        rtdbRoomid: "",
        rtdb: {},
        
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
        currentState["userName-1"] = userName;
        this.setState(currentState);
    },
    
    signIn(callback?){
        const currentState = this.getState();

        if(currentState["userName-1"]) {
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: { "content-type": "application/json", 
                           "Cross-Origin-Resource-Policy": "cross-origin"},
                body: JSON.stringify({ name: currentState["userName-1"] }),
            })
           .then((res) => { return res.json() } 
                ).then((data) => {
                     console.log("data:", data)
                     currentState["userId-1"] = data.id;
                     this.setState(currentState);
                     callback ? callback() : false;
                     })
                .catch(err => console.log(err))
        } 
    },

    setRivalName(userRivalName) {
        const currentState = this.getState();
        currentState["userName-2"] = userRivalName;
        this.setState(currentState);
    },

    signInRival(callback){
        const currentState = this.getState();

        if(currentState["userName-2"]){
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: { "content-type": "application/json", 
                           "Cross-Origin-Resource-Policy": "cross-origin"},
                body: JSON.stringify({ name: currentState["userName-2"] })
            })
            .then((res) => { return res.json() }
                 ).then((data) => {
                        currentState["userId-2"] = data.id;
                        this.setState(currentState);
                        callback ? callback() : false;
                 })
                 .catch(err => console.log(err))
        }
    },

    askNewRoom(callback?){
        const currentState = this.getState();

        if(currentState["userId-1"]) {
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: { "content-type": "application/json",
                            "Cross-Origin-Resource-Policy": "cross-origin" },
                body: JSON.stringify({ userid: currentState["userId-1"] }),
            })
            .then((res) => { return res.json() }
                 ).then((data: DataRoom) => {
                     const roomid = data.id;
                     currentState.roomid = roomid;
                     this.setState(currentState);
                     callback ? callback() : false;
                     })
            .catch(err => console.log(err))
        } 
    },

    accessToRoom(callback?) {
        const currentState = this.getState();

        const roomid = currentState.roomid;
        let userId = currentState["userId-1"] || currentState["userId-2"];
        
        if(currentState["userId-2"] == "") {
            userId = currentState["userId-1"]
        } else if(currentState["userId-2"] == "") {
            userId = currentState["userId-1"]
        }

        if(currentState.roomid) {
            fetch(API_BASE_URL + "/rooms/" + roomid + "?userid=" + userId, {
                method: "get",
                headers: { 
                "content-type": "application/json", 
                "Cross-Origin-Resource-Policy": "cross-origin"
                },
            })
            .then((res) => { return res.json() }
                 ).then((data) => {
                     currentState.rtdbRoomid = data.rtdbRoomid;
                     this.setState(currentState);
                     callback ? callback() : false;
                    });
        } else {
            console.error("roomid doesn't exist")
           
        }
    },

    createRoom(callback?) {
        const currentState = this.getState();

        fetch(API_BASE_URL + "/rooms", {
          method: "post",
          headers: { "content-type": "application/json",
          "Cross-Origin-Resource-Policy": "cross-origin" },
          body: JSON.stringify({ name: currentState.name, id: currentState.id }),
        }).then(res => { return res.json() }
               ).then(data => {
                   currentState.roomid = data.roomid;
                   currentState.rtdbRoomid = data.rtdbRoomid;
                   currentState["userName-1"] = data["userName-1"];
                   currentState["userName-2"] = data["userName-2"];
                   this.setState(currentState);
                   callback ? callback() : false;
                   })
          .catch(err => console.log(err))    
      },

    setOnline(ownerOrRival: Player, callback?){
        const currentState = this.getState();

        fetch("/ready", {
             mode: "cors",
             method: "patch",
             headers: { "content-type": "application/json",},
             body: JSON.stringify({ Player: ownerOrRival, rtdbRoomid: currentState.rtdbRoomid }),
        }).then(res => { return res.json() }
               ).then(data => {
                   currentState.Player = data.Player;
                   currentState.rtdbRoomid = data.rtdbRoomid;
                   this.setState(currentState);
                   callback ? callback() : false;
                   })
          .catch(err => console.log(err))
    },

    setOnlineRival(){
        //aca tengo que escuchar lo del setonline del player 1
        const currentState = this.getState();
        const roomid = currentState.roomid;
        const userId = currentState["userId-2"];

        currentState["userOnline-2"] == true;
        this.setState(currentState);
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