/**
 * GitHub Activity Pulse Bot (Hyper-Random & Anti-Repetitive)
 * 
 * Target: 
 * - Acak antara 3 - 17 commit per hari (kebanyakan hari)
 * - Kemungkinan kecil hanya 1 atau 2 commit (hari santai/minimal)
 * - Kemungkinan sangat kecil 0 commit sama sekali (off-day / libur alami)
 * - Waktu & jeda acak alami (menghindari pola jam kaku/robotik)
 * - Pesan commit berbasis combinatorial engine dengan proteksi anti-repetisi 80 commit terakhir
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const LOG_FILE = path.join(__dirname, 'activity.log');

// Identitas Git
const GIT_NAME = process.env.GIT_NAME || 'radityabhardana';
const GIT_EMAIL = process.env.GIT_EMAIL || 'rexnabagus@gmail.com';
const FORCE_COMMIT = process.env.FORCE_COMMIT === 'true' || process.argv.includes('--force');
const DRY_RUN = process.argv.includes('--dry-run');

// --- Engine Generator Pesan Commit yang Sangat Variatif ---
const COMMIT_TYPES = ['feat', 'fix', 'refactor', 'perf', 'docs', 'chore', 'style', 'test', 'ci', 'build'];

const COMMIT_SCOPES = [
  'core', 'api', 'auth', 'cache', 'logger', 'db', 'config', 'utils',
  'worker', 'session', 'router', 'metrics', 'events', 'queue', 'storage',
  'middleware', 'security', 'types', 'parser', 'stream', 'telemetry',
  'pipeline', 'health', 'crypto', 'scheduler', 'state', 'network', 'cli',
  'context', 'engine'
];

const COMMIT_VERBS = [
  'optimize', 'refactor', 'clean up', 'enhance', 'streamline', 'resolve',
  'handle', 'update', 'synchronize', 'calibrate', 'improve', 'standardize',
  'patch', 'fine-tune', 'adjust', 'modularize', 'reorganize', 'bump',
  'validate', 'sanitize', 'isolate', 'unify', 'deduplicate', 'throttle',
  'migrate', 'audit', 'consolidate'
];

const COMMIT_SUBJECTS = [
  'internal query latency buffer',
  'worker execution thread pool',
  'session token rotation lifecycle',
  'cache invalidation strategy for stale keys',
  'event loop lag threshold alert',
  'exponential backoff retry routine',
  'request payload schema constraints',
  'graceful process termination handler',
  'in-memory LRU cache eviction boundary',
  'micro-task execution sequence',
  'health heartbeat telemetry payload',
  'cross-service dependency tree',
  'stream chunk compression pipeline',
  'runtime boundary exception interceptor',
  'idle database pool connection cleanup',
  'distributed lock acquisition timeout',
  'heap memory footprint in batch worker',
  'environment variable configuration fallback',
  'network socket keep-alive ping interval',
  'timestamp normalization in ISO-8601 parser',
  'file descriptor cleanup in temporary directory',
  'unhandled rejection safety wrapper',
  'cryptographic entropy generator for tokens',
  'queue backpressure threshold calculations',
  'pipeline failure recovery hook',
  'deadlock avoidance logic in state store',
  'request throttling window calculations',
  'HTTP header validation against RFC spec',
  'circuit breaker trip recovery timer',
  'diagnostic log formatter and colorizer',
  'JSON serialization throughput for large payloads',
  'batch insert chunk size parameter',
  'binary protocol frame delimiter parsing',
  'memory leak detection in long-running tasks',
  'event emitter listener leak prevention',
  'structured error response mapping',
  'DNS resolution retry timeout duration',
  'disk write buffer flush intervals',
  'connection pool connection recycling interval',
  'rate limiter sliding window algorithm',
  'asynchronous task cancellation tokens',
  'log rotation policy and archive compression',
  'runtime environment diagnostic reporting',
  'secure random nonce generation'
];

const CURATED_MESSAGES = [
  'chore: routine system telemetry pulse',
  'docs: update developer setup and integration guide',
  'style: align code formatting with updated linter rules',
  'perf: reduce garbage collector overhead during peak load',
  'refactor: extract redundant configuration parser',
  'test: add regression test cases for edge-case handlers',
  'ci: optimize workflow cache hit ratio',
  'fix: resolve race condition in concurrent task runner',
  'feat: implement adaptive backoff for network requests',
  'chore(deps): update runtime dependency pins',
  'docs: expand architecture overview diagram',
  'feat(metrics): register custom gauge for memory footprint',
  'perf(db): streamline index lookup execution plan',
  'refactor(core): decouple event dispatcher from logger',
  'build: configure reproducible build metadata'
];

const SUBSYSTEMS = [
  'core-engine', 'cache-worker', 'api-gateway', 'telemetry-pulse',
  'session-mgr', 'db-pool', 'queue-consumer', 'scheduler-cron',
  'metrics-collector', 'stream-processor'
];

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    console.error(`Error executing: ${command}`);
    console.error(error.stderr ? error.stderr.toString() : error.message);
    throw error;
  }
}

// Synchronous sleep natively without external packages
function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// Format waktu WIB (Asia/Jakarta)
function getWibDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function getWibHour(date = new Date()) {
  const hourStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: 'numeric',
    hour12: false
  }).format(date);
  return parseInt(hourStr, 10);
}

function getWibFormatted(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date);

  const map = {};
  for (const p of parts) map[p.type] = p.value;
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second} WIB`;
}

// Hitung berapa kali commit yang sudah dicatat hari ini di activity.log
function getTodayCommitCount(todayStr) {
  if (!fs.existsSync(LOG_FILE)) return 0;
  const content = fs.readFileSync(LOG_FILE, 'utf-8');
  const lines = content.split('\n');
  let count = 0;
  for (const line of lines) {
    if (line.includes(`[${todayStr}]`)) {
      count++;
    }
  }
  return count;
}

/**
 * Tentukan target harian secara deterministik per tanggal (YYYY-MM-DD).
 * Ini memastikan target hari ini konsisten dari jam 00:00 sampai 23:59 WIB.
 * 
 * Distribusi:
 * - ~1.8% chance: 0 commit (Total Off-day / libur alami)
 * - ~3.0% chance: 1 commit (Hari minimal/santai)
 * - ~3.2% chance: 2 commit (Hari ringan)
 * - ~92%  chance: Acak alami antara 3 sampai 17 commit (3 - 17)
 */
