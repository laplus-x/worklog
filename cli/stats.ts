#!/usr/bin/env node --experimental-strip-types

import { execSync } from 'child_process';
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

type Options = {
    repo: string;
    author: string;
    since: string;
    until: string;
    output: string;
}

type Stats = {
    project: string;
    date: string;
    mergeCount: number;
    commitCount: number;
    additions: number;
    deletions: number;
    diff: number;
};

function toUTCFromLocalDate(dateStr: string): string {
    // dateStr 格式 YYYY-MM-DD
    const [y, m, d] = dateStr.split('-').map(Number);

    // 建立 UTC+8 的當日 00:00
    const local = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
    // 減去 8 小時，變成 UTC 時間
    local.setUTCHours(local.getUTCHours() - 8);

    return local.toISOString()
}

function toLocalDateFromUTC(isoString: string): string {
    const d = new Date(isoString);
    // 轉成 UTC+8
    d.setHours(d.getHours() + 8);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}


const program = new Command();
program
    .name('stats')
    .description('Generate Git stats JSON for a given author and date range')
    .option('-r, --repo <path>', 'Path to Git repository', process.cwd())
    .requiredOption('-a, --author <name>', 'Author name or email')
    .option('-s, --since <date>', 'Start date (YYYY-MM-DD)')
    .option('-u, --until <date>', 'End date (YYYY-MM-DD)')
    .option('-o, --output <file>', 'Output JSON file', 'stats.json');

program.parse(process.argv);
const options = program.opts<Options>();
const { repo, author, since, until, output } = options;

// 建立 Git 指令的參數陣列
const gitArgs: string[] = ['git', '-C', repo, 'log'];

if (author) gitArgs.push(`--author="${author}"`);

if (since) gitArgs.push(`--since="${toUTCFromLocalDate(since)}"`);

if (until) gitArgs.push(`--until="${toUTCFromLocalDate(until)}"`);

gitArgs.push('--pretty=format:"%H %aI %P"', '--numstat');

// 轉成字串執行
const gitCmd = gitArgs.join(' ');

console.log('Executing command:', gitCmd);

const raw = execSync(gitCmd, { encoding: 'utf-8' });

const repoName = path.basename(repo);
const statsMap: Record<string, Stats> = {};

let currentDate = '';
raw.split('\n').forEach(line => {
    if (/^[0-9a-f]{7,} \d{4}-\d{2}-\d{2}/.test(line)) {
        // commit line
        const [_, date, ...parents] = line.split(' ');
        const isMerge = parents.length > 1;

        currentDate = toLocalDateFromUTC(date);

        statsMap[currentDate] ??= {
            project: repoName,
            date: currentDate,
            mergeCount: 0,
            commitCount: 0,
            additions: 0,
            deletions: 0,
            diff: 0,
        };

        statsMap[currentDate].commitCount += 1;
        if (isMerge) statsMap[currentDate].mergeCount += 1;
        return;
    }

    // numstat line: additions \t deletions \t filename
    const numstatMatch = line.match(/^(\d+|-)\s+(\d+|-)\s+/);
    if (numstatMatch && currentDate) {
        const add = numstatMatch[1] === '-' ? 0 : +numstatMatch[1];
        const del = numstatMatch[2] === '-' ? 0 : +numstatMatch[2];

        statsMap[currentDate].additions += add;
        statsMap[currentDate].deletions += del;
        statsMap[currentDate].diff += add - del;
    }
});

const result: Stats[] = Object.values(statsMap).sort((a, b) => a.date.localeCompare(b.date));

fs.writeFileSync(output, JSON.stringify(result, null, 2));
console.log(`生成完成: ${output}`);
