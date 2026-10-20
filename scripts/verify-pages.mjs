#!/usr/bin/env node
/**
 * Verifikasi halaman LearnEase tanpa dependency.
 *
 * Jalankan Chrome headless dengan CDP (WebSocket bawaan Node 22), login sekali,
 * lalu untuk tiap rute x tema cek:
 *  - tanpa overflow horizontal (scrollWidth - clientWidth <= 1)
 *  - tanpa error console (Runtime.consoleAPICalled type "error" + exceptionThrown)
 *  - tanpa request gagal (Network.loadingFailed)
 *  - tema aktif di document.documentElement.classList
 *  - semua <img> complete && naturalWidth > 0
 *  - tidak ada elemen di <main> dengan computed font-size < 13px
 *  - tidak ada elemen fokus-able ber-class outline-none tanpa focus-visible:ring
 * Dengan --theme-switch: tiap iterasi dimulai dari tema asli aplikasi
 * (localStorage 'theme' dibersihkan lalu halaman dimuat ulang), tombol
 * tema diklik, dan di-assert classList <html> berubah, localStorage 'theme'
 * berubah ke tema lawan, dan latar <body> benar-benar berganti warna.
 * Setelah itu tema diminta dipaksa untuk screenshot dan cek lainnya.
 * Screenshot tiap rute ditulis ke <out>/<theme>-<rute>.png.
 * Screenshot tiap rute ditulis ke <out>/<theme>-<rute>.png.
 *
 * Pemakaian:
 *   node scripts/verify-pages.mjs --routes /beranda,/dasbor --theme light,dark \
 *     --out screenshots --base http://localhost:4173 --width 1440 \
 *     [--reduced-motion] [--theme-switch]
 */

import { spawn, execSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

function findChrome() {
  const list = [...CHROME_CANDIDATES];
  try {
    for (const line of execSync('where chrome', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\r?\n/)) {
      const p = line.trim();
      if (p && existsSync(p)) list.push(p);
    }
  } catch {
    /* where chrome gagal: cukup pakai kandidat di atas */
  }
  const found = list.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      'Chrome tidak ditemukan. Dicari: ' + CHROME_CANDIDATES.join(', ') + ' dan "where chrome"'
    );
  }
  return found;
}

function parseArgs(argv) {
  const args = { out: 'screenshots', base: 'http://localhost:4173', width: 1440, theme: 'light' };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, '');
    if (key === 'reduced-motion') {
      args.reducedMotion = true;
      continue;
    }
    if (key === 'theme-switch') {
      args.themeSwitch = true;
      continue;
    }
    const value = argv[++i];
    if (value === undefined) throw new Error(`Argumen --${key} butuh nilai`);
    args[key] = value;
  }
  if (!args.routes) throw new Error('Wajib: --routes /beranda,/dasbor ...');
  args.routes = args.routes.split(',').map((r) => r.trim());
  // Trim dulu baru validasi, agar "light, dark" tidak ditolak
  // dengan pesan "dapat:  dark".
  args.themes = args.theme.split(',').map((t) => t.trim());
  for (const t of args.themes) {
    if (t !== 'light' && t !== 'dark') throw new Error(`--theme hanya light/dark, dapat: ${t}`);
  }
  args.width = Number(args.width);
  return args;
}

/** Klien CDP minimal di atas WebSocket global Node 22. */
class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = [];
    ws.addEventListener('message', (e) => this.#onMessage(e));
  }

  async #onMessage(e) {
    try {
      const text =
        typeof e.data === 'string'
          ? e.data
          : e.data instanceof Blob
            ? await e.data.text()
            : Buffer.from(
                e.data instanceof ArrayBuffer ? new Uint8Array(e.data) : e.data
              ).toString('utf8');
      const msg = JSON.parse(text);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
        return;
      }
      for (const listener of this.listeners) listener(msg);
    } catch {
      /* frame non-JSON: abaikan */
    }
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    const msg = { id, method, params };
    if (sessionId) msg.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Waktu tunggu CDP habis: ${method}`));
      }, 20000);
      this.pending.set(id, {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
      this.ws.send(JSON.stringify(msg));
    });
  }

  listen(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }
}

async function connectCdp(port) {
  const res = await fetch(`http://127.0.0.1:${port}/json/version`);
  const { webSocketDebuggerUrl } = await res.json();
  const ws = new WebSocket(webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener(
      'error',
      () => reject(new Error('Gagal koneksi WebSocket CDP')),
      { once: true }
    );
  });
  return new Cdp(ws);
}