function getDailyProfile(todayStr) {
  // Hash unik berbasis tanggal
  const hash = crypto.createHash('sha256').update(`pulse-v2-${todayStr}`).digest('hex');
  const seedNum = parseInt(hash.substring(0, 8), 16) / 0xffffffff;

  let target;
  let category;

  if (seedNum < 0.018) {
    target = 0; // Off-day
    category = 'OFF_DAY (0 commit)';
  } else if (seedNum < 0.048) {
    target = 1; // 1 commit
    category = 'MINIMAL_DAY (1 commit)';
  } else if (seedNum < 0.080) {
    target = 2; // 2 commit
    category = 'LIGHT_DAY (2 commit)';
  } else {
    // 3 - 17 commit (15 nilai: 3, 4, 5, ..., 17)
    const normalized = (seedNum - 0.080) / 0.920;
    target = Math.floor(normalized * 15) + 3;
    category = `STANDARD_ACTIVE_DAY (${target} commit)`;
  }

  return { target, category, seedHash: hash.substring(0, 8) };
}

// Ambil riwayat commit terakhir untuk mencegah duplikasi pesan
function getRecentCommitMessages(limit = 80) {
  try {
    const raw = runCommand(`git log -n ${limit} --pretty=format:"%s"`);
    if (!raw) return new Set();
    return new Set(raw.split('\n').map(s => s.trim()));
  } catch {
    return new Set();
  }
}

