import { database } from "firebase-admin";
import { runInThisContext } from "vm";
import {ref, onValue} from "firebase/database"
import { rtdb } from "./db";

const API_BASE_URL = "http://localhost:3002";
   
type Play = "rock" | "paper" | "scissor";
type DataRoom = { id: number, }

interface CreateRoom {
    roomid: number,
    rtdbRoomid: number,
    ["userName-1"]: string,
    ["userName-2"]: string
  }

 
const state = {

    data: {
        "userName-1": "",
        "userName-2": "",
        "userId-1": "",
        "userId-2": "",
        "userReady-1": false,
        "userReady-2": false,
        "ready": "",
        roomid: "",
        rtdbRoomid: "",
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

        const roomRef = ref(rtdb, "/rooms" + currentState.rtdbRoomid);
        onValue(roomRef, (snap)=> {
            currentState.rtdb = snap.val();
            const playerOneReady = snap.val()["userReady-1"];
            const playerTwoReady = snap.val()["userReady-2"];
            this.setState(currentState); 
        })
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
        currentState["userName-2"] = userRivalName;
        this.setState(currentState);
    },

    signInRival(callback){
        const currentState = this.getState();

        if(currentState["userName-2"]){
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: { "content-type": "application/json" },
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
                headers: { "content-type": "application/json" },
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
                headers: { "content-type": "application/json" },
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
          headers: { "content-type": "application/json" },
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




       
        }
        
    





      





export {state};