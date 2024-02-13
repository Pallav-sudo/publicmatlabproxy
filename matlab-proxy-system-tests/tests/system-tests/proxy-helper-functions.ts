//HELPER FUNCTIONS FOR THE TESTS
import {Page, test, expect, Locator} from '@playwright/test';
import { link } from 'fs';

const TEST_USERNAME = process.env.TEST_USERNAME
const TEST_PASSWORD = process.env.TEST_PASSWORD
// Waits for the page to finish loading
async function waitForPageLoad(matlabJsdPage: Page) {
    await matlabJsdPage.waitForLoadState();
}

// Clicks an element and waits for the page to finish loading
async function clickAndWaitForLoadState(element: Locator, matlabJsdPage: Page) {
    await element.click();
    await waitForPageLoad(matlabJsdPage);
}

async function getTheStatusOFMATLAB(matlabJsdPage: Page) : Promise<Locator>{
    // This gets the dialog having all the buttons
    const MATLABRunningStatus = matlabJsdPage.getByRole('dialog', { name: 'Status Information' });
    await expect(MATLABRunningStatus, 'Wait for the running status dialog box').toBeVisible({timeout: 120000});
    return MATLABRunningStatus;
}

async function clickTheToolsIconButton(matlabJsdPage: Page){
    const toolIcon = matlabJsdPage.getByRole('button', { name: 'Menu' });
    await expect(toolIcon, 'Wait for Tool Icon button in MATLAB Web Desktop').toBeVisible();
    await toolIcon.click();
}

async function waitForButtonAndClick(pageElement, buttonTestId, buttonLabel) {
    const button = pageElement.getByTestId(buttonTestId);
    await expect(button, buttonLabel).toBeVisible();
    await button.click();
  }

// Sets MATLAB licensing in JSD using the License Manager option
async function setMatlabLicensingInJsdUsingLicenseManager(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Clicks on the Network License Manager tab
    const signInDialog = matlabJsdPage.locator('#setup-dialog');
    await clickAndWaitForLoadState(signInDialog.getByRole('tab', { name: 'Network License Manager' }), matlabJsdPage);

    // Fills in the License Manager dialog with the desired information
    const LMDialog = signInDialog.getByPlaceholder('port@hostname');
    await LMDialog.fill("1@license");

    // Submits the form and waits for the page to finish loading
    await clickAndWaitForLoadState(signInDialog.getByRole('button', { name: 'Submit' }), matlabJsdPage);
}

// Sets MATLAB licensing in JSD using the Online Licensing option
async function setMatlabLicensingInJsdUsingOnlineLicensing(matlabJsdPage: Page, username: string, password: string) {
    await waitForPageLoad(matlabJsdPage);

    // Fills in the email textbox and presses Enter
    const emailTextbox = matlabJsdPage.frameLocator('#loginframe').locator('#userId');
    await expect(emailTextbox, 'Wait for email ID textbox to appear').toBeVisible();

    // This fill is added to makesure that the email input area is blank before entering the username
    await emailTextbox.fill('');

    // Fills in the username in the input
    await emailTextbox.fill(username);
    await emailTextbox.press('Enter');

    // Fills in the password textbox and presses Enter multiple times
    const passwordTextbox = matlabJsdPage.frameLocator('#loginframe').locator('#password');
    await expect(passwordTextbox, 'Wait for password textbox to appear').toBeVisible();
    await passwordTextbox.fill(password);
    await passwordTextbox.press('Enter');
    // await passwordTextbox.press('Enter');
}

async function verifyLicensingSuccessful(matlabJsdPage: Page){
    // Verifies if licensing is successful by checking the status information
    await clickTheToolsIconButton(matlabJsdPage);
    const statusInfo = matlabJsdPage.getByText('Status Information');
    await expect(statusInfo, 'Verify if Licensing is successful').toBeVisible();
}

// Unsets MATLAB licensing in JSD
async function unsetMatlabLicensing(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Clicks on the Tool Icon button in MATLAB Web Desktop
    await clickTheToolsIconButton(matlabJsdPage);
    const statusInfo = await getTheStatusOFMATLAB(matlabJsdPage);

    // Clicks on the Unset MATLAB Licensing button
    await waitForButtonAndClick(statusInfo, 'unsetLicensingBtn', 'Wait for Unset MATLAB Licensing button');

    // Confirms the action by clicking the Confirm button

    await waitForButtonAndClick(matlabJsdPage, 'confirmButton', 'Wait for Confirm button');
    await waitForPageLoad(matlabJsdPage);
}

// Starts a MATLAB session in JSD
async function startMatlabSession(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Waits for the Status Information dialog to be loaded
    const statusInfo = await getTheStatusOFMATLAB(matlabJsdPage);

    // Clicks on the Start MATLAB Session button
    await waitForButtonAndClick(statusInfo, 'startMatlabBtn', 'Wait for Stop MATLAB Session button');

    // Confirms the action by clicking the Confirm button with a longer timeout
    await waitForButtonAndClick(matlabJsdPage, 'confirmButton', 'Wait for Confirm button');
}

// Stops the current MATLAB session in JSD
async function stopMatlabSession(matlabJsdPage: Page) {
    await waitForPageLoad(matlabJsdPage);

    // Clicks on the Tool Icon button in MATLAB Web Desktop
    await clickTheToolsIconButton(matlabJsdPage);

    // Waits for the Status Information dialog to be loaded
    const statusInfo = await getTheStatusOFMATLAB(matlabJsdPage);

    // Clicks on the Stop MATLAB Session button
    await waitForButtonAndClick(statusInfo, 'stopMatlabBtn', 'Stop MATLAB Session');

    // Confirms the action by clicking the Confirm button
    await waitForButtonAndClick(matlabJsdPage, 'confirmButton', 'Wait for Confirm button');
}
export {
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
  };