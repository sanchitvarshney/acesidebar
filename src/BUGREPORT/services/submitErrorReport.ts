/**
 * Submit Error Report API Service
 * 
 * Handles submission of error reports to the backend API with comprehensive
 * logging and data collection for debugging purposes.
 */

import { BugReportPayload } from '../types';

/**
 * Monitor network requests by intercepting fetch and XMLHttpRequest
 */
const monitorNetworkRequests = () => {
  const networkData = {
    fetch: [] as Array<any>,
    xhr: [] as Array<any>,
    websocket: [] as Array<any>
  };


  // Intercept fetch requests
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const startTime = performance.now();
    try {
      const response = await originalFetch(...args);
      const endTime = performance.now();
      
      networkData.fetch.push({
        url: args[0]?.toString() || 'unknown',
        method: args[1]?.method || 'GET',
        duration: endTime - startTime,
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString(),
        type: 'realtime' // Mark as real-time data
      });
      
      return response;
    } catch (error) {
      const endTime = performance.now();
      
      networkData.fetch.push({
        url: args[0]?.toString() || 'unknown',
        method: args[1]?.method || 'GET',
        duration: endTime - startTime,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        type: 'realtime' // Mark as real-time data
      });
      
      throw error;
    }
  };

  // Intercept XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
    (this as any)._method = method;
    (this as any)._url = url;
    (this as any)._startTime = performance.now();
    return originalXHROpen.call(this, method, url, async, username, password);
  };
  
  XMLHttpRequest.prototype.send = function(...args: any[]) {
    const xhr = this as any;
    const startTime = xhr._startTime || performance.now();
    
    xhr.addEventListener('loadend', () => {
      const endTime = performance.now();
      
      networkData.xhr.push({
        url: xhr._url || 'unknown',
        method: xhr._method || 'GET',
        duration: endTime - startTime,
        status: xhr.status,
        statusText: xhr.statusText,
        responseSize: xhr.responseText?.length || 0,
        timestamp: new Date().toISOString(),
        type: 'realtime' // Mark as real-time data
      });
    });
    
    xhr.addEventListener('error', () => {
      const endTime = performance.now();
      
      networkData.xhr.push({
        url: xhr._url || 'unknown',
        method: xhr._method || 'GET',
        duration: endTime - startTime,
        status: 'error',
        statusText: 'Network Error',
        error: 'XHR request failed',
        timestamp: new Date().toISOString(),
        type: 'realtime'
      });
    });
    
    return originalXHRSend.call(this, ...args);
  };

  // Monitor WebSocket connections
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(url: string | URL, protocols?: string | string[]) {
    const ws = new originalWebSocket(url, protocols);
    const startTime = performance.now();
    
    networkData.websocket.push({
      url: url.toString(),
      method: 'WEBSOCKET',
      duration: 0, // Will be updated on close
      status: 'connecting',
      timestamp: new Date().toISOString(),
      type: 'realtime'
    });
    
    ws.addEventListener('open', () => {
      const endTime = performance.now();
      networkData.websocket.push({
        url: url.toString(),
        method: 'WEBSOCKET',
        duration: endTime - startTime,
        status: 'open',
        timestamp: new Date().toISOString(),
        type: 'realtime'
      });
    });
    
    ws.addEventListener('close', (event) => {
      const endTime = performance.now();
      networkData.websocket.push({
        url: url.toString(),
        method: 'WEBSOCKET',
        duration: endTime - startTime,
        status: 'closed',
        code: event.code,
        reason: event.reason,
        timestamp: new Date().toISOString(),
        type: 'realtime'
      });
    });
    
    ws.addEventListener('error', (event) => {
      const endTime = performance.now();
      networkData.websocket.push({
        url: url.toString(),
        method: 'WEBSOCKET',
        duration: endTime - startTime,
        status: 'error',
        error: 'WebSocket connection failed',
        timestamp: new Date().toISOString(),
        type: 'realtime'
      });
    });
    
    return ws;
  } as any;

  return networkData;
};

/**
 * Get user's IP address using a public IP service
 */
const getUserIPAddress = async (): Promise<string> => {
  try {
    // Try multiple IP services for better reliability
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://api.ip.sb/geoip',
      'https://ipinfo.io/json'
    ];

    for (const service of ipServices) {
      try {
        const response = await fetch(service, { 
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const data = await response.json();
          // Different services return IP in different fields
          const ip = data.ip || data.query || data.ipAddress;
          if (ip && typeof ip === 'string') {
            return ip;
          }
        }
      } catch (e) {
        // Continue to next service if this one fails
        continue;
      }
    }
    
    return 'Unable to detect IP address';
  } catch (e) {
    return 'IP detection failed';
  }
};

/**
 * Collect comprehensive browser and system information
 * Groups data by category for better organization
 */
