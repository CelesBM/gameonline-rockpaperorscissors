import * as express from "express";
import * as cors from "cors";
import { firestore, rtdb } from "./database";
//import { json } from "body-parser";
import { nanoid } from "nanoid";
import * as path from "path";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3004;

const usersCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

//ACA E LOGUEO EN CASO DE QUE SEA UN NUEVO USUARIO



app.post("/signin", function(req, res){
    const name = req.body.name;
    usersCollection.where("name", "==", name).get().then((searchResponse)=> {
        if(searchResponse.empty){
        usersCollection.add({
            name
        }).then((newUserRef)=> {
            res.json({
                id: newUserRef.id,
                new: true
                //este id va a ser la llave para decur quien somos
            })
        })
        } else {
            res.status(200).json({
                id: searchResponse.docs[0].id,
            })
        }
    })
});


//CREA UN ROOM Y ME DEVUELVE UN ID MAS SENCILLO, MAS CORTO

app.post("/rooms", (req, res)=> {
    const {userid, name} = req.body;
    usersCollection
    .doc(userid.toString())
    .get()
    .then((doc)=> {
        if(doc.exists) {
           const roomRef = rtdb.ref("rooms/" + nanoid());
           roomRef.set({
            creator: userid,
            currentGame: { replay: false },
            playerOne: {
                "userName": "",
                //"userId": "",
                creator: true,
                start: false,
                choice: "none",
                score: 0,
              },
            playerTwo: {
                "userName": "",
                //"userId": "",
                creator: false,
                start: false,
                choice: "none",
                score: 0,
              },
                //"owner": userid
           }).then(()=> {
            const roomLongid = roomRef.key;
            const roomShortid = 1000 + Math.floor(Math.random() * 999);
            roomsCollection.doc(roomShortid.toString()).set({
                rtdbRoomid: roomLongid,
                creator: userid,
                score: { playerOne: 0, playerTwo: 0 }
            }).then(()=> {
                res.json({
                    id: roomShortid,
                    roomLongid: roomLongid.toString(),
                });
            })
           });
        } else {
            res.status(401).json({
                message: "doesn't exist",
            });  
        }
    });
});

//PARA CONOCER EL LONGID
app.get("/rooms/:roomid", (req, res)=> {
    const {userid} = req.query;
    const {roomid} = req.params;
    usersCollection
    .doc(userid.toString())
    .get().then((doc)=> {
        if(doc.exists) {
            roomsCollection.doc(roomid).get()
            .then((snap)=> {
                const data = snap.data();
                //res.json(data);
                res.json(data.roomLongid)
            })
        } else {
            res.status(401).json({
                message: "doesn't exist",
            });  
        }
    })
});

app.patch("/rival-player", (req, res)=> {
    const {name} = req.body;
    const {rtdbRoomid} = req.body;
    const roomRef = rtdb.ref(`/rooms/${rtdbRoomid}/PlayerTwo`);
    roomRef.update({ name });
    res.json({ message: "nombre ok", name: name})
})

app.patch("/ready", (req, res)=> {
    const {Player} = req.body;
    const {rtdbRoomid} = req.body;
    const roomRef = rtdb.ref(`/rooms/${rtdbRoomid}/${Player}`)
    roomRef.update({ start: true })
    res.json({ message: `${Player} online`})
})

app.use(express.static("dist"));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
});

//importar.

app.listen(port, ()=> {
    console.log(`app listening at http://localhost:${port}`);
});

//app.use (3002);