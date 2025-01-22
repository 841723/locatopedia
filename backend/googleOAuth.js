const { OAuth2Client } = require("google-auth-library");

const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_OAUTH_CLIENT_ID);

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_OAUTH_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

module.exports = { verifyGoogleToken };
