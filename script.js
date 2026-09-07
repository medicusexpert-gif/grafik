```javascript
const sheetLinks = {
    "01": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=1901112775&single=true&output=csv",
    "02": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=761522376&single=true&output=csv",
    "03": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=427047031&single=true&output=csv",
    "04": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=1456994350&single=true&output=csv",
    "05": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=605689359&single=true&output=csv",
    "06": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=1218108803&single=true&output=csv",
    "07": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=975199346&single=true&output=csv",
    "08": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=878375304&single=true&output=csv",
    "09": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=1634226018&single=true&output=csv",
    "10": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=954794309&single=true&output=csv",
    "11": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=930192024&single=true&output=csv",
    "12": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=1626189679&single=true&output=csv"
};

const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień"
];

const logoUrl = "logo.png";

let currentViewMonth = String(new Date().getMonth() + 1).padStart(2, '0');

/*
 * Rok aktualnie wyświetlanego miesiąca.
 * NIE jest tutaj ustawiony na sztywno.
 *
 * Zostanie pobrany z dat znajdujących się w arkuszu.
 */
let currentViewYear = null;


/* =========================================================
   PARSOWANIE CSV
   ========================================================= */

function parseCSVLine(line) {
    const result = [];
    let cur = "";
    let inQuote = false;

    const sep = line.includes(';') ? ';' : ',';

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuote = !inQuote;
        }
        else if (char === sep && !inQuote) {
            result.push(cur.trim());
            cur = "";
        }
        else {
            cur += char;
        }
    }

    result.push(cur.trim());

    return result.map(cell =>
        cell.replace(/^"(.*)"$/, '$1')
    );
}


/* =========================================================
   WYCIĄGANIE DATY Z WIERSZA
   ========================================================= */

function getRowDate(row) {

    if (!row || !row[1]) {
        return null;
    }

    const date = row[1].trim();

    /*
     * Oczekiwany format:
     * RRRR-MM-DD
     */

    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) {
        return null;
    }

    return {
        year: match[1],
        month: match[2],
        day: match[3]
    };
}


/* =========================================================
   GŁÓWNE ŁADOWANIE DANYCH
   ========================================================= */

async function loadData() {

    const url = sheetLinks[currentViewMonth];

    try {

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const rawData = await res.text();

        const rows = rawData
            .split(/\r?\n/)
            .filter(line => line.trim() !== "")
            .map(parseCSVLine);


        /* -------------------------------------------------
           USTALENIE ROKU Z DAT W ARKUSZU
           ------------------------------------------------- */

        let detectedYear = null;

        for (let i = 2; i < rows.length; i++) {

            const rowDate = getRowDate(rows[i]);

            if (rowDate && rowDate.month === currentViewMonth) {
                detectedYear = rowDate.year;
                break;
            }
        }

        /*
         * Jeżeli znaleziono rok w arkuszu,
         * zapamiętujemy go.
         */

        if (detectedYear) {
            currentViewYear = detectedYear;
        }

        /*
         * Awaryjnie, gdyby arkusz nie zawierał jeszcze
         * żadnej daty dla wybranego miesiąca.
         *
         * Wtedy próbujemy znaleźć jakąkolwiek datę.
         */

        if (!currentViewYear) {

            for (let i = 2; i < rows.length; i++) {

                const rowDate = getRowDate(rows[i]);

                if (rowDate) {
                    currentViewYear = rowDate.year;
                    break;
                }
            }
        }


        /* -------------------------------------------------
           CZAS / ALARM
           ------------------------------------------------- */

        const now = new Date();

        const isAlarmTime =
            (now.getHours() > 15) ||
            (now.getHours() === 15 && now.getMinutes() >= 30);


        const todayCSV =
            `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;


        const realMonth =
            String(now.getMonth() + 1).padStart(2, '0');


        /*
         * Czy oglądamy rzeczywisty miesiąc bieżącego roku?
         *
         * To ważne po przejściu np.:
         *
         * grudzień 2026
         * ->
         * styczeń 2027
         */

        const isCurrentMonthViewed =
            currentViewMonth === realMonth &&
            String(currentViewYear) === String(now.getFullYear());


        /* -------------------------------------------------
           NAGŁÓWEK MIESIĄCA
           ------------------------------------------------- */

        updateMonthHeader();


        /* -------------------------------------------------
           BUDOWANIE TABELI
           ------------------------------------------------- */

        let html = "<table>";

        html += `
            <colgroup>
                <col style="width: 100px;">
                <col style="width: 130px;">
                <col style="width: auto;">
                <col style="width: auto;">
                <col style="width: auto;">
                <col style="width: auto;">
            </colgroup>
        `;


        let weekCounter = 0;


        rows.forEach((row, i) => {

            /*
             * Kolejny tydzień zaczyna się od poniedziałku.
             */

            if (
                i > 1 &&
                row[0] &&
                row[0].toLowerCase().includes("poniedziałek")
            ) {
                weekCounter++;
            }


            const weekClass =
                weekCounter % 2 === 0
                    ? "week-even"
                    : "week-odd";


            /*
             * Podświetlenie dzisiejszego dnia.
             */

            const isToday =
                row[1] &&
                row[1].trim() === todayCSV;


            const todayRowClass =
                isToday ? " today-row" : "";


            html += `<tr class="${weekClass}${todayRowClass}">`;


            row.forEach((cell, j) => {

                /*
                 * Tylko 6 pierwszych kolumn.
                 */

                if (j > 5) {
                    return;
                }


                /* -------------------------------------------------
                   PIERWSZY WIERSZ - NAGŁÓWEK
                   ------------------------------------------------- */

                if (i === 0) {

                    if (j === 0) {

                        html += `
                            <th
                                class="logo-space"
                                rowspan="2"
                                colspan="2"
                                id="main-logo-container">
                            </th>
                        `;

                    }
                    else if (j > 1) {

                        const nameColors = [
                            "",
                            "",
                            "#38bdf8",
                            "#818cf8",
                            "#fbbf24",
                            "#f472b6"
                        ];

                        html += `
                            <th
                                style="
                                    color: ${nameColors[j]};
                                    font-size: 2.2vh;
                                    font-weight: bold;
                                "
                            >
                                ${cell}
                            </th>
                        `;
                    }
                }


                /* -------------------------------------------------
                   DRUGI WIERSZ
                   ------------------------------------------------- */

                else if (i === 1) {

                    if (j > 1) {

                        html += `
                            <th
                                style="
                                    color: #64748b;
                                    font-size: 1.4vh;
                                    font-weight: normal;
                                "
                            >
                                ${cell}
                            </th>
                        `;
                    }
                }


                /* -------------------------------------------------
                   WIERSZE Z DANYMI
                   ------------------------------------------------- */

                else {

                    let className =
                        (j === 0)
                            ? "day"
                            : (j === 1)
                                ? "date"
                                : "tech-data";


                    let content =
                        (j === 0)
                            ? shortenDay(cell)
                            : (j === 1)
                                ? shortenDate(cell)
                                : cell;


                    let inlineStyle = "";
                    let specialClass = "";


                    const cellText =
                        cell.toLowerCase();


                    /* -------------------------------------------------
                       USTALENIE DATY WIERSZA
                       ------------------------------------------------- */

                    const rowDate = getRowDate(row);


                    let isCellInSelectedMonth = false;


                    if (rowDate) {

                        /*
                         * Sprawdzamy ROK I MIESIĄC.
                         *
                         * Dzięki temu:
                         *
                         * 2026-01-15
                         *
                         * nie zostanie pomylony z:
                         *
                         * 2027-01-15
                         */

                        isCellInSelectedMonth =
                            rowDate.month === currentViewMonth &&
                            String(rowDate.year) === String(currentViewYear);
                    }


                    /* -------------------------------------------------
                       KOLOROWANIE DANYCH
                       ------------------------------------------------- */

                    if (j > 1) {

                        /*
                         * Jeżeli wiersz nie należy do wybranego
                         * miesiąca i roku - wygaszamy.
                         */

                        if (!isCellInSelectedMonth) {

                            inlineStyle =
                                "color: #64748b;";

                        }
                        else {

                            /*
                             * Alarm dla dzisiejszego dnia po 15:30.
                             */

                            if (
                                cellText.includes("8-16") &&
                                isToday &&
                                isAlarmTime
                            ) {

                                specialClass =
                                    " alarm-pulse";
                            }


                            /*
                             * Kolorowanie 8-16.
                             */

                            if (cellText.includes("8-16")) {

                                content =
                                    content.replace(
                                        /8-16/i,
                                        '<span class="neon-blue-text">8-16</span>'
                                    );
                            }

                            /*
                             * Parking / 8:00
                             */

                            else if (
                                cellText.includes("parking") ||
                                cellText.includes("8:00")
                            ) {

                                inlineStyle =
                                    "color: #64748b;";
                            }
                        }
                    }

                    else {

                        /*
                         * Kolor Dzień i Data.
                         */

                        if (!isCellInSelectedMonth) {

                            inlineStyle =
                                "color: #475569;";
                        }
                    }


                    html += `
                        <td class="${className}${specialClass}">
                            <div class="marquee-box">
                                <span style="${inlineStyle}">
                                    ${content}
                                </span>
                            </div>
                        </td>
                    `;
                }

            });


            html += "</tr>";
        });


        html += "</table>";


        document.getElementById("table-container").innerHTML =
            html;


        /* -------------------------------------------------
           LOGO
           ------------------------------------------------- */

        const logoCont =
            document.getElementById("main-logo-container");


        if (logoCont) {

            logoCont.innerHTML =
                `<img src="${logoUrl}" alt="Logo" class="table-logo">`;
        }


        /* -------------------------------------------------
           CZAS AKTUALIZACJI
           ------------------------------------------------- */

        document.getElementById("update-time").innerText =
            new Date().toLocaleTimeString();


        /* -------------------------------------------------
           WEEKENDY
           ------------------------------------------------- */

        hideWeekends();


        /* -------------------------------------------------
           MARQUEE
           ------------------------------------------------- */

        setTimeout(initSmartMarquee, 200);


    }
    catch (err) {

        console.error("Błąd CSV:", err);

        setTimeout(loadData, 10000);
    }
}


