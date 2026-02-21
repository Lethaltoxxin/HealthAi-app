export const trackEvent = (eventName, payload = {}) => {
    console.group(`📊 Analytics Event: ${eventName}`);
    console.log('Payload:', payload);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();

    // In a real app, you would send this to your analytics provider (Google Analytics, Mixpanel, etc.)
};