const collectSystemInfo = async () => {
  // Start monitoring network requests
  const networkData = monitorNetworkRequests();
  
  const info = {
    // IP Address
    ipAddress: await getUserIPAddress(),
    
    // Network requests
    network: networkData,
    
    
    // Storage
    storage: {
      cookies: {} as Record<string, string>,
      sessionStorage: {} as Record<string, string>,
      localStorage: {} as Record<string, string>,
      indexedDB: [] as Array<any>
    },
    
    // Browser info
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints
    },
    
    // Screen info
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth
    },
    
    // Window info
    window: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      devicePixelRatio: window.devicePixelRatio,
      location: {
        href: window.location.href,
        origin: window.location.origin,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
      }
    },
    
    // Performance info
    performance: {
      timing: performance.timing ? {
        navigationStart: performance.timing.navigationStart,
        loadEventEnd: performance.timing.loadEventEnd,
        domContentLoadedEventEnd: performance.timing.domContentLoadedEventEnd
      } : null,
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null
    },
    
    // Timestamp
    timestamp: new Date().toISOString()
  };



  // Collect storage information
  try {
    // Parse cookies properly with better debugging
    const cookieString = document.cookie;
    console.log('Raw cookie string:', cookieString);
    
    if (cookieString && cookieString.trim() !== '') {
      cookieString.split(';').forEach(cookie => {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie) {
          const equalIndex = trimmedCookie.indexOf('=');
          if (equalIndex > 0) {
            const name = trimmedCookie.substring(0, equalIndex).trim();
            const value = trimmedCookie.substring(equalIndex + 1).trim();
            if (name && value) {
              try {
                info.storage.cookies[name] = decodeURIComponent(value);
              } catch (e) {
                // If decoding fails, store the raw value
                info.storage.cookies[name] = value;
              }
            }
          }
        }
      });
    } else {
      console.log('No cookies found or empty cookie string');
    }
    
    console.log('Parsed cookies:', info.storage.cookies);
    
    // If no cookies were found, try alternative methods
    if (Object.keys(info.storage.cookies).length === 0) {
      console.log('No cookies found with standard method, trying alternatives...');
      
      // Try to get cookies from document.cookie again with different parsing
      const altCookieString = document.cookie;
      if (altCookieString) {
        // Try splitting by semicolon and space
        const cookies = altCookieString.split(/;\s*/);
        cookies.forEach(cookie => {
          if (cookie.includes('=')) {
            const parts = cookie.split('=', 2);
            if (parts.length === 2) {
              const name = parts[0].trim();
              const value = parts[1].trim();
              if (name && value) {
                info.storage.cookies[name] = value;
              }
            }
          }
        });
      }
      
      // Try to access cookies through navigator if available
      if ((navigator as any).cookieEnabled && (window as any).chrome?.cookies) {
        console.log('Chrome extension cookies API available');
      }
      
      console.log('Alternative parsing result:', info.storage.cookies);
    }

    // Session Storage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        if (value !== null) {
          info.storage.sessionStorage[key] = value;
        }
      }
    }

    // Local Storage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          info.storage.localStorage[key] = value;
        }
      }
    }
  } catch (e) {
    console.warn('Could not collect storage information:', e);
  }

  // Collect historical network data from performance API
  try {
    const performanceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    performanceEntries.forEach(entry => {
      const resourceInfo = {
        url: entry.name,
        method: 'GET', 
        duration: entry.duration,
        size: entry.transferSize,
        status: (entry as any).responseStatus || 'unknown', 
        timestamp: new Date(entry.startTime).toISOString(),
        type: 'historical'
      };

      // Categorize by initiator type
      switch (entry.initiatorType) {
        case 'fetch':
          info.network.fetch.push(resourceInfo);
          break;
        case 'xmlhttprequest':
          info.network.xhr.push(resourceInfo);
          break;
        case 'websocket':
          info.network.websocket.push(resourceInfo);
          break;
        default:
          // For other types, try to determine if it's a fetch request
          if (entry.name.includes('api') || entry.name.includes('fetch')) {
            info.network.fetch.push(resourceInfo);
          }
      }
    });

  } catch (e) {
    console.warn('Could not collect historical network data:', e);
  }
  return info;
};

export const submitErrorReport = async (
  payload: BugReportPayload,
  requestId: string,
  errorId: string
): Promise<any> => {
  try {
    // Collect comprehensive system information
    const systemInfo = await collectSystemInfo();
    
    // Construct API URL
    const apiUrl = `https://ajaxter.com/report/error/${requestId}/${errorId}`;

    // Prepare the complete payload
    const completePayload = {
      feedback: payload.feedback,
      systemInfo: systemInfo,
      // Additional metadata
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    console.log('Submitting error report to:', apiUrl);
    console.log('Complete payload:', completePayload);

    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(completePayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Error report submitted successfully:', result);
    
    return result;

  } catch (error) {
    console.error('Failed to submit error report:', error);
    throw error;
  }
};

