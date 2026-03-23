// popup.js ────────────────────────────────────────────────────────────────
// Updated 2026:
// • Age 18–60 restriction (birth years 1966–2008)
// • Realistic early sequence: females 0001–0200 / males 5001–5200 per day
// • Gender-aware first names (≈50/50)
// • LottoStar one-click full generation & autofill
// • Hollywoodbets ID + FirstName + LastName fill
// • Site selector + unified "Auto-Fill Selected Site" button
// ──── NAME LISTS ────────────────────────────────────────────────────────────
// (unchanged – keeping your lists)

const YOUNG_MALE = [
  "Lethabo", "Lubanzi", "Junior", "Siyabonga", "Bandile", "Bokamoso", "Mpho",
  "Nkazimulo", "Lesedi", "Siphosethu", "Leano", "Omphile", "Ayanda", "Andile",
  "Jabulani", "Sibusiso", "Langelihle", "Blessing", "Prince", "Gift", "Thabo",
  "Kagiso", "Karabo", "Refiloe", "Katlego"
];

const YOUNG_FEMALE = [
  "Melokuhle", "Enzokuhle", "Amogelang", "Onalerona", "Zanokuhle", "Iminathi",
  "Amahle", "Thandolwethu", "Rethabile", "Luthando", "Zinhle", "Thandeka",
  "Nkanyezi", "Precious", "Lerato", "Nomthandazo", "Kgomotso", "Nthabiseng",
  "Palesa", "Dineo", "Keitumetse", "Boitumelo"
];

const MIDDLE_MALE = [
  "Thabo", "Sipho", "Bongani", "Dumisani", "Mandla", "Themba", "David", "Michael",
  "John", "Paul", "Peter", "Francois", "Gerhard", "Riaan", "Stefan", "Willem",
  "Dirk", "Christiaan", "Jacob", "Pieter", "Johan", "Petrus", "Hendrik", "Samuel",
  "Joseph", "Moses", "Aaron", "Isaac"
];

const MIDDLE_FEMALE = [
  "Zanele", "Nomusa", "Busisiwe", "Khanyisile", "Sarah", "Lisa", "Michelle",
  "Sophia", "Anna", "Maria", "Elizabeth", "Grace", "Faith", "Mercy", "Beauty",
  "Joyce", "Martha", "Esther", "Rebecca", "Rachel", "Ruth", "Naomi"
];

const SURNAMES = [
  "Dlamini","Nkosi","Ndlovu","Khumalo","Sithole","Mthembu","Mokoena","Botha",
  "Van der Merwe","Smith","Jacobs","Fourie","Kruger","Nel","Grobler","Coetzee",
  "Du Plessis","Du Toit","Le Roux","Louw","Mabena","Malan","Mazibuko","Moloi",
  "Mthethwa","Naidoo","Ngcobo","Pillay","Pretorius","Van Wyk","Williams","Zulu",
  "Mhlanga","Mnguni","Mofokeng","Molefe","Moyo","Ngwenya","Nkomo","Ntuli",
  "Phiri","Radebe","Shabangu","Sibiya","Tshabalala","Van Niekerk","Visser",
  "Wessels","Abrahams","Adams","Brown","Clarke","Davids","De Wet","Erasmus",
  "Fisher","Gouws","Harris","Isaacs","Jansen","Khan","Lombard","Marais",
  "Olivier","Patel","Peters","Raj","Singh","Thomas","Van Rooyen","Wilson",
  "Young","Gumede","Mkhize","Cele","Dube","Hlongwane","Mashaba","Ncube",
  "Zondi","Bhengu"
];

// ──── GENERATORS ─────────────────────────────────────────────────────────────

