let accessToken = null;
let refreshToken = null;

module.exports = {
    setTokens: (newAccessToken, newRefreshToken) => {
        accessToken = newAccessToken;
        refreshToken = newRefreshToken;
    },
    getAccessToken: () => {
        return accessToken;
    },
    getRefreshToken: () => {
        return refreshToken;
    },
};