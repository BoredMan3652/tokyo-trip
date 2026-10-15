/**
 * Trip Dashboard – Google Sheet sync
 * วิธีใช้: Google Sheet > ส่วนขยาย > Apps Script > วางโค้ดนี้ > บันทึก
 *        > ทำให้ใช้งานได้ > การทำให้ใช้งานได้รายการใหม่ > เว็บแอป
 *          ดำเนินการในฐานะ: ฉัน | ผู้มีสิทธิ์เข้าถึง: ทุกคน
 * แล้วนำ URL ที่ลงท้ายด้วย /exec ไปวางในหน้า "ตั้งค่า" ของแอป
 */

// รหัสลับ (ต้องตรงกับช่อง "รหัสลับ" ในแอป) ปล่อยว่างได้ถ้าไม่ต้องการ
const SECRET = '';

const EXP = 'Expenses';
const LOC = 'Locations';
const EXP_HEAD = ['id', 'วันที่-เวลา', 'วันที่ทริป', 'จำนวนเงิน', 'สกุลเงิน', 'เทียบบาท', 'หมวด', 'ชำระด้วย', 'รายละเอียด', 'lat', 'lng', 'อัปเดตล่าสุด'];
const LOC_HEAD = ['เวลา', 'วันที่ทริป', 'lat', 'lng', 'ความแม่นยำ (ม.)', 'แผนที่'];

function sheet_(name, head) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(head);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, head.length).setFontWeight('bold').setBackground('#e8ecf6');
  }
  return sh;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function ids_(sh) {
  const n = sh.getLastRow() - 1;
  return n > 0 ? sh.getRange(2, 1, n, 1).getValues().map(function (r) { return String(r[0]); }) : [];
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (SECRET && d.key !== SECRET) return out_({ ok: false, error: 'รหัสลับไม่ถูกต้อง' });

    if (d.action === 'upsert') {
      const sh = sheet_(EXP, EXP_HEAD);
      const ids = ids_(sh);
      d.items.forEach(function (x) {
        const row = [x.id, new Date(x.ts), x.day, x.amount, x.cur, x.thb, x.cat, x.pay, x.note, x.lat || '', x.lng || '', new Date()];
        const i = ids.indexOf(String(x.id));
        if (i >= 0) sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
        else { sh.appendRow(row); ids.push(String(x.id)); }
      });
      return out_({ ok: true, n: d.items.length });
    }

    if (d.action === 'delete') {
      const sh = sheet_(EXP, EXP_HEAD);
      const ids = ids_(sh);
      for (let i = ids.length - 1; i >= 0; i--) {
        if (d.ids.indexOf(ids[i]) >= 0) sh.deleteRow(i + 2);
      }
      return out_({ ok: true });
    }

    if (d.action === 'loc') {
      const sh = sheet_(LOC, LOC_HEAD);
      const rows = d.items.map(function (p) {
        return [new Date(p.ts), p.day, p.lat, p.lng, Math.round(p.acc || 0), 'https://maps.google.com/?q=' + p.lat + ',' + p.lng];
      });
      if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
      return out_({ ok: true, n: rows.length });
    }

    return out_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (SECRET && (!e.parameter || e.parameter.key !== SECRET)) return out_({ ok: false, error: 'รหัสลับไม่ถูกต้อง' });
  const sh = sheet_(EXP, EXP_HEAD);
  const n = sh.getLastRow() - 1;
  const vals = n > 0 ? sh.getRange(2, 1, n, EXP_HEAD.length).getValues() : [];
  const items = vals.map(function (r) {
    return {
      id: String(r[0]), ts: new Date(r[1]).getTime(), day: r[2], amount: Number(r[3]), cur: r[4],
      thb: Number(r[5]), cat: r[6], pay: r[7], note: r[8], lat: r[9], lng: r[10]
    };
  });
  return out_({ ok: true, items: items });
}
