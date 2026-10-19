"""Browser regression: mock third-party services; never create real accounts.
Run with: python3 tests/signup_retry.py
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path('/tmp/browser/signup-retry')


async def check_retry(browser, failure):
    context = await browser.new_context(viewport={"width": 1280, "height": 1800})
    page = await context.new_page()
    tokens = []
    signup_attempts = []

    async def turnstile_script(route):
        await route.fulfill(content_type='application/javascript', body="""
          window.turnstile = {
            render(el, opts) {
              window.testCaptcha = opts;
              window.testCaptchaResets = 0;
              setTimeout(() => opts.callback('first-token'), 0);
              return 'test-widget';
            },
            reset(id) {
              if (id !== 'test-widget') throw Error('Incorrect widget reset');
              window.testCaptchaResets++;
            }
          };
        """)

    async def verification(route):
        if route.request.method == 'GET':
            await route.fulfill(json={"siteKey": "test-site-key"})
            return
        tokens.append(route.request.post_data_json['token'])
        if len(tokens) == 1 and failure == 'captcha':
            await route.fulfill(status=403, json={"verified": False})
        else:
            await route.fulfill(json={"verified": True})

    async def signup(route):
        signup_attempts.append(route.request.post_data_json)
        if len(signup_attempts) == 1 and failure == 'network':
            await route.abort('failed')
        elif len(signup_attempts) == 1 and failure == 'signup':
            await route.fulfill(status=422, json={
                "code": "user_already_exists", "msg": "User already been registered"
            })
        else:
            await route.fulfill(json={"user": {"id": "test-user", "identities": []}, "session": None})

    await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', turnstile_script)
    await page.route('**/functions/v1/verify-turnstile', verification)
    await page.route('**/auth/v1/signup*', signup)
    await page.goto('http://localhost:8080/register', wait_until='domcontentloaded')
    values = {
        'firstName': 'Retry', 'lastName': 'Tester', 'email': 'retry@example.test',
        'phone': '2025550100', 'password': 'TestOnly!123', 'confirmPassword': 'TestOnly!123',
    }
    for field, value in values.items():
        await page.locator(f'#{field}').fill(value)
    await page.locator('#acceptTerms').click()
    button = page.get_by_role('button', name='Create Account', exact=True)
    await button.click()
    await page.wait_for_function('() => window.testCaptchaResets === 1')
    assert await button.is_disabled(), f'{failure}: consumed token still accepted'
    for field, value in values.items():
        assert await page.locator(f'#{field}').input_value() == value
    assert await page.locator('#acceptTerms').get_attribute('aria-checked') == 'true'
    await button.screenshot(path=str(SCREENSHOTS / f'{failure}-reset.png'))
    await page.evaluate("window.testCaptcha.callback('fresh-token')")
    await button.click()
    await page.wait_for_url('**/login')
    assert tokens == ['first-token', 'fresh-token'], tokens
    assert len(signup_attempts) == (1 if failure == 'captcha' else 2)
    await page.get_by_role('button', name='Sign In', exact=True).screenshot(
        path=str(SCREENSHOTS / f'{failure}-retry-success.png'))
    print(f'PASS: {failure} failure resets captcha, retains form, retries with fresh token, reaches /login')
    await context.close()


async def main():
    SCREENSHOTS.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        for failure in ['captcha', 'signup', 'network']:
            await check_retry(browser, failure)
        await browser.close()


if __name__ == '__main__':
    asyncio.run(main())