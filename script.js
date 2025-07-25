import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 🔐 Your Firebase Config Here:
const firebaseConfig = {
  apiKey: "AIzaSyCjUoxsgvN9n5Eae5ZDczwaKhvvo-SLBIs",
  authDomain: "blogger-post-app.firebaseapp.com",
  projectId: "blogger-post-app",
  storageBucket: "blogger-post-app.firebasestorage.app",
  messagingSenderId: "96199807964",
  appId: "1:96199807964:web:64530f671c288465737519"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById('profile-pic').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const uid = auth.currentUser.uid;
  const storageRef = ref(storage, 'profiles/' + uid);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  document.getElementById('profile-pic-preview').src = url;
});

window.signUp = async function () {
  const email = document.getElementById('signup-email').value;
  const pass = document.getElementById('signup-password').value;
  await createUserWithEmailAndPassword(auth, email, pass);
  document.getElementById('signup-popup').style.display = 'none';
};

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('signup-popup').style.display = 'none';
  } else {
    document.getElementById('signup-popup').style.display = 'flex';
  }
});

window.logOut = () => signOut(auth);

window.createPost = async function () {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const category = document.getElementById("post-category").value;
  const bio = document.getElementById("user-bio").value;
  const author = auth.currentUser.email;
  await addDoc(collection(db, "posts"), {
    title, content, category, bio, author,
    createdAt: new Date()
  });
};

onSnapshot(collection(db, "posts"), (snapshot) => {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `<h3>${data.title}</h3><p><strong>${data.author}</strong> - ${data.category}</p><p>${data.content.slice(0, 100)}...</p>`;
    container.appendChild(div);
  });
});
