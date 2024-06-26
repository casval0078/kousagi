<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>帰宅時間記録</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js" defer type="module"></script>
</head>
<body>
    <h1>帰宅時間記録</h1>
    <div class="container">
        <div class="controls">
            <div class="buttons">
                <button id="time-button">時刻入力</button>
                <button id="absent-button">欠席</button>
            </div>
            <div class="name-management">
                <input type="text" id="name-input" placeholder="氏名を入力">
                <button id="add-name-button">追加</button>
                <button id="remove-name-button">削除</button>
            </div>
        </div>
        <table id="attendance-table">
            <thead>
                <tr>
                    <th>氏名</th>
                    <!-- 日付を動的に生成 -->
                </tr>
            </thead>
            <tbody>
                <!-- 名簿を動的に生成 -->
            </tbody>
        </table>
    </div>
    <script type="module">
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
        import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDPUoZSZCBmJi7yMtIp6apBEfEJqIJWZRY",
            authDomain: "kousagi-2e126.firebaseapp.com",
            projectId: "kousagi-2e126",
            storageBucket: "kousagi-2e126.appspot.com",
            messagingSenderId: "379985487644",
            appId: "1:379985487644:web:e8ca61a2fb7cbc2fc37cd9",
            measurementId: "G-DB225BE3JD"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);

        // Functions to save data to Firebase
        function saveData(name, date, value) {
            set(ref(db, 'attendance/' + name + '/' + date), value);
        }

        // Script to handle table interactions
        document.addEventListener('DOMContentLoaded', (event) => {
            const timeButton = document.getElementById('time-button');
            const absentButton = document.getElementById('absent-button');
            const addNameButton = document.getElementById('add-name-button');
            const removeNameButton = document.getElementById('remove-name-button');
            const nameInput = document.getElementById('name-input');
            const table = document.getElementById('attendance-table').getElementsByTagName('tbody')[0];

            const names = ["あ"];

            function generateTable() {
                table.innerHTML = '';
                names.forEach(name => {
                    let row = table.insertRow();
                    let cell = row.insertCell(0);
                    cell.innerText = name;
                    for (let i = 0; i < 31; i++) {
                        row.insertCell(i + 1);
                    }
                });
            }

            generateTable();

            const dateRow = table.parentNode.querySelector('thead tr');
            for (let i = 1; i <= 31; i++) {
                let th = document.createElement('th');
                th.innerText = `5月${i}日`;
                dateRow.appendChild(th);
            }

            let selectedCells = [];

            table.addEventListener('click', (e) => {
                if (e.target.tagName === 'TD' && e.target.cellIndex > 0) {
                    if (selectedCells.includes(e.target)) {
                        e.target.style.backgroundColor = '';
                        selectedCells = selectedCells.filter(cell => cell !== e.target);
                    } else {
                        e.target.style.backgroundColor = '#b0c4de';
                        selectedCells.push(e.target);
                    }
                }
            });

            timeButton.addEventListener('click', () => {
                const currentTime = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
                selectedCells.forEach(cell => {
                    cell.innerText = currentTime;
                    saveData(cell.parentElement.cells[0].innerText, dateRow.cells[cell.cellIndex].innerText, currentTime);
                });
                clearSelection();
            });

            absentButton.addEventListener('click', () => {
                selectedCells.forEach(cell => {
                    cell.innerText = '欠席';
                    saveData(cell.parentElement.cells[0].innerText, dateRow.cells[cell.cellIndex].innerText, '欠席');
                });
                clearSelection();
            });

            function clearSelection() {
                selectedCells.forEach(cell => cell.style.backgroundColor = '');
                selectedCells = [];
            }

            addNameButton.addEventListener('click', () => {
                const newName = nameInput.value.trim();
                if (newName && !names.includes(newName)) {
                    names.push(newName);
                    generateTable();
                    nameInput.value = '';
                }
            });

            removeNameButton.addEventListener('click', () => {
                const nameToRemove = nameInput.value.trim();
                if (names.includes(nameToRemove)) {
                    const index = names.indexOf(nameToRemove);
                    if (index > -1) {
                        names.splice(index, 1);
                        generateTable();
                        nameInput.value = '';
                    }
                }
            });
        });
    </script>
</body>
</html>
