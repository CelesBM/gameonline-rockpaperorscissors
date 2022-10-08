import { database } from "firebase-admin";
import { runInThisContext } from "vm";
import {ref, onValue} from "firebase/database"
import { rtdb } from "./db";

const API_BASE_URL = "http://localhost:1234";
   
type Play = "rock" | "paper" | "scissor";
type DataRoom = { id: number, }
    
const state = {

    data: {
        "userName-1": "",
        "userName-2": "",
        "userId-1": "",
        "userId-2": "",
        roomId: "",
        rtdbRoomId: "",
        rtdb: {},
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

    listenRoom(){
        const currentState = this.getState();

        const roomRef = ref(rtdb, "/rooms" + currentState.rtdbRoomId);
        onValue(roomRef, (snap)=> {
            currentState.rtdb = snap.val();
            this.setState(currentState); 
        })

        //rtdb.ref("/rooms/" + currentState.rtdbRoomId)
        //    .on("value", (snap)  {
        //      currentState.rtdb = snap.val();
        //      this.setState(currentState);          
       //})
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
                headers: { "content-type": "application/json" },
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
        currentState["userName-2"] = userRivalName.value;
        this.setState(currentState);
    },

    signInRival(callback){
        const currentState = this.getState();
        if(currentState["userName-2"]){
            fetch(API_BASE_URL + "/auth", {
                method: "post",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name: currentState["userName-2"] })
            })
            .then((res) => { return res.json() }
                 ).then((data) => {
                        currentState["userId-2"] = data.id;
                        this.setState(currentState);
                        callback();
                 })
                 .catch(err => console.log(err))
        }
    },

    askNewRoom(callback?){
        const currentState = this.getState();

        if(currentState["userId-1"]) {
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ userid: currentState["userId-1"] }),
            })
            .then((res) => { return res.json() }
                 ).then((data: DataRoom) => {
                     const roomId = data.id;
                     currentState.roomid = roomId;
                     this.setState(currentState);
                     //this.setRoomId(roomId);
                     //this.setState(currentState);
                     callback ? callback() : false;
                     })
            .catch(err => console.log(err))
        } 
    },

    accessToRoom(callback?) {
        const currentState = this.getState();
        const roomId = currentState.roomId;
        let userId = currentState["userId-1"] || currentState["userId-2"];
        
        if(currentState["userId-2"] == "") {
            userId = currentState["userId-1"]
        } else if(currentState["userId-2"] == "") {
            userId = currentState["userId-1"]
        }

        if(currentState.roomId) {
            fetch(API_BASE_URL + "/rooms/" + roomId + "?userid=" + userId, {
                method: "get",
                headers: { "content-type": "application/json" },
            })
            .then((res) => { return res.json() }
                 ).then((data) => {
                     currentState.rtdbRoomId = data.rtdbRoomId;
                     this.setState(currentState);
                     callback ? callback() : false;
                    });
        } else {
            console.error("roomId doesn't exist")
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
                   currentState.shortId = data.shortId;
                   currentState.rtdbId = data.rtdbId;
                   currentState.player = data.player;
                   currentState.opponentPlayer = data.opponentPlayer;
                   this.setState(currentState);
                   callback ? callback() : false;
                   })
          .catch(err => console.log(err))
          
      },   
};

export {state};