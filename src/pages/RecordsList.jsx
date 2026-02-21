import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserDocuments } from '../services/dbService';
import styles from './RecordsList.module.css';

export default function RecordsList() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDocs() {
            if (currentUser) {
                try {
                    const docs = await getUserDocuments(currentUser.uid);
                    setDocuments(docs);
                } catch (error) {
                    console.error("Failed to load documents", error);
                }
            }
            setLoading(false);
        }
        fetchDocs();
    }, [currentUser]);

    if (loading) {
        return <div className={styles.loading}>Loading records...</div>;
    }

    if (documents.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.iconWrapper}>
                    <FolderOpen size={48} color="#D0E6F5" fill="#E6F3F0" />
                </div>
                <h2 className={styles.emptyTitle}>No documents yet.</h2>
                <p className={styles.emptyText}>Upload prescriptions or reports to build your vault.</p>
                <button
                    className={styles.uploadBtn}
                    onClick={() => navigate('/scan')}
                >
                    Upload a document
                </button>
                <p className={styles.secureNote}>
                    <span className={styles.lockIcon}>🔒</span> Your health data is Secure & Private
                </p>
            </div>
        );
    }

    return (
        <div className={styles.listContainer}>
            <h1 className={styles.pageTitle}>Records</h1>
            <div className={styles.list}>
                {documents.map((doc) => (
                    <div key={doc.id} className={styles.card} onClick={() => navigate(`/records/${doc.id}`)}>
                        <div className={styles.cardIcon}>
                            <FileText size={24} className={styles.fileIcon} />
                        </div>
                        <div className={styles.cardInfo}>
                            <h3>{doc.name || 'Untitled Document'}</h3>
                            <p>{new Date(doc.createdAt?.toDate()).toLocaleDateString()}</p>
                        </div>
                        <ChevronRight size={20} className={styles.arrow} />
                    </div>
                ))}
            </div>
            <button
                className={styles.fab}
                onClick={() => navigate('/scan')}
            >
                +
            </button>
        </div>
    );
}
