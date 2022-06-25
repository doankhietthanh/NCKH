import {
  onValue,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";

import { database } from "./firebase.js";

onValue(ref(database, "history"), (snapshot) => {
  const data = snapshot.val();
  console.log(data);
});
