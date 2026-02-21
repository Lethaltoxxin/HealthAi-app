import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (userId, file) => {
    const fileExtension = file.name.split('.').pop();
    const filePath = `uploads/${userId}/${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, filePath);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
        path: filePath,
        url: downloadURL,
        name: file.name,
        type: file.type
    };
};
