import RingCalendar from "./RingCalendar.js";



function printBackground(year) {
    var ith = RingCalendar.getIth(year);
    var startAngle = RingCalendar.getYearAngle() * ith;  //0 @ top dead center is where RingCalendar.startDate starts
    var d = new Date(year + '-01-01');
    d.setUTCDate(1 - d.getUTCDay());

    let goodRingMod = 1;  //how many distinct year colors should there be?
    while (RingCalendar.getNumYears() % ++goodRingMod === 1);

    for (var h = 0; h < 54; ++h) {  //54 weeks need to be diplayed sometimes, e.g., 2028
        for (var w = 0; w < 7; ++w) {  //7 days per week
            var radius = canvas.height / 2 - RingCalendar.getRingWidth() / 2 - (h * RingCalendar.getRingWidth()) - 1;

            ctx.beginPath();
            ctx.arc(canvas.height/2, canvas.width/2, radius, (startAngle + w * RingCalendar.getWeekdayAngle()) * Math.PI / 180 - (Math.PI / 2) , (startAngle + w * RingCalendar.getWeekdayAngle() + RingCalendar.getWeekdayAngle()) * Math.PI / 180 - (Math.PI / 2));
            ctx.lineWidth = RingCalendar.getRingWidth();

            ctx.strokeStyle = `hsl(0,0%,${100 - 10 * (year % goodRingMod) - 15 * (d.getUTCMonth() % 2)}%)`;

            ctx.stroke();

            d.setUTCDate(d.getUTCDate() + 1);
        }
    }
}



function printYear(year) {
    //angle to center of year section for the given year
    var angle = RingCalendar.getIth(year) * RingCalendar.getYearAngle() +
        (3 * RingCalendar.getWeekdayAngle() + RingCalendar.getWeekdayAngleHalf());

    //Set font for years.
    ctx.font = RingCalendar.getYearFontSize() + 'px "Gill Sans MT",Arial';
    ctx.textBaseline = 'top'

    ctx.save();
    ctx.translate(canvas.height / 2, canvas.width / 2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillText(year, 0, - RingCalendar.getYearsTextRadius());
    ctx.restore();
}



function printCalendar(year) {
    //Set font for days of year.
    ctx.font = RingCalendar.getDayFontSize() + 'px "Gill Sans MT",Arial';
    ctx.textBaseline = 'bottom';
    ctx.strokeStyle = '#f00';  //for strikethrough

    var d = new Date(year + '-01-01');
    var week = 1;
    var ith = RingCalendar.getIth(year);

    do {
        var angle = RingCalendar.getYearAngle() * ith + d.getUTCDay() * RingCalendar.getWeekdayAngle() + RingCalendar.getWeekdayAngleHalf();

        ctx.save();
        ctx.translate(canvas.height / 2, canvas.width / 2);
        ctx.rotate(angle * Math.PI / 180);
        ctx.fillText(d.getUTCDate(), 0, -RingCalendar.canvasSize / 2 + 2 /*padding*/ + RingCalendar.getRingWidth() * week);
        
        if (RingCalendar.strikeout && d >= RingCalendar.startDate && d < new Date()) {
          ctx.beginPath();
          ctx.lineWidth = 2;
          
          ctx.moveTo(- (RingCalendar.canvasSize / 2 - RingCalendar.getRingWidth() * week) * Math.sin(RingCalendar.getWeekdayAngleHalf() * Math.PI / 180), -RingCalendar.canvasSize / 2 + 2 /*padding*/ + RingCalendar.getRingWidth() * (week - 1));
          ctx.lineTo((RingCalendar.canvasSize / 2 - RingCalendar.getRingWidth() * week) * Math.sin(RingCalendar.getWeekdayAngleHalf() * Math.PI / 180), -RingCalendar.canvasSize / 2 + 2 /*padding*/ + RingCalendar.getRingWidth() * week);
          ctx.stroke();
        }

        if (RingCalendar.circle && (d.toUTCString() == RingCalendar.startDate.toUTCString() || d.toUTCString() == RingCalendar.endDate.toUTCString())) {
          ctx.lineWidth = 2;
          ctx.strokeRect(
          - (RingCalendar.canvasSize / 2 - RingCalendar.getRingWidth() * week) * Math.sin(RingCalendar.getWeekdayAngleHalf() * Math.PI / 180),
          -RingCalendar.canvasSize / 2 + RingCalendar.getRingWidth() * (week - 1),
          (RingCalendar.canvasSize / 2 - RingCalendar.getRingWidth() * week) * Math.sin(RingCalendar.getWeekdayAngle() * Math.PI / 180),
          RingCalendar.getRingWidth());
        }

        ctx.restore();

        d.setUTCDate(d.getUTCDate() + 1);
        if (d.getUTCDay() === 0) {  //new week
            ++week;
        }
    } while (d.getUTCFullYear() === year);
}



function drawYear(timestamp) {
    printBackground(currentYear);
    printYear(currentYear);
    printCalendar(currentYear);
    if (currentYear++ !== RingCalendar.endDate.getFullYear()) {
        requestAnimationFrame(drawYear);
    }
}



function loadCalendar() {
    canvas.height = canvas.width = RingCalendar.canvasSize;
    //universal text properties
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentYear = RingCalendar.startDate.getFullYear();  //used by drawYears
    
    requestAnimationFrame(drawYear);
}



let currentYear;  //used by drawYears
/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('canvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
/** Start date @type {HTMLInputElement} */
const sd = document.querySelector('#sd');
/** End date @type {HTMLInputElement} */
const ed = document.querySelector('#ed');
/** Canvas size @type {HTMLInputElement} */
const cs = document.querySelector('#cs');
/** Canvas size display @type {HTMLSpanElement} */
const csv = document.querySelector('#csv');
/** Strikeout @type {HTMLInputElement} */
const so = document.querySelector('#so');
/** Circle start/end dates @type {HTMLInputElement} */
const ci = document.querySelector('#ci');
/** Generate button @type {HTMLInputElement} */
const ge = document.querySelector('#ge');
/** @type {HTMLInputElement} */
const btnMenu = document.querySelector('#btnMenu');
/** @type {HTMLDivElement} */
const menu = document.querySelector('header');

sd.value = RingCalendar.startDate.toISOString().slice(0, 10);
ed.value = RingCalendar.endDate.toISOString().slice(0, 10);
cs.value = csv.textContent = RingCalendar.canvasSize;
so.checked = RingCalendar.strikeout;
ci.checked = RingCalendar.circle;

ge.addEventListener('click', () => loadCalendar());
sd.addEventListener('change', evt => RingCalendar.startDate = new Date(evt.target.value));
ed.addEventListener('change', evt => RingCalendar.endDate = new Date(evt.target.value));
cs.addEventListener('change', evt => RingCalendar.canvasSize = csv.textContent = parseInt(evt.target.value));
so.addEventListener('change', evt => RingCalendar.strikeout = evt.target.checked);
ci.addEventListener('change', evt => RingCalendar.circle = evt.target.checked);
btnMenu.addEventListener('click', () => menu.classList.toggle('hidden'));

loadCalendar();
