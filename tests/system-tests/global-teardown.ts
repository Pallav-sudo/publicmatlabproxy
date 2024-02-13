// global-teardown.ts
import { chromium, FullConfig, expect } from '@playwright/test';
import { waitForPageLoad, clickAndWaitForLoadState, getTheStatusOFMATLAB, clickTheToolsIconButton, waitForButtonAndClick, setMatlabLicensingInJsdUsingLicenseManager, setMatlabLicensingInJsdUsingOnlineLicensing, verifyLicensingSuccessful, unsetMatlabLicensing, startMatlabSession, stopMatlabSession } from './proxy-helper-functions';

async function globalTeardown (config: FullConfig) {
    const { baseURL } = config.projects[0].use;
    console.log("baseURL is ", baseURL)
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(baseURL!);
    const confirmButton = page.locator('[data-testid="confirmButton"]');    
    await confirmButton.click({ timeout: 10000 });
    await stopMatlabSession(page);
    const MATLABRunningStatusDialog = await getTheStatusOFMATLAB(page);
    await expect(MATLABRunningStatusDialog.getByText('Not running'), 'Wait for MATLAB status to be stopped').toHaveText('Not running', { timeout: 120000 });
    const statusInfo = await getTheStatusOFMATLAB(page);
    // Clicks on the Unset MATLAB Licensing button
    await waitForButtonAndClick(statusInfo, 'unsetLicensingBtn', 'Wait for Unset MATLAB Licensing button');
    // Confirms the action by clicking the Confirm button
    await waitForButtonAndClick(page, 'confirmButton', 'Wait for Confirm button');
    await waitForPageLoad(page);
}

export default globalTeardown;