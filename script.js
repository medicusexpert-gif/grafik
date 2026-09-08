const sheetLinks = {
    "01": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "02": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "03": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "04": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "05": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "06": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "07": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "08": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "09": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "10": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "11": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv",
    "12": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7Vj5cG2n1Y4lqY4cY3Q6wM4m3mZ7r7m8J6V6s8m0wJ8mM0/pub?gid=0&single=true&output=csv"
};

const monthNames = [
    "",
    "STYCZEŃ",
    "LUTY",
    "MARZEC",
    "KWIECIEŃ",
    "MAJ",
    "CZERWIEC",
    "LIPIEC",
    "SIERPIEŃ",
    "WRZESIEŃ",
    "PAŹDZIERNIK",
    "LISTOPAD",
    "GRUDZIEŃ"
];

const logoUrl = "logo.png";

let currentViewMonth = String(new Date().getMonth() + 1).padStart(2, "0");


/* =========================================================
   DATY
========================================================= */

function parseDate(value) {
    if (!value) return null;

    value = String(value).trim();

    let match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
        return new Date(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3])
        );
    }

    match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

    if (match) {
        return new Date(
            Number(match[3]),
            Number(match[2]) - 1,
            Number(match[1])
        );
    }

    return null;
}


function formatDateForDisplay(value) {
    const date = parseDate(value);

    if (!date || isNaN(date.getTime())) {
        return value || "";
    }

    return String(date.getDate()).padStart(2, "0") + "." +
           String(date.getMonth() + 1).padStart(2, "0");
}


/* =========================================================
   DNI TYGODNIA
========================================================= */

function shortenDay(day) {
    if (!day) return "";

    const d = day
        .toLowerCase()
        .trim()
        .replace("ą", "a")
        .replace("ć", "c")
        .replace("ę", "e")
        .replace("ł", "l")
        .replace("ń", "n")
        .replace("ó", "o")
        .replace("ś", "s")
        .replace("ź", "z")
        .replace("ż", "z");

    if (d.startsWith("pon")) return "pon.";
    if (d.startsWith("wt")) return "wt.";
    if (d.startsWith("śr") || d.startsWith("sr")) return "śr.";
    if (d.startsWith("czw")) return "czw.";
    if (d.startsWith("pt")) return "pt.";
    if (d.startsWith("sob")) return "sob.";
    if (d.startsWith("niedz")) return "niedz.";

    return day;
}


/* =========================================================
   CSV
========================================================= */

function parseCSVLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (insideQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ";" && !insideQuotes) {
            result.push(current);
            current = "";
        } else {
            current += char;
        }
    }

    result.push(current);

    return result;
}


/* =========================================================
   LAMPKI
========================================================= */

function getLampKey(rowDate, techIndex) {
    return `grafik-lamp-${currentViewMonth}-${rowDate}-${techIndex}`;
}


function getLampState(rowDate, techIndex) {
    const key = getLampKey(rowDate, techIndex);

    return localStorage.getItem(key) === "green";
}


function setLampState(rowDate, techIndex, isGreen) {
    const key = getLampKey(rowDate, techIndex);

    if (isGreen) {
        localStorage.setItem(key, "green");
    } else {
        localStorage.removeItem(key);
    }
}


function toggleLamp(lamp) {
    if (!lamp) return;

    const rowDate = lamp.dataset.date;
    const techIndex = lamp.dataset.tech;

    const currentlyGreen = lamp.classList.contains("green");
    const newState = !currentlyGreen;

    if (newState) {
        lamp.classList.add("green");
    } else {
        lamp.classList.remove("green");
    }

    setLampState(rowDate, techIndex, newState);
}


/* =========================================================
   ŁADOWANIE DANYCH
========================================================= */

