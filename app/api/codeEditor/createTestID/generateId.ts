import { v4 as uuidv4 } from "uuid";

export function generateUniqueId() {
  // Generate a timestamp
  const timestamp = new Date().getTime();

  // Generate a random number
  const random = Math.floor(Math.random() * 10000);

  // Combine the timestamp and random number to create a unique ID
  const uniqueId = `${timestamp}-${random}`;

  return uniqueId;
}