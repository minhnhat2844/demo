import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOf9TyD1MSZmXFxtZ0AHCrb-xecqvVYg4",
  authDomain: "quan-li-be-ca-canh.firebaseapp.com",
  databaseURL: "https://quan-li-be-ca-canh-default-rtdb.firebaseio.com",
  projectId: "quan-li-be-ca-canh",
  storageBucket: "quan-li-be-ca-canh.firebasestorage.app",
  messagingSenderId: "607360769273",
  appId: "1:607360769273:web:86d7e34c1e24e804e41628",
  measurementId: "G-9FH9L9KHZH"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Trang login
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location = "index.html";
      })
      .catch((error) => {
        msg.innerText = "❌ " + error.message;
      });
  });
}

// Trang index
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location = "login.html";
    });
  });
}

// Theo dõi trạng thái login
onAuthStateChanged(auth, (user) => {
  const isLoginPage = window.location.pathname.includes("login.html");

  if (user && isLoginPage) {
    window.location = "index.html";
  } else if (!user && !isLoginPage) {
    window.location = "login.html";
  } else if (user && !isLoginPage) {
    // Đã đăng nhập → lấy dữ liệu
    const dataRef = ref(db, "cambien");
    const el = document.getElementById("sensorData");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      el.innerHTML = `
        <ul class="list-group">
          <li class="list-group-item">🌡️ Nhiệt độ DS18B20: <strong>${data.tempDS}°C</strong></li>
          <li class="list-group-item">💧 Độ ẩm DHT11: <strong>${data.humidity}%</strong></li>
          <li class="list-group-item">🌡️ Nhiệt độ DHT11: <strong>${data.tempDHT}°C</strong></li>
          <li class="list-group-item">📏 Khoảng cách: <strong>${data.distance} cm</strong></li>
          <li class="list-group-item">🧪 Chỉ số TDS: <strong>${data.tds}</strong></li>
        </ul>
      `;
    });
  }
});
// Hiển thị thông tin người dùng