import postgres from "postgres";
import assert from "node:assert/strict";

const connection = process.env.SUPABASE_DB_URL;
if (!connection) throw new Error("Database connection is required");
const sql = postgres(connection, { max: 1, onnotice: () => {} });
const rollback = new Error("rollback test data");
try {
  await sql.begin(async tx => {
    const sku = `TEST-CASHAPP-${crypto.randomUUID()}`;
    await tx`INSERT INTO public.checkout_products (sku,name,category,price_usd,inventory,compliance_status) VALUES (${sku},'Rollback-only Cash App test','test',12.34,2,'approved')`;
    const [created] = await tx`SELECT public.create_checkout_order(ARRAY[${sku}], 'testbuyer', NULL, 'tg:123456', 'cashapp_manual') AS id`;
    const id = created.id;
    const transition = async (actor: string, to: string) => {
      const [row] = await tx`SELECT public.transition_telegram_manual_order(${id}::uuid,${actor},${to}) AS result`;
      return row.result;
    };
    await tx.savepoint(async sp => {
      await assert.rejects(() => sp`SELECT public.transition_telegram_manual_order(${id}::uuid,'tg:999','review')`, /not_order_buyer/);
      throw rollback;
    }).catch(error => { if (error !== rollback) throw error; });
    assert.deepEqual(await transition('tg:123456','review'), { changed: true, status: 'review' });
    assert.deepEqual(await transition('tg:123456','review'), { changed: false, status: 'review' });
    await tx.savepoint(async sp => {
      await assert.rejects(() => sp`SELECT public.transition_telegram_manual_order(${id}::uuid,'tg:123456','paid')`, /not_owner/);
      throw rollback;
    }).catch(error => { if (error !== rollback) throw error; });
    assert.deepEqual(await transition('tg:7086831521','paid'), { changed: true, status: 'paid' });
    assert.deepEqual(await transition('tg:7086831521','paid'), { changed: false, status: 'paid' });
    const [order] = await tx`SELECT status,total_usd FROM public.orders WHERE id=${id}`;
    assert.equal(order.status,'paid');
    assert.equal(Number(order.total_usd),12.34);
    const [stock] = await tx`SELECT inventory FROM public.checkout_products WHERE sku=${sku}`;
    assert.equal(stock.inventory,1);
    const [permissions] = await tx`SELECT has_function_privilege('anon','public.transition_telegram_manual_order(uuid,text,text)','EXECUTE') AS anon, has_function_privilege('authenticated','public.transition_telegram_manual_order(uuid,text,text)','EXECUTE') AS authenticated`;
    assert.equal(permissions.anon,false);
    assert.equal(permissions.authenticated,false);
    console.log('Passed: ownership, review-only buyer action, owner confirmation, duplicates, server price, inventory and client permission checks.');
    throw rollback;
  });
} catch (error) {
  if (error !== rollback) {
    console.log('Failure category:', error instanceof assert.AssertionError ? 'assertion' : typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : 'connection/runtime');
    throw new Error("Manual payment database regression could not pass; this test requires a privileged connection and rolls back all records");
  }
} finally {
  await sql.end();
}
console.log('All test records rolled back; no orders or inventory changes persisted.');