async function launchChrome() {
  // Profil browser ditempatkan di temp OS; jalur user tidak boleh dipatok.
  const tempRoot = tmpdir();
  for (let attempt = 0; attempt < 5; attempt++) {
    const port = 9300 + Math.floor(Math.random() * 900);
    const profile = mkdtempSync(path.join(tempRoot, 'learnease-verify-'));
    const chrome = spawn(
      findChrome(),
      [
        `--remote-debugging-port=${port}`,
        '--headless=new',
        `--user-data-dir=${profile}`,
        '--no-first-run',
        '--no-default-browser-check',
        'about:blank',
      ],
      { stdio: 'ignore' }
    );
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        if (res.ok) return { chrome, port, profile };
      } catch {
        /* port belum siap: coba lagi */
      }
      await delay(250);
    }
    killChrome(chrome);
    rmSync(profile, { recursive: true, force: true });
  }
  throw new Error('Chrome gagal siap setelah 5 percobaan port');
}

function killChrome(chrome) {
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${chrome.pid} /T /F`, { stdio: 'ignore' });
    } else {
      chrome.kill('SIGKILL');
    }
  } catch {
    /* sudah mati: abaikan */
  }
}

async function waitForEvent(cdp, sessionId, method, ms = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      stop();
      reject(new Error(`Waktu tunggu event ${method} habis`));
    }, ms);
    const stop = cdp.listen((msg) => {
      if (msg.sessionId !== sessionId || msg.method !== method) return;
      clearTimeout(timer);
      stop();
      resolve(msg.params);
    });
  });
}

async function evaluateJson(cdp, sessionId, expression, opts = {}) {
  const { result, exceptionDetails } = await cdp.send(
    'Runtime.evaluate',
    { expression, returnByValue: true, awaitPromise: Boolean(opts.awaitPromise) },
    sessionId
  );
  if (exceptionDetails) {
    throw new Error('Evaluate gagal: ' + JSON.stringify(exceptionDetails));
  }
  return result.value;
}

// Controlled React input butuh setter bawaan + event input agar state ikut terisi.
const FILL_LOGIN = `
  (() => {
    const setVal = (sel, val) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error('Elemen tidak ditemukan: ' + sel);
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    };
    const okU = setVal('#u', '1234567890');
    const okP = setVal('#p', 'rahasia123');
    const btn = document.querySelector('button[type="submit"]');
    if (!btn) throw new Error('Tombol submit tidak ditemukan');
    btn.click();
    return okU && okP;
  })()
`;

// Klik tombol tema dari tema ASLI aplikasi (belum dipaksa) dan ukur
// efeknya: classList <html>, localStorage 'theme', dan latar computed
// <body> sebelum vs sesudah klik.
const THEME_SWITCH = `
  (async () => {
    const btn = document.querySelector('button[aria-label^="Ganti ke mode"]');
    if (!btn) return { found: false };
    const classesBefore = [...document.documentElement.classList];
    const storedBefore = localStorage.getItem('theme');
    const bgBefore = getComputedStyle(document.body).backgroundColor;
    btn.click();
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      found: true,
      classesBefore,
      classesAfter: [...document.documentElement.classList],
      storedBefore,
      storedAfter: localStorage.getItem('theme'),
      bgChanged: getComputedStyle(document.body).backgroundColor !== bgBefore,
    };
  })()
`;

const PAGE_CHECKS = (theme) => `
  (() => {
    // Classlist SEBELUM skrip memaksa tema: kalau aplikasi sudah
    // mengatur light/dark sendiri, inilah bukti tema yang dipakai aplikasi.
    const initialClasses = [...document.documentElement.classList];
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add('${theme}');

    const smallText = [];
    for (const el of document.querySelectorAll('main, main *')) {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 13) smallText.push(el.tagName + ':' + fs + 'px');
    }

    const badFocus = [];
    for (const el of document.querySelectorAll('.outline-none')) {
      const tag = el.tagName;
      const focusable =
        tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' ||
        tag === 'SELECT' || el.tabIndex >= 0;
      if (!focusable) continue;
      if (!String(el.className).includes('focus-visible:ring')) {
        badFocus.push(tag + '(' + String(el.className).slice(0, 60) + ')');
      }
    }

    return {
      initialClasses,
      path: location.pathname,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      brokenImages: [...document.images]
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.src)
        .slice(0, 3),
      smallText: smallText.slice(0, 3),
      badFocus: badFocus.slice(0, 3),
    };
  })()
