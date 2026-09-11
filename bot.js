/**
 * GitHub Activity Pulse Bot
 * Target: 6 - 10 kontribusi per hari secara acak dan natural.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const LOG_FILE = path.join(__dirname, 'activity.log');

// Koleksi pesan commit realistis
const COMMIT_MESSAGES = [
  'chore: update activity heartbeat [skip ci]',
  'docs: sync routine telemetry pulse',
  'refactor: optimize runtime cache log',
  'style: reformat daily activity records',
  'perf: routine performance check ping',
  'chore(deps): sync automated heartbeat timestamp',
  'feat(pulse): record daily activity status',
  'docs(log): update session metrics and pulse',
  'fix: resolve stale telemetry log buffer',
  'chore: refresh session state record',
  'ci: automated pulse health check',
  'build: sync state heartbeat',
  'docs: routine markdown telemetry update',
  'perf: optimize telemetry buffer latency',
  'chore(telemetry): routine pulse ping',
  'refactor: clean up activity log buffer'
];

// Identitas Git
const GIT_NAME = process.env.GIT_NAME || 'radityabhardana';
const GIT_EMAIL = process.env.GIT_EMAIL || 'rexnabagus@gmail.com';
const FORCE_COMMIT = process.env.FORCE_COMMIT === 'true' || process.argv.includes('--force');

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    console.error(`Error executing: ${command}`);
    console.error(error.stderr ? error.stderr.toString() : error.message);
    throw error;
  }
}

// Ambil tanggal hari ini dalam format YYYY-MM-DD (WIB / UTC+7)
function getTodayDateString() {
  const now = new Date();
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return wibTime.toISOString().substring(0, 10);
}

// Hitung berapa kali commit yang sudah dicatat hari ini di activity.log
function getTodayCommitCount(todayStr) {
  if (!fs.existsSync(LOG_FILE)) return 0;
  const content = fs.readFileSync(LOG_FILE, 'utf-8');
  const lines = content.split('\n');
  let count = 0;
  for (const line of lines) {
    if (line.includes(`[${todayStr}`)) {
      count++;
    }
  }
  return count;
}

// Tentukan target commit harian antara 6 sampai 10
function getDailyTarget() {
  // Acak antara 6 sampai 10 (e.g. 6, 7, 8, 9, 10)
  return Math.floor(Math.random() * 5) + 6;
}

function getRandomCommitMessage() {
  const index = Math.floor(Math.random() * COMMIT_MESSAGES.length);
  return COMMIT_MESSAGES[index];
}

function recordHeartbeat(index, total, todayCount) {
  const now = new Date();
  const isoTime = now.toISOString();
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19) + ' WIB';
  const todayStr = getTodayDateString();
  const pulseHash = crypto.randomBytes(4).toString('hex');

  const logEntry = `[${todayStr}] [${wibTime} / ${isoTime}] [pulse:${pulseHash}] Commit #${todayCount} (Batch ${index + 1}/${total}) - Status: ACTIVE\n`;

  fs.appendFileSync(LOG_FILE, logEntry, 'utf-8');
  console.log(`📝 Log ditambahkan: ${logEntry.trim()}`);
}

function main() {
  console.log('========================================');
  console.log('   GitHub Activity Pulse Bot (6-10/hari) ');
  console.log('========================================');
  console.log(`Author: ${GIT_NAME} <${GIT_EMAIL}>`);

  const todayStr = getTodayDateString();
  const alreadyCommittedToday = getTodayCommitCount(todayStr);
  const dailyTarget = getDailyTarget();

  console.log(`📅 Tanggal hari ini (WIB): ${todayStr}`);
  console.log(`📊 Commit sudah tercatat hari ini: ${alreadyCommittedToday}`);
  console.log(`🎯 Target harian acak: ${dailyTarget} commit`);

  let commitCount = 0;

  if (FORCE_COMMIT) {
    // Jika dipaksa manual (Run workflow / --force), buat 2 - 4 commit sekaligus
    commitCount = Math.floor(Math.random() * 3) + 2;
    console.log(`⚡ Mode Force/Manual aktif: membuat ${commitCount} commit langsung!`);
  } else {
    // Mode jadwal cron
    if (alreadyCommittedToday >= 10) {
      console.log('🎉 Target maksimal harian (10 commit) sudah tercapai. Istirahat untuk hari ini.');
      return;
    }

    if (alreadyCommittedToday >= dailyTarget) {
      // 80% kemungkinan istirahat jika sudah mencapai target, 20% kemungkinan nambah 1 lagi jika < 10
      if (Math.random() > 0.2) {
        console.log(`✅ Target harian (${dailyTarget}) sudah tercapai. Sesi ini istirahat.`);
        return;
      }
    }

    // Setiap sesi cron menghasilkan 1 - 2 commit
    const sisa = Math.max(1, 10 - alreadyCommittedToday);
    const rollCount = Math.floor(Math.random() * 2) + 1; // 1 atau 2 commit
    commitCount = Math.min(rollCount, sisa);
  }

  if (commitCount <= 0) {
    console.log('💤 Tidak ada commit yang dibuat pada sesi ini.');
    return;
  }

  // Set konfigurasi git author
  runCommand(`git config user.name "${GIT_NAME}"`);
  runCommand(`git config user.email "${GIT_EMAIL}"`);

  console.log(`🚀 Melakukan ${commitCount} commit pada sesi ini...`);

  for (let i = 0; i < commitCount; i++) {
    const currentTotal = alreadyCommittedToday + i + 1;
    recordHeartbeat(i, commitCount, currentTotal);
    const msg = getRandomCommitMessage();

    runCommand('git add activity.log');
    runCommand(`git commit -m "${msg}"`);
    console.log(`✅ Commit #${i + 1}/${commitCount} berhasil: "${msg}"`);
  }

  console.log('🎉 Selesai! Semua commit berhasil dibuat.');
}

main();
