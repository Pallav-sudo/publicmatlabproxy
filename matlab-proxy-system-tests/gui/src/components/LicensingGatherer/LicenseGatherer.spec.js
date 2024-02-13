// Copyright 2020-2023 The MathWorks, Inc.

import React from 'react';
import LicenseGatherer from './index';
import { render, fireEvent } from '../../test/utils/react-test';

describe('LicenseGatherer component', () => {

  let initialState;
  beforeEach(() => {

    initialState = {
      triggerPosition: { x: 539, y: 0 },
      tutorialHidden: false,
      overlayVisibility: false,

      serverStatus: {
        licensingInfo: { type: 'mhlm', emailAddress: 'abc@mathworks.com' },
        matlabStatus: 'up',
        isFetching: false,
        hasFetched: true,
        isSubmitting: false,
        fetchFailCount: 0,
        wsEnv: 'abcd',
      },
      loadUrl: null,
      error: null,
      authInfo: {
        authEnabled: false,
        authStatus: false,
        authToken: null,
      },
    };

  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should throw error', () => {

    const errorMock = jest.spyOn(console, 'error').mockImplementation(() => { })

    try {
      render(<LicenseGatherer />);
    }
    catch (error) {
      expect(error).toBeInstanceOf(TypeError);
      expect(errorMock).toHaveBeenCalledTimes(2);
    }

  });

  it('should render without crashing', () => {
    render(<LicenseGatherer />, { initialState: initialState });
  });


  it('should render without crashing. Should have a subdomain for mhlmLoginHostName', () => {

    initialState.serverStatus.wsEnv = 'mw-integ'

    const { container } = render(<LicenseGatherer />, { initialState: initialState });

    const mhlmTab = container.querySelector('#mhlm-tab');

    expect(mhlmTab).toBeInTheDocument();

    fireEvent.click(mhlmTab);

    const iFrame = container.getElementsByTagName('iframe').item(0)

    expect(iFrame.src).toContain(initialState.serverStatus.wsEnv);
  });

  it('should have rendered mhlm tab by default without crashing', () => {
    const { container } = render(<LicenseGatherer />, { initialState: initialState });

    const mhlmTab = container.querySelector('#mhlm-tab');

    expect(mhlmTab).toBeInTheDocument();
    // Click on mhlm Tab
    fireEvent.click(mhlmTab);

    // Check if mhlm iframe is rendered.
    const mhlmTabContent = container.querySelector('#MHLM');
    expect(mhlmTabContent).toBeInTheDocument();
  });

  it('should have rendered nlm tab content without crashing', () => {
    const { container } = render(<LicenseGatherer />, { initialState: initialState });

    const nlmTab = container.querySelector('#nlm-tab');
    expect(nlmTab).toBeInTheDocument();

    // Click on nlm Tab
    fireEvent.click(nlmTab);

    // Check if nlm tab is rendered.
    const nlmTabContent = container.querySelector('#NLM');
    expect(nlmTabContent).toBeInTheDocument();
  }); 

  it('should have rendered existing license tab content without crashing', () => {
    const { container } = render(<LicenseGatherer />, { initialState: initialState });

    const existingLicenseTab = container.querySelector('#existingLicense-tab');
    expect(existingLicenseTab).toBeInTheDocument();

    // Click on existingLicense Tab
    fireEvent.click(existingLicenseTab);

    // Check if existingLicense tab is rendered.
    const existingLicenseTabContent = container.querySelector('#existingLicense');
    expect(existingLicenseTabContent).toBeInTheDocument();
  }); 

  test.each([
    ['1234', true], ['hostname', true], ['1234hostname', true], ['1234,', true], ['hostname,', true], 
    ['1234@hostname', false], ['1234@hostname,4567@hostname', false], ['1234@hostname:4567@hostname', false], 
    ['1234@hostname,4567@hostname,456@hostname', false], ['1234@hostname,4567@hostname,456@hostname:789@hostname', false],
    ['789@hostname:1234@hostname,4567@hostname,456@hostname', false], ['789@hostname:1234@hostname,4567@hostname,456@hostname:789@hostname', false],
  ])(
      'Test to check for NLM connection string: %s if the \'disabled\' property of the Submit button is set to %s',
      (NLMConnStr, disabledValue) => {

      const { container } = render(<LicenseGatherer />, { initialState: initialState });

      const nlmTab = container.querySelector('#nlm-tab');
      const input = container.querySelector('#nlm-connection-string')
      const submitButton = container.querySelector('#submit')

      expect(nlmTab).toBeInTheDocument();

      // Click on nlm Tab
      fireEvent.click(nlmTab);

      // Check if nlm iframe is rendered.
      const nlmTabContent = container.querySelector('#NLM');
      expect(nlmTabContent).toBeInTheDocument();

      fireEvent.change(input, {target: {value: NLMConnStr}})    
      // Check if Submit button is disabled for an invalid nlm connection string
      expect(submitButton.disabled).toBe(disabledValue)
    }
  );
});
