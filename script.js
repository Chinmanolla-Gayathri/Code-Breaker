const legend = [
    {d: 1, s: "⊗"}, {d: 2, s: "⩵"}, {d: 3, s: "⨳"}, 
    {d: 4, s: "⨀"}, {d: 5, s: "⩶"}, {d: 6, s: "⨕"}, 
    {d: 7, s: "⩸"}, {d: 8, s: "⩻"}, {d: 9, s: "⩼"}
];

let state = 'setup', age = 0, timeLeft = 90;
let stats = { correct: 0, wrong: 0, practice: 3 };
let target;

function startInstructions() {
    age = document.getElementById('age-input').value;
    if(!age) return alert("Please enter age");
    showScreen('instruction-screen');
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function startPractice() {
    state = 'practice';
    showScreen('test-screen');
    renderLegend();
    nextTrial();
}

function renderLegend() {
    const el = document.getElementById('clinical-legend');
    el.innerHTML = legend.map(p => `<div class="pair"><div>${p.d}</div><div class="sym">${p.s}</div></div>`).join('');
}

function nextTrial() {
    target = legend[Math.floor(Math.random() * 9)];
    document.getElementById('target-digit').innerText = target.d;
    
    const grid = document.getElementById('response-grid');
    grid.innerHTML = "";
    [...legend].sort(() => Math.random() - 0.5).forEach(p => {
        const btn = document.createElement('button');
        btn.innerText = p.s;
        btn.onclick = () => handleInput(p);
        grid.appendChild(btn);
    });
}

function handleInput(selected) {
    const isCorrect = selected.d === target.d;
    if (state === 'practice') {
        alert(isCorrect ? "Correct!" : "Wrong - look at the legend!");
        if (--stats.practice <= 0) startActualTest();
        else nextTrial();
    } else {
        isCorrect ? stats.correct++ : stats.wrong++;
        updateLiveAccuracy();
        nextTrial();
    }
}

function updateLiveAccuracy() {
    const total = stats.correct + stats.wrong;
    const acc = ((stats.correct / total) * 100).toFixed(0);
    document.getElementById('accuracy-live').innerText = acc;
}

function startActualTest() {
    state = 'test';
    stats.correct = 0; stats.wrong = 0;
    const timerInt = setInterval(() => {
        if (--timeLeft <= 0) { clearInterval(timerInt); finish(); }
        document.getElementById('timer').innerText = timeLeft;
    }, 1000);
}

function finish() {
    showScreen('result-screen');
    // Adjusted for the "Shuffled Grid" difficulty
let category = "";
if (speed > 45) category = "High (Superior)";
else if (speed > 30) category = "Average (Healthy)";
else if (speed > 20) category = "Low-Average (Borderline)";
else category = "Low (Clinical Range)";

    document.getElementById('diagnostic-card').innerHTML = `
        <h3>Participant Age: ${age}</h3>
        <p><b>Accuracy:</b> ${accuracy}%</p>
        <p><b>Processing Speed:</b> ${speed} correct/min</p>
        <hr>
        <h4>Cognitive Profile: ${category} Intelligence/Speed</h4>
    `;

    // Save for ML Training
    const data = { age, accuracy, speed, category, timestamp: new Date() };
    localStorage.setItem(`schizo_data_${Date.now()}`, JSON.stringify(data));
}