`;

// Satu navigasi + tunggu load event, dengan timeout eksplisit.
async function navigateLoad(cdp, sessionId, url) {
  const loaded = waitForEvent(cdp, sessionId, 'Page.loadEventFired', 15000);
  await cdp.send('Page.navigate', { url }, sessionId);
  await loaded;
}

// Navigasi dengan satu kali ulang bila load event tak datang.
async function navigateWithRetry(cdp, sessionId, url) {
  try {
    await navigateLoad(cdp, sessionId, url);
  } catch {
    try {
      await navigateLoad(cdp, sessionId, url);
    } catch {
      throw new Error('timeout navigasi setelah 1 percobaan ulang');
    }
  }
}

async function login(cdp, sessionId, base) {
  await navigateLoad(cdp, sessionId, base + '/login');
  await delay(300);
  await evaluateJson(cdp, sessionId, FILL_LOGIN);
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if ((await evaluateJson(cdp, sessionId, 'location.pathname')) === '/beranda') return;
    await delay(200);
  }
  throw new Error('Login tidak sampai /beranda dalam 10 detik');
}

function summarize(checks) {
  const failed = [];
  if (checks.overflow > 1) failed.push(`overflow horizontal ${checks.overflow}px`);
  if (checks.path !== checks.wantedRoute)
    failed.push(`rute berakhir ${checks.path}, diminta ${checks.wantedRoute}`);
  if (checks.consoleErrors > 0) failed.push(`${checks.consoleErrors} error console`);
  if (checks.failedRequests > 0) failed.push(`${checks.failedRequests} request gagal`);
  if (checks.brokenImages.length > 0) failed.push(`img gagal dimuat: ${checks.brokenImages.join(', ')}`);
  if (checks.smallText.length > 0) failed.push(`teks < 13px: ${checks.smallText.join(', ')}`);
  if (checks.badFocus.length > 0)
    failed.push(`outline-none tanpa focus-visible:ring: ${checks.badFocus.join(', ')}`);
  return failed;
}

async function verifyRoute(cdp, sessionId, base, route, theme, outDir, themeSwitch) {
  // /login mengalihkan pengguna yang sudah masuk ke /beranda, jadi sesi
  // disingkirkan sementara agar laman login benar-benar bisa diperiksa.
  let savedSession = null;
  if (route === '/login') {
    savedSession = await evaluateJson(cdp, sessionId, `sessionStorage.getItem('learnease_session')`);
    await evaluateJson(cdp, sessionId, `sessionStorage.removeItem('learnease_session')`);
  }
  const counters = { consoleErrors: 0, failedRequests: 0 };
  const offConsole = cdp.listen((msg) => {
    if (msg.sessionId !== sessionId) return;
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error')
      counters.consoleErrors++;
    if (msg.method === 'Runtime.exceptionThrown') counters.consoleErrors++;
    // canceled / ERR_ABORTED adalah lihat-navigasi normal: jangan dihitung.
    if (
      msg.method === 'Network.loadingFailed' &&
      !msg.params.canceled &&
      !/ERR_ABORTED/.test(msg.params.errorText || '')
    )
      counters.failedRequests++;
    if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400)
      counters.failedRequests++;
  });

  try {
    await navigateWithRetry(cdp, sessionId, base + route);
    await delay(400);

    // Dengan --theme-switch, tiap iterasi dimulai dari tema ASLI aplikasi:
    // hapus tema tersimpan (kunci 'theme' milik next-themes), muat ulang,
    // lalu klik toggel SEBELUM tema diminta dipaksa oleh PAGE_CHECKS.
    let switchCheck = null;
    if (themeSwitch) {
      await evaluateJson(cdp, sessionId, `localStorage.removeItem('theme')`);
      await navigateWithRetry(cdp, sessionId, base + route);
      await delay(400);
      switchCheck = await evaluateJson(cdp, sessionId, THEME_SWITCH, { awaitPromise: true });
    }

    const checks = await evaluateJson(cdp, sessionId, PAGE_CHECKS(theme));
    checks.consoleErrors = counters.consoleErrors;
    checks.failedRequests = counters.failedRequests;
    checks.wantedRoute = route;

    // Tema: hanya hitung saat aplikasi mengatur classList sendiri sebelum
    // skrip memaksa. Saat mode theme-switch, tema pasti dipaksa (toggle
    // sudah mengubah tema aplikasi untuk pengujian) — laporkan apa adanya.
    const opposite = theme === 'light' ? 'dark' : 'light';
    let themeNote;
    let themeMismatch = false;
    if (themeSwitch) {
      themeNote = 'tema dipaksa untuk verifikasi (toggle diuji sebelum dipaksa)';
    } else if (checks.initialClasses.includes(theme)) {
      themeNote = 'tema dari aplikasi (terverifikasi)';
    } else if (checks.initialClasses.includes(opposite)) {
      themeMismatch = true;
      themeNote = 'tema aplikasi tidak cocok';
    } else {
      themeNote = 'tema dipaksa (aplikasi belum mengatur tema)';
    }

    const failed = summarize(checks);
    if (themeMismatch) failed.unshift(`dokumen ber-theme ${opposite}, diminta ${theme}`);
    const png = await cdp.send('Page.captureScreenshot', { format: 'png' }, sessionId);
    const slug = route.replace(/^\//, '').replace(/\//g, '-') || 'root';
    writeFileSync(path.join(outDir, `${theme}-${slug}.png`), Buffer.from(png.data, 'base64'));

    // Hasil toggel diukur dari keadaan asli aplikasi (sebelum dipaksa),
    // jadi perubahan classList, localStorage, dan latar benar-benar
    // berasal dari klik tombol, bukan dari pemaksaan tema.
    if (switchCheck) {
      if (!switchCheck.found) {
        failed.push('tombol tema tidak ditemukan');
      } else {
        const themeBefore = switchCheck.classesBefore.includes('dark') ? 'dark' : 'light';
        const expectedAfter = themeBefore === 'dark' ? 'light' : 'dark';
        if (switchCheck.classesBefore.join(',') === switchCheck.classesAfter.join(','))
          failed.push(`classList <html> tidak berubah saat klik toggel: ${switchCheck.classesBefore}`);
        if (!switchCheck.classesAfter.includes(expectedAfter))
          failed.push(`classList <html> tidak memuat '${expectedAfter}' setelah klik: ${switchCheck.classesAfter}`);
        if (switchCheck.storedAfter !== expectedAfter)
          failed.push(`localStorage theme '${switchCheck.storedAfter}', diharapkan '${expectedAfter}'`);
        if (!switchCheck.bgChanged) failed.push('latar <body> tidak berubah antar tema');
      }
    }

    const status = failed.length === 0 ? 'LOLOS' : 'GAGAL';
    console.log(
      `[${status}] ${theme} ${route} (${checks.path}) — ${themeNote}` +
        (failed.length ? ' | ' + failed.join(' | ') : '')
    );
    return { route, theme, ok: failed.length === 0 };
  } catch (e) {
    // Screenshot saat jalur bermasalah: justru saat paling dicari.
    try {
      const png = await cdp.send('Page.captureScreenshot', { format: 'png' }, sessionId);
      const slug = route.replace(/^\//, '').replace(/\//g, '-') || 'root';
      writeFileSync(path.join(outDir, `${theme}-${slug}.png`), Buffer.from(png.data, 'base64'));
    } catch {
      /* screenshot gagal juga: abaikan, status rute sudah GAGAL */
    }
    console.log(`[GAGAL] ${theme} ${route} — ${e.message}`);
    return { route, theme, ok: false };
  } finally {
    offConsole();
    if (savedSession !== null) {
      // Kembalikan sesi (sessionStorage bertahan lintas muatan di tab yang
      // sama), supaya rute terlindungi setelah ini tetap terbuka.
      try {
        await evaluateJson(
          cdp,
          sessionId,
          `sessionStorage.setItem('learnease_session', ${JSON.stringify(savedSession)})`
        );
      } catch {
        /* pemulihan sesi gagal: rute berikut akan lari ke /login */
      }
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(args.out);
  mkdirSync(outDir, { recursive: true });
  const { chrome, port, profile } = await launchChrome();
  let exitCode = 0;
  try {
    const cdp = await connectCdp(port);
    try {
      const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
      const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
      await cdp.send('Page.enable', {}, sessionId);
      await cdp.send('Runtime.enable', {}, sessionId);
      await cdp.send('Network.enable', {}, sessionId);
      await cdp.send(
        'Emulation.setDeviceMetricsOverride',
        { width: args.width, height: 900, deviceScaleFactor: 1, mobile: false },
        sessionId
      );
      if (args.reducedMotion) {
        await cdp.send(
          'Emulation.setEmulatedMedia',
          { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] },
          sessionId
        );
      }

      await login(cdp, sessionId, args.base);

      const results = [];
      for (const theme of args.themes) {
        for (const route of args.routes) {
          results.push(await verifyRoute(cdp, sessionId, args.base, route, theme, outDir, args.themeSwitch));
        }
      }
      const passed = results.filter((r) => r.ok).length;
      console.log(`\nRingkasan: ${passed}/${results.length} kombinasi rute-tema lolos.`);
      if (passed !== results.length) exitCode = 1;
    } finally {
      cdp.ws.close();
    }
  } finally {
    killChrome(chrome);
    await delay(200);
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {
      /* profil basi dibersihkan OS */
    }
  }
  process.exit(exitCode);
}

main().catch((err) => {
  console.error('VERIFY GAGAL:', err.message);
  process.exit(1);
});