/* =========================================================
   AKTUALIZACJA NAGŁÓWKA MIESIĄCA
   ========================================================= */

function updateMonthHeader() {

    const monthHeader =
        document.getElementById("current-month-name");


    if (!monthHeader) {
        return;
    }


    const monthIndex =
        parseInt(currentViewMonth, 10) - 1;


    const monthName =
        monthNames[monthIndex];


    /*
     * Rok pochodzi z arkusza.
     */

    if (currentViewYear) {

        monthHeader.innerText =
            `${monthName.toUpperCase()} ${currentViewYear}`;

    }
    else {

        /*
         * Tymczasowo pokazujemy sam miesiąc,
         * dopóki arkusz nie zwróci daty.
         */

        monthHeader.innerText =
            monthName.toUpperCase();
    }
}


/* =========================================================
   SMART MARQUEE
   ========================================================= */

function initSmartMarquee() {

    const spans =
        document.querySelectorAll('.tech-data span');


    spans.forEach(span => {

        const box =
            span.parentElement;


        span.classList.remove(
            'animate-scroll'
        );


        if (span.offsetWidth > box.offsetWidth) {

            box.style.justifyContent =
                "flex-start";


            const distance =
                span.offsetWidth -
                box.offsetWidth +
                25;


            span.style.setProperty(
                '--scroll-dist',
                `-${distance}px`
            );


            span.classList.add(
                'animate-scroll'
            );

        }
        else {

            box.style.justifyContent =
                "center";
        }
    });
}


