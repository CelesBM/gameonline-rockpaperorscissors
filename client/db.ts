import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"

const firebaseConfig = {
    apiKey: "aqiot4vw2NhVXXzqhbcZVFhlOzlhN0hDrYH4834M", 
    databaseURL:"https://dwf-backend-default-rtdb.firebaseio.com",
    authDomain:"dwf-backend.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

export {rtdb};
 
// versión actualizada firebase: https://firebase.google.com/docs/web/modular-upgrade?hl=es --- https://discord.com/channels/801821597244719165/1024458929645834241/1024458933747843102