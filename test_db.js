import { getEconomy } from './utils/database.js';

try {
    console.log("Testing getEconomy...");
    const user = getEconomy('123456789');
    console.log("Result:", user);
    console.log("Success!");
} catch (error) {
    console.error("Failed:", error);
}
