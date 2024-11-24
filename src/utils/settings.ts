import log from './logger';

// Define the structure of the options
export interface Options {
  OptionEstimateOvertime: string;
  // Add other options as needed
}

/**
 * Saves a single option to chrome.storage.sync.
 * @param key - The option key.
 * @param value - The option value.
 */
export function setOption(key: keyof Options, value: string): void {
  const data: Partial<Options> = {
    [key]: value
  };
  chrome.storage.sync.set(data, () => {
    if (chrome.runtime.lastError) {
      log.error(`Error saving ${key}:`, chrome.runtime.lastError.message);
    } else {
      log.info(`Saved ${key}:`, value);
    }
  });
}

/**
 * Saves multiple options to chrome.storage.sync.
 * @param optionsData - An object containing key-value pairs of options.
 */
export function setOptions(optionsData: Partial<Options>): void {
  chrome.storage.sync.set(optionsData, () => {
    if (chrome.runtime.lastError) {
      log.error("Error saving options:", chrome.runtime.lastError.message);
    } else {
      log.info("Options saved:", optionsData);
    }
  });
}

/**
 * Retrieves a single option from chrome.storage.sync.
 * @param key - The option key.
 * @returns A promise that resolves to the option value.
 */
export function getOption(key: keyof Options): Promise<string> {
  const defaultOptions: Partial<Options> = {
    OptionEstimateOvertime: '1',
    // Initialize other options with default values
  };

  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (items) => {
      if (chrome.runtime.lastError) {
        log.error(`Error retrieving ${key}:`, chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError);
      } else {
        const value = items[key] || defaultOptions[key];
        log.info(`Retrieved ${key}:`, value);
        if (typeof value !== 'string') {
          log.warn(`Expected string for ${key}, but got ${typeof value}. Using default.`);
          resolve(defaultOptions[key] as string);
        } else {
          resolve(value);
        }
      }
    });
  });
}

/**
 * Retrieves all options from chrome.storage.sync.
 * @returns A promise that resolves to the options.
 */
export function getOptions(): Promise<Options> {
  const defaultOptions: Options = {
    OptionEstimateOvertime: '1',
    // Initialize other options with default values
  };
  
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(defaultOptions, (items) => {
      if (chrome.runtime.lastError) {
        log.error("Error retrieving options:", chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError);
      } else {
        log.info("Retrieved options:", items);
        resolve(items as Options);
      }
    });
  });
}
