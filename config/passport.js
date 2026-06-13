const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("⚠️  Google OAuth not configured — skipping Google strategy.");
} else {
passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    const google_Id = profile.id;
    const name = profile.displayName;
    const email = profile.emails[0].value;
    const avatar = profile.photos[0].value;

    try {
        const clientCheck = await db.query(
            'SELECT * FROM "Clients" WHERE "googleId" = $1 OR "clientEmail" = $2', 
            [google_Id, email]
        );

        if (clientCheck.rows.length > 0) {
            let client = clientCheck.rows[0];

            // If client exists but hasn't linked Google details yet
            if (!client.googleId) {
                const updateGoogleId = await db.query(
                    'UPDATE "Clients" SET "googleId" = $1, "clientAvatar" = $2 WHERE "clientId" = $3 RETURNING *', 
                    [google_Id, avatar, client.clientId]
                );
                client = updateGoogleId.rows[0];
            }
            return done(null, client);
        }

        const newClientId = 'cli_' + Date.now(); 

        const newClient = await db.query(
            'INSERT INTO "Clients" ("clientId", "googleId", "clientName", "clientEmail", "clientAvatar") VALUES ($1, $2, $3, $4, $5) RETURNING *', 
            [newClientId, google_Id, name, email, avatar]
        );
        
        return done(null, newClient.rows[0]);
    } catch (err) {
        console.error("Error during Google authentication:", err);
        return done(err, null);
    }
}));
} // end Google strategy guard

passport.serializeUser((client, done) => {
    done(null, client.clientId); 
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query('SELECT * FROM "Clients" WHERE "clientId" = $1', [id]);
        done(null, result.rows[0]);
    } catch (err) {
        console.error("Error during deserialization:", err);
        done(err, null);
    }
});