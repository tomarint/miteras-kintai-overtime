(function () {
  'use strict';
  function isNumeric(c: string): boolean {
    return c >= '0' && c <= '9';
  }
  function parse_hhmm(s: string): number {
    if (s.length != 5 || s[2] != ':') {
      return 0;
    }
    if (!isNumeric(s[0]) || !isNumeric(s[1]) || !isNumeric(s[3]) || !isNumeric(s[4])) {
      return 0;
    }
    const hour = parseInt(s[0]) * 10 + parseInt(s[1]);
    const min = parseInt(s[3]) * 10 + parseInt(s[4]);
    return hour * 60 + min;
  }
  function hhmm(minute: number): string {
    let sign = '';
    if (minute < 0) {
      minute = -minute;
      sign = '-';
    }
    const m = minute % 60;
    const h = (minute - m) / 60;
    return `${sign}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
  // Show cumulative overtime hours
  function showCumulativeOvertimeHours() {
    // console.log("location.href:", location.href);
    if (!location.href.endsWith("/work-condition")) {
      return;
    }
    //
    // Add the header of the table
    //
    const head_tr = document.querySelector("#monthly-view-attendance-content > table > tbody > tr");
    if (head_tr == null) {
      return;
    }
    const head_th = head_tr.querySelector("th:nth-child(13)");
    if (head_th == null) {
      return;
    }
    const overtime = head_th.querySelector("div > span");
    if (overtime == null) {
      return;
    }
    if (overtime.textContent !== "残業") {
      console.log("overtime.textContent:", overtime.textContent);
      console.log("Unknown overtime format.")
      return;
    }
    //
    // Add a new column of the head of the table
    //
    let new_th = head_th.cloneNode(true) as Element;
    head_tr.appendChild(new_th);
    const new_overtime = new_th.querySelector("div > span");
    if (new_overtime == null) {
      return;
    }
    new_overtime.textContent = "累計残業";

    //
    // Add a new column of the body of the table
    //
    const tbody = document.querySelector("#attendance-table-body > table > tbody");
    if (tbody == null) {
      return;
    }
    const trs = tbody.querySelectorAll("tr");
    if (trs == null) {
      return;
    }
    let cum_min = 0;
    trs.forEach(tr => {
      const new_td = document.createElement("td");
      new_td.className = "table01__cell--time";

      // 種別
      let text = tr.querySelector("td.table01__cell--cate > div")?.textContent;
      if (text == null) {
        return;
      }
      const worktype = text.trim();

      // 勤務合計
      text = tr.querySelector("td:nth-child(16)")?.textContent;
      if (text == null) {
        return;
      }
      const worktime_min = parse_hhmm(text);
      let overtime_min = 0;
      if (worktime_min === 0) {
        if (worktype === "全休(代休)") {
          overtime_min = -8 * 60;
        }
      }
      else {
        if (worktype === "所定休日出勤") {
          overtime_min = worktime_min;
        } else {
          overtime_min = worktime_min - 8 * 60;
        }
      }

      if (worktime_min === 0 && overtime_min === 0) {
        new_td.innerText = "-";
      } else {
        cum_min += overtime_min;
        const cum_str = hhmm(cum_min);
        new_td.innerText = cum_str;
      }
      // console.log("worktype:", worktype, "worktime_min:", worktime_min, "overtime_min:", overtime_min, "cum_min:", cum_min)
      tr.appendChild(new_td);
    });
  }
  showCumulativeOvertimeHours();
})();
