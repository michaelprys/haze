export const getRecoveryToken = () =>
    new URLSearchParams(window.location.hash.replace(/^#/, '')).get('access_token');
