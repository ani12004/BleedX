import { updateEconomy, getEconomy } from './utils/database.js';

try {
    console.log("Testing updateEconomy (setbio)...");
    const userId = 'test_user_123';

    // Test Upsert (Insert new user)
    updateEconomy(userId, { bio: 'Hello World' });

    // Verify
    const user = getEconomy(userId);
    console.log("User after update:", user);

    if (user.bio === 'Hello World') {
        console.log("Success!");
    } else {
        console.error("Failed: Bio mismatch");
    }
} catch (error) {
    console.error("Failed:", error);
}
