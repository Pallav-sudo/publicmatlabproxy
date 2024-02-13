import {Page, test, expect, Locator} from '@playwright/test';
import { link } from 'fs';
import {
    waitForPageLoad,
    clickAndWaitForLoadState,
    getTheStatusOFMATLAB,
    clickTheToolsIconButton,
    waitForButtonAndClick,
    setMatlabLicensingInJsdUsingLicenseManager,
    setMatlabLicensingInJsdUsingOnlineLicensing,
    verifyLicensingSuccessful,
    unsetMatlabLicensing,
    startMatlabSession,
    stopMatlabSession
  } from '../proxy-helper-functions';
// Tests to check the licensing workflow in the MATLAB Proxy UI
test.describe('MATLAB Proxy tests to check the licensing and start stop workflow', () => {

    const TEST_USERNAME = process.env.TEST_USERNAME
    const TEST_PASSWORD = process.env.TEST_PASSWORD
    test.beforeEach(async ({page}) => {
        // Checks if the MATLAB Proxy page is available
        await page.goto('/index.html');
        const confirmButton = page.locator('[data-testid="confirmButton"]');
        await confirmButton.click({ timeout: 60000 });
    });

    // Test to check the "Stop MATLAB" Button in the tools icon
    test('Stop MATLAB Proxy', async({ page }) => {
        // Stops the MATLAB Session and checks that the status is turned to Not Running
        await stopMatlabSession(page);
        const MATLABRunningStatusDialog = await getTheStatusOFMATLAB(page);
        await expect(MATLABRunningStatusDialog.getByText('Not running'), 'Wait for MATLAB status to be stopped').toHaveText('Not running', { timeout: 120000 });
        // Start the MATLAB Session back again
        await startMatlabSession(page);
    });

    // Test to check if the user is able to Sign Out and Sign In back again using the user credentials in the tools icon
    test('Test Online licensing is working', async ( {page} ) => {
        // Sign out of MATLAB
        await unsetMatlabLicensing(page);
        // License MATLAB back using Online licensing
        await setMatlabLicensingInJsdUsingOnlineLicensing(page, TEST_USERNAME, TEST_PASSWORD);
        await verifyLicensingSuccessful(page);
    });

    // Test to check the "Restart MATLAB" button in the tools icon is abel to restart MATLAB
    test('Test Restart MATLAB is working', async ({page}) => {
        // Clicks the Restart button
        await clickTheToolsIconButton(page);
        await waitForButtonAndClick(page, 'startMatlabBtn', 'Restart MATLAB button should be visible');
        // Presses the confirm button while restarting MATLAB
        await waitForButtonAndClick(page, 'confirmButton', 'Wait for Confirm button');
        // Cliks the Tool Icon button
        await clickTheToolsIconButton(page);
        // Checks the status of MATLAB to be running
        const MATLABRunningStatus = await getTheStatusOFMATLAB(page);
        await expect(MATLABRunningStatus.getByText('Running'), 'Wait for MATLAB status to be stopped').toHaveText('Running', { timeout: 120000 });
    });

    // Test to check if prompt appears for invalid usr credentials
    test('Test to check if prompt appears for invalid usr credentials', async({page}) => {
        await unsetMatlabLicensing(page);
        const mockuser = 'mockuser@test.com';
        await setMatlabLicensingInJsdUsingOnlineLicensing(page, mockuser, TEST_PASSWORD);
        const invalidText = page.frameLocator('#loginframe').locator('#errorMessage');
        await expect(invalidText).toHaveText('Invalid Email or Password');
        const invalidEmail = page.frameLocator('#loginframe').getByRole('link', { name: 'Edit email ' + mockuser });
        await invalidEmail.click();
        await setMatlabLicensingInJsdUsingOnlineLicensing(page, TEST_USERNAME , TEST_PASSWORD);
        await verifyLicensingSuccessful(page);
    });

   //  Test to check MATLAB Proxy is able to license using the local licensing
    test('Test to check the local licensing', async ({page}) => {
        await unsetMatlabLicensing(page);
        // Clicks on the Network License Manager tab
        const signInDialog = page.locator('#setup-dialog');
        await clickAndWaitForLoadState(signInDialog.getByRole('tab', { name: 'Existing License' }), page);
        const startMATLABButton = signInDialog.getByRole('button', { name: 'Start MATLAB' });
        await startMATLABButton.click();
    });
});


