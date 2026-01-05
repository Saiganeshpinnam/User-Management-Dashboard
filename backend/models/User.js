import mongoose from "mongoose";

const GeoSchema = new mongoose.Schema({
  lat: { type: String, required: true },
  lng: { type: String, required: true }
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  geo: { type: GeoSchema, required: true }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  address: { type: AddressSchema, required: true }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
