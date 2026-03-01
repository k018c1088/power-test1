/**
 * AI Blog Post Generator
 *
 * Generates a blog post using Claude API or OpenAI API.
 * Used by GitHub Actions for scheduled auto-posting
 * and can also be run locally.
 *
 * Usage:
 *   npx tsx scripts/generate-post.ts --blog modern --topic "AI入門"
 *   npx tsx scripts/generate-post.ts --blog magazine --auto
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Configuration ───

const TOPICS_FILE = path.join(__dirname, 'topics.json');

interface Topic {
  title: string;
  category: string;
  tags: string[];
  audience: string;
  used: boolean;
}

interface TopicsConfig {
  topics: Topic[];
}

// ─── Args Parser ───

function parseArgs(): {
  blog: string;
  topic?: string;
  auto: boolean;
  provider: string;
} {
  const args = process.argv.slice(2);
  let blog = 'modern';
  let topic: string | undefined;
  let auto = false;
  let provider = 'claude';

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--blog':
        blog = args[++i];
        break;
      case '--topic':
        topic = args[++i];
        break;
      case '--auto':
        auto = true;
        break;
      case '--provider':
        provider = args[++i];
        break;
    }
  }

  return { blog, topic, auto, provider };
}

// ─── Topic Management ───

function loadTopics(): TopicsConfig {
  if (!fs.existsSync(TOPICS_FILE)) {
    return { topics: [] };
  }
  return JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf-8'));
}

function getNextTopic(): Topic | null {
  const config = loadTopics();
  const unused = config.topics.filter((t) => !t.used);
  if (unused.length === 0) return null;
  return unused[0];
}

function markTopicUsed(title: string): void {
  const config = loadTopics();
  const topic = config.topics.find((t) => t.title === title);
  if (topic) {
    topic.used = true;
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(config, null, 2), 'utf-8');
  }
}

// ─── AI Providers ───

async function generateWithClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ─── Post Generation ───

function buildPrompt(topic: string, category: string, audience: string): string {
  return `You are a technical blog writer. Write a blog post in Japanese about "${topic}".

Requirements:
- Target audience: ${audience}
- Category: ${category}
- Write in a friendly, educational tone
- Include code examples where appropriate
- Use Markdown with proper headings (## for H2, ### for H3)
- Include a practical "まとめ" (summary) section at the end
- Total length: 1500-2500 characters
- Do NOT include frontmatter (---) - just the article body starting from ## はじめに

Write the article now:`;
}

function generateFrontmatter(title: string, description: string, tags: string[], category: string): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const tagStr = tags.map((t) => `"${t}"`).join(', ');

  return `---
title: "${title}"
description: "${description}"
pubDate: ${dateStr}
tags: [${tagStr}]
category: "${category}"
draft: false
aiGenerated: true
---`;
}

function generateSlug(title: string): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
  // Simple slug: date + hash of title
  const hash = title.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const slug = Math.abs(hash).toString(36).slice(0, 6);
  return `${dateStr}-${slug}`;
}

// ─── Main ───

async function main() {
  const args = parseArgs();
  console.log(`[generate-post] blog=${args.blog}, auto=${args.auto}, provider=${args.provider}`);

  let topicTitle: string;
  let category: string;
  let tags: string[];
  let audience: string;

  if (args.auto) {
    // Auto mode: pick next unused topic
    const topic = getNextTopic();
    if (!topic) {
      console.log('[generate-post] No unused topics available. Exiting.');
      process.exit(0);
    }
    topicTitle = topic.title;
    category = topic.category;
    tags = topic.tags;
    audience = topic.audience;
    console.log(`[generate-post] Auto-selected topic: "${topicTitle}"`);
  } else if (args.topic) {
    topicTitle = args.topic;
    category = '技術解説';
    tags = ['Tech'];
    audience = 'IT未経験の新卒エンジニア';
  } else {
    console.error('[generate-post] Please provide --topic or --auto');
    process.exit(1);
  }

  // Generate article body
  const prompt = buildPrompt(topicTitle, category, audience);
  console.log(`[generate-post] Calling ${args.provider} API...`);

  let body: string;
  try {
    body =
      args.provider === 'openai'
        ? await generateWithOpenAI(prompt)
        : await generateWithClaude(prompt);
  } catch (err: any) {
    // Fallback to other provider
    console.warn(`[generate-post] ${args.provider} failed: ${err.message}. Trying fallback...`);
    body =
      args.provider === 'openai'
        ? await generateWithClaude(prompt)
        : await generateWithOpenAI(prompt);
  }

  // Generate description (first 100 chars of body)
  const descLines = body
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .slice(0, 2)
    .join(' ')
    .slice(0, 120);

  // Build full markdown
  const frontmatter = generateFrontmatter(topicTitle, descLines, tags, category);
  const fullContent = `${frontmatter}\n\n${body}\n`;

  // Write file
  const slug = generateSlug(topicTitle);
  const blogDir = path.resolve(__dirname, '..', `blog-${args.blog}`, 'src', 'content', 'blog');
  const filePath = path.join(blogDir, `${slug}.md`);

  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  fs.writeFileSync(filePath, fullContent, 'utf-8');
  console.log(`[generate-post] Created: ${filePath}`);

  // Mark topic as used if auto mode
  if (args.auto) {
    markTopicUsed(topicTitle);
    console.log(`[generate-post] Marked topic "${topicTitle}" as used.`);
  }
}

main().catch((err) => {
  console.error('[generate-post] Error:', err);
  process.exit(1);
});
