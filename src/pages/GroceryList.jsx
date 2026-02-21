import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Share2, Download } from 'lucide-react';
import { generateGroceryList } from '../utils/nutritionEngine';
import styles from './GroceryList.module.css';

export default function GroceryList() {
    const navigate = useNavigate();
    const [groceryItems, setGroceryItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        const storedPlan = localStorage.getItem('generatedPlan');
        if (storedPlan) {
            const plan = JSON.parse(storedPlan);
            const list = generateGroceryList(plan.weeklyPlan);
            setGroceryItems(list);
        } else {
            navigate('/nutrition');
        }
    }, [navigate]);

    const toggleItem = (name) => {
        setCheckedItems(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const handleCopy = () => {
        const text = groceryItems.map(item => `- ${item.name} (x${item.count})`).join('\n');
        navigator.clipboard.writeText(`My Grocery List:\n${text}`);
        alert("Copied to clipboard!");
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => navigate(-1)} className={styles.iconBtn}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Grocery List</h1>
                <button onClick={handleCopy} className={styles.iconBtn}>
                    <Share2 size={24} />
                </button>
            </header>

            <div className={styles.listContainer}>
                {groceryItems.map((item, idx) => {
                    const isChecked = checkedItems[item.name];
                    return (
                        <div
                            key={idx}
                            className={`${styles.itemRow} ${isChecked ? styles.checkedRow : ''}`}
                            onClick={() => toggleItem(item.name)}
                        >
                            <div className={`${styles.checkbox} ${isChecked ? styles.checkedBox : ''}`}>
                                {isChecked && <Check size={14} color="white" />}
                            </div>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{item.name}</span>
                                {item.count > 1 && <span className={styles.itemCount}>{item.count} meals</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.footer}>
                <button className={styles.exportBtn}>
                    <Download size={18} /> Export PDF
                </button>
            </div>
        </div>
    );
}
