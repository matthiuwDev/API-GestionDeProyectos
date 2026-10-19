import mongoose from 'mongoose';


const connectMongoDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.warn('Falta definir MONGO_URI.');
        return;
    }

    await mongoose.connect(uri);
    console.log('MongoDB conectado correctamente');
};

export default connectMongoDB;
