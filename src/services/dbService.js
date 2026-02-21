import { db } from "./firebase";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    deleteDoc
} from "firebase/firestore";

// User Operations
export const getUserProfile = async (userId) => {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
};

export const updateUserProfile = async (userId, data) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
};

// Document Operations
export const uploadDocumentRecord = async (userId, fileData) => {
    return await addDoc(collection(db, "documents"), {
        userId,
        ...fileData,
        createdAt: serverTimestamp(),
        status: "processing" // initial status
    });
};

export const getUserDocuments = async (userId) => {
    const q = query(
        collection(db, "documents"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateDocumentStatus = async (docId, status, analysisData = null) => {
    const docRef = doc(db, "documents", docId);
    const updateData = { status };
    if (analysisData) updateData.analysis = analysisData;
    await updateDoc(docRef, updateData);
};

// Chat Operations
export const sendMessage = async (userId, content, role = "user") => {
    return await addDoc(collection(db, "chat_messages"), {
        userId,
        content,
        role,
        timestamp: serverTimestamp()
    });
};

export const getChatHistory = async (userId) => {
    const q = query(
        collection(db, "chat_messages"),
        where("userId", "==", userId),
        orderBy("timestamp", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
