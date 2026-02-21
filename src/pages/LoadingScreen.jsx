import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([
        { id: 1, label: 'Analyzing profile', status: 'pending' }, // pending, active, done
        { id: 2, label: 'Preparing health vault', status: 'pending' },
        { id: 3, label: 'Setting up AI assistant', status: 'pending' },
    ]);

    useEffect(() => {
        // Simulate tasks completing
        const runTasks = async () => {
            // Task 1
            setTasks(prev => prev.map(t => t.id === 1 ? { ...t, status: 'active' } : t));
            await new Promise(r => setTimeout(r, 1000));
            setTasks(prev => prev.map(t => t.id === 1 ? { ...t, status: 'done' } : t));

            // Task 2
            setTasks(prev => prev.map(t => t.id === 2 ? { ...t, status: 'active' } : t));
            await new Promise(r => setTimeout(r, 1200));
            setTasks(prev => prev.map(t => t.id === 2 ? { ...t, status: 'done' } : t));

            // Task 3
            setTasks(prev => prev.map(t => t.id === 3 ? { ...t, status: 'active' } : t));
            await new Promise(r => setTimeout(r, 1000));
            setTasks(prev => prev.map(t => t.id === 3 ? { ...t, status: 'done' } : t));

            // Done
            setTimeout(() => navigate('/'), 500);
        };

        runTasks();
    }, [navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.ringContainer}>
                <div className={styles.spinner}></div>
                {/* Simple spinner ring animation */}
            </div>

            <div className={styles.taskList}>
                {tasks.map(task => (
                    <div key={task.id} className={styles.taskItem}>
                        <div className={`${styles.checkbox} ${task.status === 'done' ? styles.done : ''} ${task.status === 'active' ? styles.active : ''}`}>
                            {task.status === 'done' && <Check size={14} color="white" />}
                        </div>
                        <span className={`${styles.taskLabel} ${task.status === 'active' || task.status === 'done' ? styles.visible : ''}`}>
                            {task.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