async function loadData() {
    const tableContainer = document.getElementById("table-container");

    try {
        const url = sheetLinks[currentViewMonth];

        if (!url) {
            tableContainer.innerHTML =
                `<div class="error">Brak źródła danych dla tego miesiąca.</div>`;
            return;
        }

        const response = await fetch(url + "&t=" + Date.now());

        if (!response.ok) {
            throw new Error("Błąd pobierania danych.");
        }

        const buffer = await response.arrayBuffer();

        const text = new TextDecoder("utf-8").decode(buffer);

        const rows = text
            .replace(/\r/g, "")
            .split("\n")
            .map(row => row.trim())
            .filter(row => row !== "")
            .map(parseCSVLine);

        if (!rows.length) {
            tableContainer.innerHTML =
                `<div class="error">Brak danych.</div>`;
            return;
        }

        let html = `
            <table>
                <tbody>
        `;

        let weekNumber = 0;
        let lastWeek = null;

        rows.forEach((row, index) => {

            if (!row || row.length < 2) return;

            const dayName = (row[0] || "").trim();
            const dateValue = (row[1] || "").trim();

            /*
             * Pomijamy wiersze bez daty.
             */
            if (!dateValue || !parseDate(dateValue)) {
                return;
            }

            const date = parseDate(dateValue);

            /*
             * Weekendów nie pokazujemy.
             */
            const dayOfWeek = date.getDay();

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                return;
            }

            /*
             * Numer tygodnia.
             */
            const currentWeek = getWeekNumber(date);

            if (lastWeek !== currentWeek) {
                weekNumber++;
                lastWeek = currentWeek;
            }

            /*
             * Czy to dzisiejszy dzień?
             */
            const today = new Date();

            const isToday =
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate();

            const todayClass = isToday ? " today-row" : "";

            const weekClass =
                weekNumber % 2 === 0
                    ? " week-even"
                    : " week-odd";

            html += `
                <tr class="${weekClass}${todayClass}">
                    <td class="day-name">
                        ${escapeHTML(shortenDay(dayName))}
                    </td>

                    <td class="date-cell">
                        ${escapeHTML(formatDateForDisplay(dateValue))}
                    </td>
            `;

            /*
             * TECHNICY
             */
            for (let j = 2; j < row.length; j++) {

                const cell = (row[j] || "").trim();

                let content = escapeHTML(cell);

                /*
                 * Alarm dla 8-16 po 15:30.
                 */
                let inlineStyle = "";

                if (
                    cell.toLowerCase().includes("8-16") &&
                    new Date().getHours() >= 15 &&
                    new Date().getHours() < 24
                ) {
                    inlineStyle = "font-weight:bold;";
                }

                let lampHTML = "";

                /*
                 * Lampka tylko jeśli technik ma zadanie.
                 */
                if (j > 1 && cell !== "") {

                    const isGreen = getLampState(
                        dateValue,
                        j
                    );

                    lampHTML = `
                        <span
                            class="task-lamp ${isGreen ? "green" : ""}"
                            data-date="${escapeAttribute(dateValue)}"
                            data-tech="${j}"
                            ondblclick="toggleLamp(this)"
                            title="Kliknij dwa razy"
                        ></span>
                    `;
                }

                html += `
                    <td class="tech-data tech-${j}${todayClass}">
                        ${lampHTML}

                        <div class="marquee-box">
                            <span style="${inlineStyle}">
                                ${content}
                            </span>
                        </div>
                    </td>
                `;
            }

            html += `</tr>`;
        });

        html += `
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = html;

        initSmartMarquee();

        updateMonthTitle();

        document.getElementById("update-time").textContent =
            new Date().toLocaleTimeString("pl-PL");

    } catch (error) {

        console.error(error);

        tableContainer.innerHTML = `
            <div class="error">
                Nie udało się pobrać danych.
            </div>
        `;
    }
}


/* =========================================================
   MARQUEE
========================================================= */

function initSmartMarquee() {

    const spans =
        document.querySelectorAll(
            ".tech-data .marquee-box span"
        );

    spans.forEach(span => {

        const box = span.parentElement;

        span.classList.remove("animate-scroll");

        span.style.removeProperty("--scroll-dist");

        if (span.scrollWidth > box.clientWidth) {

            box.style.justifyContent = "flex-start";

            /*
             * 45 px dodatkowego marginesu bezpieczeństwa.
             *
             * Dzięki temu tekst kończy przewijanie
             * przed lampką.
             */
            const distance =
                span.scrollWidth -
                box.clientWidth +
                45;

            span.style.setProperty(
                "--scroll-dist",
                `-${distance}px`
            );

            span.classList.add("animate-scroll");

        } else {

            box.style.justifyContent = "center";
        }
    });
}


/* =========================================================
   WEEKENDY
========================================================= */

function hideWeekends() {

    document
        .querySelectorAll("tbody tr")
        .forEach(row => {

            const dayCell =
                row.querySelector(".day-name");

            if (!dayCell) return;

            const day =
                dayCell.textContent
                    .trim()
                    .toLowerCase();

            if (
                day.startsWith("sob") ||
                day.startsWith("niedz")
            ) {
                row.style.display = "none";
            }
        });
}


/* =========================================================
   TYDZIEŃ
========================================================= */

function getWeekNumber(date) {

    const d = new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        )
    );

    const dayNum = d.getUTCDay() || 7;

    d.setUTCDate(
        d.getUTCDate() + 4 - dayNum
    );

    const yearStart = new Date(
        Date.UTC(
            d.getUTCFullYear(),
            0,
            1
        )
    );

    return Math.ceil(
        (
            (
                (d - yearStart) / 86400000
            ) + 1
        ) / 7
    );
}


/* =========================================================
   NAWIGACJA MIESIĘCY
========================================================= */

function renderNav() {

    const nav =
        document.getElementById("month-nav");

    if (!nav) return;

    nav.innerHTML = "";

    for (let i = 1; i <= 12; i++) {

        const month =
            String(i).padStart(2, "0");

        const button =
            document.createElement("button");

        button.textContent =
            monthNames[i];

        button.className =
            month === currentViewMonth
                ? "active"
                : "";

        button.onclick = () => {
            changeMonth(month);
        };

        nav.appendChild(button);
    }
}


function changeMonth(month) {

    currentViewMonth = month;

    renderNav();

    updateMonthTitle();

    loadData();
}


function updateMonthTitle() {

    const title =
        document.getElementById(
            "current-month-name"
        );

    if (!title) return;

    const year =
        new Date().getFullYear();

    const monthNumber =
        Number(currentViewMonth);

    title.textContent =
        `${monthNames[monthNumber]} ${year}`;
}


/* =========================================================
   ZEGAR
========================================================= */

function updateClock() {

    const clock =
        document.getElementById("clock");

    if (!clock) return;

    const now = new Date();

    clock.textContent =
        now.toLocaleTimeString(
            "pl-PL",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );
}


/* =========================================================
   HTML - ZABEZPIECZENIE
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return escapeHTML(value);
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderNav();

        updateMonthTitle();

        updateClock();

        loadData();

        setInterval(
            updateClock,
            1000
        );

        /*
         * Automatyczne odświeżanie co 3 minuty.
         */
        setInterval(
            loadData,
            180000
        );

        /*
         * Ponowne sprawdzenie szerokości
         * po załadowaniu strony.
         */
        window.addEventListener(
            "resize",
            () => {
                initSmartMarquee();
            }
        );
    }
);