// Buat pesan commit unik dengan combinatorial engine
function generateUniqueCommitMessage(recentMessages) {
  for (let attempt = 0; attempt < 50; attempt++) {
    let msg = '';
    
    // 15% kemungkinan mengambil pesan terkurasi
    if (Math.random() < 0.15) {
      msg = CURATED_MESSAGES[Math.floor(Math.random() * CURATED_MESSAGES.length)];
    } else {
      const type = COMMIT_TYPES[Math.floor(Math.random() * COMMIT_TYPES.length)];
      const useScope = Math.random() < 0.70; // 70% gunakan scope
      const scope = useScope ? `(${COMMIT_SCOPES[Math.floor(Math.random() * COMMIT_SCOPES.length)]})` : '';
      const verb = COMMIT_VERBS[Math.floor(Math.random() * COMMIT_VERBS.length)];
      const subject = COMMIT_SUBJECTS[Math.floor(Math.random() * COMMIT_SUBJECTS.length)];
      msg = `${type}${scope}: ${verb} ${subject}`;
    }

    if (!recentMessages.has(msg)) {
      recentMessages.add(msg);
      return msg;
    }
  }

  // Fallback jika tabrakan (sangat kecil kemungkinannya)
  const salt = crypto.randomBytes(2).toString('hex');
  return `chore(pulse): calibrate runtime metric telemetry buffer #${salt}`;
}

// Catat heartbeat ke activity.log
function recordHeartbeat(index, totalBatch, todayCount, commitMsg) {
  const now = new Date();
  const isoTime = now.toISOString();
  const wibFormatted = getWibFormatted(now);
  const todayStr = getWibDate(now);
  const pulseHash = crypto.randomBytes(4).toString('hex');
  const subsystem = SUBSYSTEMS[Math.floor(Math.random() * SUBSYSTEMS.length)];
  const latency = (Math.random() * 25 + 5).toFixed(2);
  const heap = (Math.random() * 30 + 15).toFixed(1);

  const logEntry = `[${todayStr}] [${wibFormatted} / ${isoTime}] [pulse:${pulseHash}] [sys:${subsystem}] Commit #${todayCount} (Batch ${index + 1}/${totalBatch}) - Latency: ${latency}ms, Heap: ${heap}MB | "${commitMsg}"\n`;

  if (!DRY_RUN) {
    fs.appendFileSync(LOG_FILE, logEntry, 'utf-8');
  }
  console.log(`📝 [${index + 1}/${totalBatch}] Log tercatat: ${logEntry.trim()}`);
}

