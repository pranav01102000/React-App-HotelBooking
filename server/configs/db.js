import mongoose from 'mongoose';

const connectDB = async () => {
    // Set up event listeners BEFORE attempting to connect
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    mongoose.connection.on('error', (err) => console.error("Database Connection Error:", err.message));
    mongoose.connection.on('disconnected', () => console.warn("Database Disconnected"));

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/hotelbooking`);
        // The 'connected' event listener will now consistently catch the connection success.
        // No need for an extra console.log here, as the event listener handles it.
    } catch (error) {
        console.error("Failed to connect to database:", error.message); // Use console.error for errors
        // Optionally, you might want to exit the process or attempt reconnection here
        // process.exit(1);
    }
};

export default connectDB;