/* =========================================================
   SKRÓCENIE NAZW DNI
   ========================================================= */

function shortenDay(day) {

    const days = {

        "poniedziałek": "Pon",
        "wtorek": "Wt",
        "środa": "Śr",
        "czwartek": "Czw",
        "piątek": "Pt",
        "sobota": "Sob",
        "niedziela": "Nd"
    };


    return days[
        day.toLowerCase()
    ] || day;
}


/* =========================================================
   SKRÓCENIE DATY
   ========================================================= */

function shortenDate(dateStr) {

    const parts =
        dateStr.split("-");


    return parts.length === 3
        ? `${parts[2]}.${parts[1]}`
        : dateStr;
}


/* =========================================================
   UKRYWANIE WEEKENDÓW
   ========================================================= */

function hideWeekends() {

    const rows =
        document.querySelectorAll("table tr");


    rows.forEach(row => {

        const dayCell =
            row.querySelector(".day");


        if (
            dayCell &&
            (
                dayCell.innerText === "Sob" ||
                dayCell.innerText === "Nd"
            )
        ) {

            row.style.display =
                "none";
        }
    });
}


/* =========================================================
   NAWIGACJA MIESIĘCY
   ========================================================= */

function renderNav() {

    let navHtml = "";


    for (let i = 1; i <= 12; i++) {

        const m =
            String(i).padStart(2, '0');


        navHtml += `
            <button
                class="nav-btn ${m === currentViewMonth ? 'active' : ''}"
                onclick="changeMonth('${m}')"
            >
                ${monthNames[i - 1]}
            </button>
        `;
    }


    document.getElementById(
        "month-nav"
    ).innerHTML = navHtml;
}


/* =========================================================
   ZMIANA MIESIĄCA
   ========================================================= */

function changeMonth(m) {

    currentViewMonth = m;

    /*
     * UWAGA:
     *
     * Nie zmieniamy tutaj currentViewYear.
     *
     * loadData() pobierze rok bezpośrednio
     * z arkusza wybranego miesiąca.
     */

    renderNav();

    loadData();
}


/* =========================================================
   ZEGAR
   ========================================================= */

function updateClock() {

    const clock =
        document.getElementById("clock");


    const now =
        new Date();


    if (clock) {

        clock.innerText =
            now.toLocaleTimeString("pl-PL");
    }


    /*
     * Nagłówek jest aktualizowany tutaj,
     * ale tylko na podstawie roku pobranego
     * wcześniej z arkusza.
     */

    updateMonthHeader();
}


/* =========================================================
   START
   ========================================================= */

renderNav();

loadData();

setInterval(updateClock, 1000);

updateClock();


/*
 * Automatyczne odświeżanie danych:
 * co 3 minuty.
 *
 * Zachowujemy dotychczasowe działanie.
 */

setInterval(loadData, 180000);
```