function main() {
  console.log('====================================================');
  console.log('   GitHub Activity Pulse Bot (Hyper-Random 3-17)    ');
  console.log('====================================================');
  console.log(`Author: ${GIT_NAME} <${GIT_EMAIL}>`);

  const now = new Date();
  const todayStr = getWibDate(now);
  const currentHourWib = getWibHour(now);
  const wibTimeFormatted = getWibFormatted(now);

  const profile = getDailyProfile(todayStr);
  let dailyTarget = profile.target;

  // Cek argumen CLI --target=N untuk override manual
  const targetArg = process.argv.find(a => a.startsWith('--target='));
  if (targetArg) {
    dailyTarget = parseInt(targetArg.split('=')[1], 10);
    console.log(`⚠️  Override target manual aktif: ${dailyTarget}`);
  }

  const alreadyCommittedToday = getTodayCommitCount(todayStr);
  const remainingNeeded = Math.max(0, dailyTarget - alreadyCommittedToday);

  console.log(`📅 Waktu Sekarang (WIB): ${wibTimeFormatted}`);
  console.log(`🏷️  Profil Hari Ini: ${profile.category} [Seed: ${profile.seedHash}]`);
  console.log(`🎯 Target Commit Hari Ini: ${dailyTarget}`);
  console.log(`📊 Sudah Dibuat Hari Ini : ${alreadyCommittedToday}`);
  console.log(`⏳ Sisa Target Hari Ini   : ${remainingNeeded}`);

  // Mode status-only
  if (process.argv.includes('--status')) {
    return;
  }

  let batchCount = 0;

  if (FORCE_COMMIT) {
    // Mode paksa manual (Run workflow / --force)
    // Buat 1 sampai 3 commit secara acak
    batchCount = Math.floor(Math.random() * 3) + 1;
    console.log(`⚡ Mode Force/Manual aktif: membuat ${batchCount} commit langsung!`);
  } else {
    // Mode jadwal cron reguler

    // 1. Jika hari ini off-day (target = 0)
    if (dailyTarget === 0) {
      console.log('🛌 Hari ini ditentukan sebagai off-day alami (0 commit). Istirahat total.');
      return;
    }

    // 2. Jika target harian sudah terpenuhi
    if (alreadyCommittedToday >= dailyTarget) {
      console.log(`🎉 Target harian (${dailyTarget} commit) sudah tercapai. Istirahat untuk hari ini.`);
      return;
    }

    // 3. Jam tidur (02:00 - 06:59 WIB)
    if (currentHourWib >= 2 && currentHourWib <= 6) {
      // 97% kemungkinan istirahat malam, 3% kemungkinan begadang / night-owl
      if (Math.random() > 0.03) {
        console.log(`💤 Jam tidur malam (${currentHourWib}:00 WIB). Sesi ini istirahat.`);
        return;
      }
      console.log(`🦉 Sesi malam aktif (night-owl commit)!`);
      batchCount = 1;
    } else {
      // 4. Jam aktif (07:00 - 01:59 WIB)
      // Hitung sisa jam aktif hari ini (hingga 24:00 WIB)
      const remainingActiveHours = Math.max(1, 24 - currentHourWib);
      const commitsPerHourNeeded = remainingNeeded / remainingActiveHours;

      // Probabilitas commit dinamis berdasarkan pace yang dibutuhkan
      // Pace tinggi -> chance lebih tinggi; Pace rendah -> chance santai
      const baseChance = Math.min(0.85, Math.max(0.20, commitsPerHourNeeded * 0.45));
      const jitter = (Math.random() * 0.20) - 0.10;
      const finalChance = Math.max(0.15, Math.min(0.90, baseChance + jitter));

      const roll = Math.random();
      console.log(`🎲 Peluang sesi ini commit: ${(finalChance * 100).toFixed(1)}% (Roll: ${(roll * 100).toFixed(1)}%)`);

      if (roll > finalChance) {
        console.log('☕ Sesi ini dilewati secara alami (istirahat/jeda aktivitas). Sampai jumpa di sesi berikutnya.');
        return;
      }

      // Tentukan berapa commit yang dibuat pada sesi ini
      if (remainingNeeded === 1) {
        batchCount = 1;
      } else if (commitsPerHourNeeded > 1.2 || remainingNeeded >= 6) {
        // Sedang mengejar target tinggi: bisa 1, 2, atau 3 commit
        const r = Math.random();
        if (r < 0.40) batchCount = 1;
        else if (r < 0.85) batchCount = 2;
        else batchCount = 3;
      } else {
        // Normal pace: 1 commit (75%) atau 2 commit (25%)
        batchCount = Math.random() < 0.75 ? 1 : 2;
      }

      batchCount = Math.min(batchCount, remainingNeeded);
    }
  }

  if (batchCount <= 0) {
    console.log('💤 Tidak ada commit yang dibuat pada sesi ini.');
    return;
  }

  console.log(`🚀 Menjalankan ${batchCount} commit pada sesi ini...`);

  if (!DRY_RUN) {
    runCommand(`git config user.name "${GIT_NAME}"`);
    runCommand(`git config user.email "${GIT_EMAIL}"`);
  }

  const recentMessages = getRecentCommitMessages(80);

  for (let i = 0; i < batchCount; i++) {
    const currentTotal = alreadyCommittedToday + i + 1;
    const msg = generateUniqueCommitMessage(recentMessages);

    recordHeartbeat(i, batchCount, currentTotal, msg);

    if (!DRY_RUN) {
      runCommand('git add activity.log');
      runCommand(`git commit -m "${msg}"`);
      console.log(`✅ Commit #${i + 1}/${batchCount} berhasil: "${msg}"`);

      // Jeda 2 - 5 detik antar commit agar timestamp tidak bertabrakan
      if (i < batchCount - 1) {
        const delayMs = Math.floor(Math.random() * 3000) + 2000;
        console.log(`⏳ Menunggu jeda ${delayMs}ms sebelum commit berikutnya...`);
        sleep(delayMs);
      }
    } else {
      console.log(`[DRY-RUN] Simulasi commit: "${msg}"`);
    }
  }

  console.log(`🎉 Selesai! Berhasil memproses ${batchCount} commit.`);
}

main();
