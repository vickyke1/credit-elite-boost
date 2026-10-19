import { assertEquals, assertRejects } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { findTelegramUser } from './find-user.ts';

const email = 'tg_123@telegram.cpncreditboost.local';
const fullPage = Array.from({ length: 1000 }, (_, i) => ({ email: `user${i}@example.test` }));

Deno.test('returning Telegram account beyond the first page is found', async () => {
  const pages: number[] = [];
  const result = await findTelegramUser({
    listUsers: async ({ page, perPage }) => {
      assertEquals(perPage, 1000);
      pages.push(page);
      return { data: { users: page === 1 ? fullPage : [{ email }] }, error: null };
    },
  }, email);
  assertEquals(result?.email, email);
  assertEquals(pages, [1, 2]);
});

Deno.test('first-page Telegram account needs no additional requests', async () => {
  let calls = 0;
  const result = await findTelegramUser({ listUsers: async () => {
    calls++;
    return { data: { users: [{ email }] }, error: null };
  } }, email);
  assertEquals(result?.email, email);
  assertEquals(calls, 1);
});

Deno.test('new Telegram account is absent only after exhausting all pages', async () => {
  const pages: number[] = [];
  const result = await findTelegramUser({ listUsers: async ({ page }) => {
    pages.push(page);
    return { data: { users: page === 1 ? fullPage : [] }, error: null };
  } }, email);
  assertEquals(result, undefined);
  assertEquals(pages, [1, 2]);
});

Deno.test('directory errors cannot be mistaken for an unregistered account', async () => {
  await assertRejects(() => findTelegramUser({ listUsers: async () => ({
    data: { users: [] }, error: new Error('Directory unavailable'),
  }) }, email), Error, 'Directory unavailable');
});