function randomName(birthYear = null) {
  const currentYear = new Date().getFullYear();
  let age;
  if (birthYear === null) {
    age = Math.floor(Math.random() * 43) + 18; // 18–60
    birthYear = currentYear - age;
  } else {
    age = currentYear - birthYear;
    if (age < 18 || age > 60) age = 35; // fallback
  }

  const isMale = Math.random() < 0.5;
  let pool;
  if (age <= 35) {
    pool = isMale ? YOUNG_MALE : YOUNG_FEMALE;
  } else {
    pool = isMale ? MIDDLE_MALE : MIDDLE_FEMALE;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

function randomSurname() {
  return SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
}

function randomMobile() {
  const prefixes = ["060","061","062","063","064","065","066","067","068","069",
                    "071","072","073","074","076","078","079","081","082","083","084"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const rest = String(Math.floor(Math.random() * 10000000)).padStart(7, "0");
  return prefix + rest;
}

function randomUsername() {
  let base = (document.getElementById("genName")?.value || "user") +
             (document.getElementById("genSurname")?.value || "test");
  base = base.replace(/\s/g, '').toLowerCase();
  return base + Math.floor(Math.random() * 900 + 100);
}

function randomPassword(length = 14) {
  const lc = "abcdefghijklmnopqrstuvwxyz";
  const uc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const dg = "23456789";
  const sp = "!@#$%^&*()_+-=[]{}|;:,.<>?/~";
  let pw = [
    lc[Math.floor(Math.random() * lc.length)],
    uc[Math.floor(Math.random() * uc.length)],
    dg[Math.floor(Math.random() * dg.length)],
    sp[Math.floor(Math.random() * sp.length)]
  ];
  const all = lc + uc + dg + sp;
  while (pw.length < length) {
    pw.push(all[Math.floor(Math.random() * all.length)]);
  }
  return pw.sort(() => Math.random() - 0.5).join('');
}

function randomEmail() {
  let base = (document.getElementById("genName")?.value || "user") +
             (document.getElementById("genSurname")?.value || "test");
  base = base.replace(/\s/g, '').toLowerCase();
  return base + Math.floor(Math.random() * 900 + 100) + "@gmail.com";
}

function luhnCheck(id) {
  let sum = 0;
  let alt = false;
  for (let i = id.length - 1; i >= 0; i--) {
    let n = parseInt(id.charAt(i), 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function generateID() {
  const minYear = 1966;
  const maxYear = 2008;
  const birthYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  const yy = String(birthYear % 100).padStart(2, "0");

  const mm = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const dd = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0"); // safe approximation

  const isFemale = Math.random() < 0.5;

  let seqNum;
  if (isFemale) {
    seqNum = Math.floor(Math.random() * 200) + 1;          // 1 → 200
  } else {
    seqNum = Math.floor(Math.random() * 200) + 5001;       // 5001 → 5200
  }
  const seq = String(seqNum).padStart(4, "0");

  const middle = "08"; // citizenship 0 + old race digit 8 (common)

  let candidate = null;
  for (let check = 0; check <= 9; check++) {
    const test = yy + mm + dd + seq + middle + check;
    if (luhnCheck(test)) {
      candidate = test;
      break;
    }
  }

  // Very rare → no valid check digit found in 0-9 (statistically almost impossible)
  if (!candidate) {
    console.warn("No valid Luhn check digit found – retrying internally");
    return generateID(); // simple recursive retry (max depth negligible)
  }

  return { id: candidate, birthYear, isFemale };
}

// ──── UTILITY ───────────────────────────────────────────────────────────────

function getSelectedTabId() {
  const s = document.getElementById("tabSelect");
  return s && s.value ? parseInt(s.value, 10) : null;
}

function showStatus(message, type = "success") {
  const el = document.getElementById("statusMessage");
  if (!el) return;
  el.textContent = message;
  el.className = type;
  setTimeout(() => { el.textContent = ""; el.className = ""; }, 6000);
}

// ──── MAIN ──────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Populate tab selector
  chrome.tabs.query({}, tabs => {
    const sel = document.getElementById("tabSelect");
    if (!sel) return;
    tabs.forEach(tab => {
      if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("chrome-extension://")) {
        const opt = document.createElement("option");
        opt.value = tab.id;
        opt.textContent = `${tab.title || "(no title)"} — ${new URL(tab.url).hostname}`;
        sel.appendChild(opt);
      }
    });
  });

  // ── Element references ────────────────────────────────────────────────────
  const els = {
    name:     document.getElementById('genName'),
    surname:  document.getElementById('genSurname'),
    number:   document.getElementById('genNumber'),
    username: document.getElementById('genUsername'),
    password: document.getElementById('genPassword'),
    email:    document.getElementById('genEmail'),
    id:       document.getElementById('genID'),
    status:   document.getElementById('genStatus')
  };

  // ── Simple generator buttons ──────────────────────────────────────────────
  document.getElementById('btnName')    ?.addEventListener("click", () => els.name.value    = randomName());
  document.getElementById('btnSurname') ?.addEventListener("click", () => els.surname.value = randomSurname());
  document.getElementById('btnNumber')  ?.addEventListener("click", () => els.number.value  = randomMobile());
  document.getElementById('btnUsername')?.addEventListener("click", () => els.username.value= randomUsername());
  document.getElementById('btnPassword')?.addEventListener("click", () => els.password.value= randomPassword());
  document.getElementById('btnEmail')   ?.addEventListener("click", () => els.email.value   = randomEmail());

  // ── Generate full ID + age-matched name (now with realistic seq range) ─────
  document.getElementById('btnID')?.addEventListener("click", () => {
    const res = generateID();
    els.id.value = res.id;
    els.name.value = randomName(res.birthYear);
    els.surname.value = randomSurname();
    if (els.status) {
      els.status.value = luhnCheck(res.id) ? "✅ Verified" : "❌ Failed";
    }
  });

  // Quick toggle last digit (for testing)
  document.getElementById('btnT')?.addEventListener("click", () => {
    let v = els.id.value?.trim();
    if (v?.length !== 13) return;
    let last = parseInt(v.slice(-1), 10);
    last = (last + 1) % 10;
    els.id.value = v.slice(0, -1) + last;
    if (els.status) {
      els.status.value = luhnCheck(els.id.value) ? "✅ Verified" : "❌ Failed";
    }
  });

  document.getElementById('btnValidateID')?.addEventListener("click", () => {
    if (els.status) {
      els.status.value = luhnCheck(els.id.value) ? "✅ Verified" : "❌ Failed";
    }
  });

  // Auto-update name/surname when valid ID is pasted/changed
  els.id?.addEventListener("change", () => {
    const val = els.id.value?.trim();
    if (val?.length !== 13 || !luhnCheck(val)) return;

    const yy = parseInt(val.substring(0, 2), 10);
    const yob = (yy <= 26) ? 2000 + yy : 1900 + yy;
    const age = new Date().getFullYear() - yob;

    if (age >= 18 && age <= 60) {
      els.name.value = randomName(yob);
      els.surname.value = randomSurname();
    }
  });

  // ── LottoStar one-click generate + autofill ───────────────────────────────
  document.getElementById("genAndFillLottoStar")?.addEventListener("click", () => {
    const tabId = getSelectedTabId();
    if (!tabId) return showStatus("No tab selected", "error");

    const res = generateID();
    const id = res.id;
    const fname = randomName(res.birthYear);
    const lname = randomSurname();
    const mobileFull = randomMobile();
    const mobile9 = mobileFull.substring(1); // usually 9 digits for field
    const email = randomEmail();
    const pass = randomPassword();

    chrome.tabs.sendMessage(tabId, {
      action: "fillLottoStarFields",
      data: {
        id_number:  id,
        mobile:     mobile9,
        email:      email,
        password:   pass,
        firstname:  fname,
        lastname:   lname
      }
    }, resp => {
      if (chrome.runtime.lastError) {
        showStatus("Fill failed: " + chrome.runtime.lastError.message, "error");
        return;
      }
      showStatus("LottoStar fields filled", "success");

      // Mirror in popup UI
      els.id.value       = id;
      els.name.value     = fname;
      els.surname.value  = lname;
      els.number.value   = mobileFull;
      els.email.value    = email;
      els.password.value = pass;
      if (els.status) els.status.value = "✅ Verified";
    });
  });

  // ── Hollywoodbets fill (ID + FirstName + LastName) ────────────────────────
  document.getElementById("fillHollywoodbets")?.addEventListener("click", () => {
    const tabId = getSelectedTabId();
    if (!tabId) return showStatus("No tab selected", "error");

    const id    = els.id.value?.trim();
    const fname = els.name.value?.trim();
    const lname = els.surname.value?.trim();

    if (!id || id.length !== 13 || !luhnCheck(id)) {
      return showStatus("Valid 13-digit ID required", "error");
    }
    if (!fname || !lname) {
      return showStatus("First & Last name required", "error");
    }

    chrome.tabs.sendMessage(tabId, {
      action: "fillHollywoodbetsFields",
      data: {
        identityNumber: id,
        firstName:      fname,
        lastName:       lname
      }
    }, resp => {
      if (chrome.runtime.lastError || !resp?.success) {
        showStatus("Fill failed – check page", "error");
      } else {
        showStatus("Hollywoodbets ID + names filled", "success");
      }
    });
  });

  // ── Unified autofill button using site dropdown ───────────────────────────
  document.getElementById("autoFillCurrentSite")?.addEventListener("click", () => {
    const site = document.getElementById("siteSelector")?.value;
    if (site === "lottostar") {
      document.getElementById("genAndFillLottoStar")?.click();
    } else if (site === "hollywoodbets") {
      document.getElementById("fillHollywoodbets")?.click();
    } else {
      showStatus("No site selected", "error");
    }
  });

  // ── Claim 2 logic (your original – kept as-is) ────────────────────────────
  const STORAGE_KEYS = {
    CLAIM2_AMOUNT:  "claim2Amount",
    CLAIM2_ACTIVE:  "claim2Active",
    CLAIM2_POSITION:"claim2Position"
  };

  const claim2AmountInput = document.getElementById("claim2AMOUNT");
  const claim2SetBtn      = document.getElementById("BNclaim2Set");
  const claim2InjectBtn   = document.getElementById("BNclaim2Inject");
  const claim2Toggle      = document.getElementById("toggleClaim2");
  const claim2SetPosBtn   = document.getElementById("claim2SetBN");

  // Load saved values
  chrome.storage.local.get(Object.values(STORAGE_KEYS), data => {
    if (data[STORAGE_KEYS.CLAIM2_AMOUNT])  claim2AmountInput.value = data[STORAGE_KEYS.CLAIM2_AMOUNT];
    if (data[STORAGE_KEYS.CLAIM2_ACTIVE] !== undefined) {
      claim2Toggle.checked = !!data[STORAGE_KEYS.CLAIM2_ACTIVE];
    }
  });

  claim2SetBtn?.addEventListener("click", () => {
    const amt = claim2AmountInput.value.trim();
    if (amt) {
      chrome.storage.local.set({ [STORAGE_KEYS.CLAIM2_AMOUNT]: amt });
      showStatus("Claim 2 amount saved");
    } else {
      showStatus("Enter amount", "error");
    }
  });

  claim2InjectBtn?.addEventListener("click", () => {
    const tabId = getSelectedTabId();
    if (!tabId) return showStatus("Select tab", "error");
    chrome.scripting.executeScript({ target: { tabId }, files: ["claim2.js"] });
    showStatus("claim2.js injected");
  });

  claim2Toggle?.addEventListener("change", () => {
    chrome.storage.local.set({ [STORAGE_KEYS.CLAIM2_ACTIVE]: claim2Toggle.checked });
    showStatus(`Claim 2 ${claim2Toggle.checked ? "enabled" : "disabled"}`);
  });

  claim2SetPosBtn?.addEventListener("click", () => {
    const idx = prompt("Button index (0 = first, 1 = second, ...):");
    if (idx !== null && !isNaN(idx) && idx >= 0) {
      chrome.storage.local.set({ [STORAGE_KEYS.CLAIM2_POSITION]: parseInt(idx, 10) });
      showStatus(`Position set to ${idx}`);
    }
  });

  // ── End of file ────────────────────────────────────────────────────────────
});