document.addEventListener('DOMContentLoaded', (event) => {
    const timeButton = document.getElementById('time-button');
    const absentButton = document.getElementById('absent-button');
    const addNameButton = document.getElementById('add-name-button');
    const removeNameButton = document.getElementById('remove-name-button');
    const nameInput = document.getElementById('name-input');
    const table = document.getElementById('attendance-table').getElementsByTagName('tbody')[0];

    const names = ["山崎 陸人", "谷口 明太郎", "栗木 太郎", "柳原 順花", "大西 華蓮", "岡田 弥生", "木村 舞子", "大澤 拓真", "鈴依 実", "清水 茉優", "徳田 連", "小塚 楓希", "柏崎 尚美", "一輪 京本太郎", "磯本 涼", "三浦 美咲", "須賀 尚介", "加藤 達太", "永瀬 愛菜", "双葉 陽", "竹田 菜華", "石原 血", "島 ののか", "体 千鶴", "笹尾 葵士", "見徳 蓮"];

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

    function saveData(name, date, value) {
        const db = firebase.database();
        db.ref('attendance/' + name + '/' + date).set(value);
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
