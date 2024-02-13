import { test, expect, chromium } from '@playwright/test';

// Tests to check the tools icon clickability and the initial dialog
test.describe('MATLAB Proxy tests', () => {
    test.beforeEach(async ({page}) => {
        // Checks if the MATLAB Proxy page is available
        await page.goto('/index.html');
        const confirmButton = page.locator('[data-testid="confirmButton"]');
        await confirmButton.click({ timeout: 60000 });
    });

    // Test to check if the tools icon button is clickable
    test('Test the tools icon button is clicked', async ( {page} )  => {
        const buttonLocator = page.locator('button.trigger-btn');
        await expect(buttonLocator, 'Tools icon button is not visible').toBeVisible({timeout : 60000});
        await buttonLocator.click();
    })

    // Test to check that '>>' is visible on the command window
    test('Test that prompt >> is seen', async ( {page} ) => {
        const commandWindowFrame = page.getByText('>>');
        await commandWindowFrame.isVisible({timeout:60000});
    })

    // Test to check if the initial dialog which appears on the start up is able to close
    test('Test that the Close button on initial tools icon dialog works', async( {page} )  => {
        const triggerButton = page.getByTestId('tutorialCloseBtn');
        await expect(triggerButton, "The tools icon dialog is not visible").toBeVisible({timeout : 60000});
        await triggerButton.click();
    })

    // Test to check if matlab is active in only one browser session
    test('Test if matlab is active in only one browser session', async ({page,browser})  => {
        // Open a new tab
        const page2 = await browser.newPage();
        await page2.goto("/index.html");
        const confirmButton2 = page2.locator('[data-testid="confirmButton"]');    
        await expect(confirmButton2, 'New browser session message not visible').toBeVisible({timeout : 60000});
        await confirmButton2.click({ timeout: 10000 });
        // Check if old tab gives proper message
        const oldSession = page.locator('div').filter({ hasText: /^MATLAB is currently open in another window$/ });
        await expect(oldSession, 'Old browser session message not visible').toBeVisible({timeout : 60000});
        await page.getByTestId('cancelButton').click();
    })
});