import log from '../utils/logger';
import { setOption, getOptions, Options } from '../utils/settings';

/**
 * Define interfaces for settings
 */
interface DefaultSetting {
  key: keyof Options;
  defaultValue: string;
  selector: string;
}

interface EventSetting {
  selector: string;
  key: keyof Options;
  event: string;
}

interface LocalizeElement {
  id: string;
  messageKey: string;
}

/**
 * Restores options from chrome.storage and updates the UI elements.
 */
async function restoreOptions(): Promise<void> {
  try {
    const options = await getOptions();
    
    const defaultSettings: DefaultSetting[] = [
      { key: 'OptionEstimateOvertime', defaultValue: '1', selector: '#OptionEstimateOvertime' },
      // Add other settings here
    ];

    defaultSettings.forEach((setting: DefaultSetting) => {
      const element = document.querySelector(setting.selector) as HTMLInputElement | null;
      if (element === null) {
        log.warn(`Element with selector ${setting.selector} not found`);
      } else {
        element.value = options[setting.key] || setting.defaultValue;
        log.debug(`Restored ${setting.key}:`, options[setting.key]);
      }
    });
  } catch (error) {
    log.error("Failed to restore options:", error);
  }
}

/**
 * Registers event handlers for UI elements to save options.
 */
function registerEventHandlers(): void {
  const settings: EventSetting[] = [
    { selector: '#OptionEstimateOvertime', key: 'OptionEstimateOvertime', event: 'change' },
    // Add other settings here
  ];

  settings.forEach((setting: EventSetting) => {
    const element = document.querySelector(setting.selector) as HTMLInputElement | null;
    if (element === null) {
      log.warn(`Element with selector ${setting.selector} not found`);
    } else {
      element.addEventListener(setting.event, () => {
        const value = element.value;
        setOption(setting.key, value);
      });
    }
  });
}

/**
 * Localizes the UI elements based on the current platform.
 */
async function localizePage(): Promise<void> {
  try {
    const elements: LocalizeElement[] = [
      { id: 'strOptionsWinHeader', messageKey: 'strOptionsWinHeader' },

      { id: 'strOptionEstimateOvertime', messageKey: 'strOptionEstimateOvertime' },
      { id: 'strOptionEstimateOvertimeDisabled', messageKey: 'strOptionEstimateOvertimeDisabled' },
      { id: 'strOptionEstimateOvertimeEnabled', messageKey: 'strOptionEstimateOvertimeEnabled' },
    
      // Add other localization elements here
    ];

    elements.forEach((element: LocalizeElement) => {
      const el = document.getElementById(element.id);
      if (el === null) {
        log.warn(`Element with id ${element.id} not found`);
      } else {
        let messageKey = element.messageKey;
        el.textContent = chrome.i18n.getMessage(messageKey);
        // el.classList.remove('invisible-text');
        log.debug(`Localized element ${element.id} with messageKey ${messageKey}`);
      }
    });
  } catch (error) {
    log.error("An error occurred while localizing the page:", error);
  }
}

/**
 * Displays the body after initialization to prevent flicker.
 */
function showBody(): void {
  document.body.style.display = 'block';
}

/**
 * Initializes the options page by restoring options and registering event handlers.
 */
async function onDomContentLoaded(): Promise<void> {
  await restoreOptions();
  registerEventHandlers();
  await localizePage();
  showBody();
}

// Register the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", onDomContentLoaded);

export {};
