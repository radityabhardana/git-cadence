/**
 * GitHub Activity Pulse Bot
 * Dibuat otomatis untuk menjaga keaktifan grafik kontribusi GitHub secara natural.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const LOG_FILE = path.join(__dirname, 'activity.log');

// Daftar pesan commit realistis
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
  'docs: routine markdown telemetry update'
];

// Ambil konfigurasi dari Environment Variables atau default
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

function shouldCommitToday() {
  if (FORCE_COMMIT) {
    console.log('⚡ Force commit aktif (manual run / flag --force terdeteksi).');
    return true;
  }

  const today = new Date();
  const dayOfWeek = today.getUTCDay(); // 0: Minggu, 6: Sabtu
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Peluang commit: ~80% di weekday, ~45% di weekend
  const probability = isWeekend ? 0.45 : 0.80;
  const roll = Math.random();

  console.log(`🎲 Hari: ${isWeekend ? 'Weekend' : 'Weekday'} | Peluang: ${probability * 100}% | Roll: ${(roll * 100).toFixed(1)}%`);

  return roll < probability;
}

function getCommitCount() {
  if (FORCE_COMMIT) return 1;

  const roll = Math.random();
  // 65% peluang 1 commit, 25% peluang 2 commit, 10% peluang 3 commit
  if (roll < 0.65) return 1;
  if (roll < 0.90) return 2;
  return 3;
}

function getRandomCommitMessage() {
  const index = Math.floor(Math.random() * COMMIT_MESSAGES.length);
  return COMMIT_MESSAGES[index];
}

function recordHeartbeat(index, total) {
  const now = new Date();
  const isoTime = now.toISOString();
  // Format WIB (UTC+7)
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19) + ' WIB';
  const pulseHash = crypto.randomBytes(4).toString('hex');
  
  const logEntry = `[${wibTime} / ${isoTime}] [pulse:${pulseHash}] Batch ${index + 1}/${total} - Status: ACTIVE\n`;

  fs.appendFileSync(LOG_FILE, logEntry, 'utf-8');
  console.log(`📝 Log ditambahkan: ${logEntry.trim()}`);
}

function main() {
  console.log('--- Memulai GitHub Activity Bot ---');
  console.log(`Author: ${GIT_NAME} <${GIT_EMAIL}>`);

  if (!shouldCommitToday()) {
    console.log('💤 Jadwal dilewati hari/sesi ini agar pola commit terlihat natural dan acak.');
    return;
  }

  // Konfigurasi identitas git
  runCommand(`git config user.name "${GIT_NAME}"`);
  runCommand(`git config user.email "${GIT_EMAIL}"`);

  const commitCount = getCommitCount();
  console.log(`🚀 Melakukan ${commitCount} commit...`);

  for (let i = 0; i < commitCount; i++) {
    recordHeartbeat(i, commitCount);
    const msg = getRandomCommitMessage();

    runCommand('git add activity.log');
    runCommand(`git commit -m "${msg}"`);
    console.log(`✅ Commit #${i + 1} berhasil: "${msg}"`);
  }

  console.log('🎉 Selesai! Siap untuk di-push ke remote repository.');
}

main();
