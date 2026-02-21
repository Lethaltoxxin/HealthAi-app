import { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare, FileText, Pill, Apple, ArrowRight, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './Explore.module.css';

const slides = [
    {
        id: 1,
        title: 'Give me a 7-Day Diet Plan',
        subtitle: 'Eat smart, feel better every day.',
        cta: 'Get Started',
        bg: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2000&q=80', // Fresh healthy food
        path: '/nutrition'
    },
    {
        id: 2,
        title: 'Scan Prescription',
        subtitle: 'Know your medicines instantly.',
        cta: 'Scan Now',
        bg: 'https://images.unsplash.com/photo-1628771065518-0d82f0263320?auto=format&fit=crop&w=2000&q=80', // Pharmacy/Meds
        path: '/prescription'
    },
    {
        id: 3,
        title: 'AI Symptom Checker',
        subtitle: 'Get quick triage and guidance.',
        cta: 'Check Symptoms',
        bg: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=2000&q=80', // Doctor/Tech
        path: '/symptoms'
    },
    {
        id: 4,
        title: 'Personalised Workout',
        subtitle: 'Plans based on your goals.',
        cta: 'Build Plan',
        bg: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2000&q=80', // Gym
        path: '/workout'
    },
    {
        id: 5,
        title: 'Mindfulness & Sleep',
        subtitle: 'Recharge with guided meditation.',
        cta: 'Start',
        bg: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=2000&q=80', // Nature
        path: '/mindfulness'
    },
    {
        id: 6,
        title: 'Track Your progress',
        subtitle: 'See how far you have come.',
        cta: 'View Insights',
        bg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80', // Analytics
        path: '/progress'
    }
];

const whatsNew = [
    {
        id: 'chat',
        title: 'Chat',
        subtitle: 'Ask health questions.',
        icon: MessageSquare,
        bg: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'lab',
        title: 'Lab Report',
        subtitle: 'Read your reports.',
        icon: FileText,
        bg: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'prescription',
        title: 'Prescription',
        subtitle: 'Know your medicines',
        icon: Pill,
        bg: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'nutrition',
        title: 'Nutrition',
        subtitle: 'Track your meals.',
        icon: Apple,
        bg: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80'
    }
];

const library = [
    {
        key: 'heart',
        title: 'Heart Health',
        count: 3,
        color: '#FFE8E8',
        icon: '❤️',
        articles: [
            { title: 'Heart-Healthy Foods: 8 Steps to Prevent Heart Disease', summary: 'Mayo Clinic — Learn which foods protect your heart.', source: 'Mayo Clinic', url: 'https://www.mayoclinic.org/diseases-conditions/heart-disease/in-depth/heart-healthy-diet/art-20047702' },
            { title: 'Understanding Blood Pressure Readings', summary: 'American Heart Association — What your numbers mean.', source: 'AHA', url: 'https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings' },
            { title: 'How to Prevent Heart Disease', summary: 'Harvard Health — Evidence-based strategies for a healthier heart.', source: 'Harvard Health', url: 'https://www.health.harvard.edu/heart-health/preventing-heart-disease' }
        ]
    },
    {
        key: 'mental',
        title: 'Mental Wellness',
        count: 3,
        color: '#F3E8FF',
        icon: '🧠',
        articles: [
            { title: 'Relaxation Techniques: Breath Control Helps Quell Stress', summary: 'Harvard Health — Simple breathing exercises for daily calm.', source: 'Harvard Health', url: 'https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response' },
            { title: 'Tips for Better Sleep', summary: 'CDC — Healthy sleep habits and hygiene checklist.', source: 'CDC', url: 'https://www.cdc.gov/sleep/about/tips-for-better-sleep.html' },
            { title: '5 Things You Should Know About Stress', summary: 'NIMH — Understanding how stress affects your body and mind.', source: 'NIMH', url: 'https://www.nimh.nih.gov/health/publications/stress' }
        ]
    },
    {
        key: 'fitness',
        title: 'Fitness & Exercise',
        count: 3,
        color: '#ECFDF5',
        icon: '⚡',
        articles: [
            { title: 'Physical Activity Guidelines for Americans', summary: 'HHS — How much exercise you really need per week.', source: 'HHS', url: 'https://health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines' },
            { title: 'Benefits of Exercise', summary: 'MedlinePlus — Why regular physical activity matters.', source: 'MedlinePlus', url: 'https://medlineplus.gov/benefitsofexercise.html' },
            { title: 'Stretching: Focus on Flexibility', summary: 'Mayo Clinic — How stretching helps and best practices.', source: 'Mayo Clinic', url: 'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931' }
        ]
    },
    {
        key: 'nutrition',
        title: 'Nutrition',
        count: 3,
        color: '#FFF7ED',
        icon: '🍎',
        articles: [
            { title: 'Healthy Eating Plate', summary: 'Harvard T.H. Chan — A visual guide to creating balanced meals.', source: 'Harvard', url: 'https://www.hsph.harvard.edu/nutritionsource/healthy-eating-plate/' },
            { title: 'Dietary Guidelines for Americans', summary: 'USDA — Evidence-based nutritional advice for all ages.', source: 'USDA', url: 'https://www.dietaryguidelines.gov/' },
            { title: 'Vitamins and Minerals', summary: 'NIH — How micronutrients support your health.', source: 'NIH', url: 'https://www.nccih.nih.gov/health/vitamins-and-minerals' }
        ]
    },
    {
        key: 'conditions',
        title: 'Common Conditions',
        count: 3,
        color: '#EFF6FF',
        icon: '🩺',
        articles: [
            { title: 'Diabetes Overview', summary: 'WHO — Types, symptoms, and how to manage diabetes.', source: 'WHO', url: 'https://www.who.int/health-topics/diabetes' },
            { title: 'Fever: First Aid', summary: 'Mayo Clinic — When to seek care and how to treat fevers.', source: 'Mayo Clinic', url: 'https://www.mayoclinic.org/first-aid/first-aid-fever/basics/art-20056685' },
            { title: 'Common Cold', summary: 'CDC — Symptoms, prevention, and treatment.', source: 'CDC', url: 'https://www.cdc.gov/common-cold/about/index.html' }
        ]
    },
    {
        key: 'meds',
        title: 'Medications',
        count: 2,
        color: '#FFF1F2',
        icon: '💊',
        articles: [
            { title: 'Use Medicines Safely', summary: 'NIH — Tips for taking medications the right way.', source: 'NIH', url: 'https://www.nia.nih.gov/health/medicines-and-medication-management/safe-use-medicines-older-adults' },
            { title: 'Drug Interactions: What You Should Know', summary: 'FDA — How different medicines can affect each other.', source: 'FDA', url: 'https://www.fda.gov/drugs/resources-you-drugs/drug-interactions-what-you-should-know' }
        ]
    }
];

export default function Explore() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    // state for autoplay
    const [expandedCategory, setExpandedCategory] = useState(null);

    // Carousel Autoplay - Simplified and Robust
    useEffect(() => {
        let interval;
        if (autoplay) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 3500);
        }
        return () => clearInterval(interval);
    }, [autoplay]);

    const handleDotClick = (index) => {
        setCurrentSlide(index);
        // Do not disable autoplay permanently on click, let hover handle it
        // Or if we want to pause briefly:
        setAutoplay(false);
        setTimeout(() => setAutoplay(true), 5000);
    };

    const toggleCategory = (key) => {
        setExpandedCategory(expandedCategory === key ? null : key);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.pageTitle}>Explore</h1>
                <p className={styles.pageSubtitle}>Discover health resources and tools</p>
            </header>

            {/* Search Bar - White */}
            <div className={styles.searchBar}>
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search Health Library..."
                    className={styles.searchInput}
                />
            </div>

            {/* Banner Carousel */}
            <div
                className={styles.carousel}
                onMouseEnter={() => setAutoplay(false)}
                onMouseLeave={() => setAutoplay(true)}
            >
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={currentSlide}
                        className={styles.slide}
                        style={{ backgroundImage: `url(${slides[currentSlide].bg})` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={styles.overlay} />
                        <div className={styles.slideContent}>
                            <motion.h2
                                className={styles.slideTitle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {slides[currentSlide].title}
                            </motion.h2>
                            <motion.p
                                className={styles.slideSubtitle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {slides[currentSlide].subtitle}
                            </motion.p>
                            <motion.button
                                onClick={() => navigate(slides[currentSlide].path)}
                                className={styles.ctaLink}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {slides[currentSlide].cta} <ArrowRight size={18} />
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className={styles.carouselDots}>
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${currentSlide === i ? styles.activeDot : ''}`}
                            onClick={() => handleDotClick(i)}
                        />
                    ))}
                </div>
            </div>

            {/* What's New For You Grid */}
            <h2 className={styles.sectionTitle}>What's New for You</h2>
            <div className={styles.grid}>
                {whatsNew.map((item) => (
                    <motion.div
                        key={item.id}
                        className={styles.card}
                        style={{ backgroundImage: `url(${item.bg})` }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            if (item.id === 'chat') navigate('/chat');
                            if (item.id === 'lab') navigate('/lab-report');
                            if (item.id === 'prescription') navigate('/prescription');
                            if (item.id === 'nutrition') navigate('/nutrition');
                        }}
                    >
                        <div className={styles.cardOverlay} />
                        <div className={styles.cardContent}>
                            <div className={styles.cardIcon}>
                                <item.icon size={20} />
                            </div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardSubtitle}>{item.subtitle}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Restored Health Library Section */}
            <h2 className={styles.sectionTitle}>Health Library</h2>
            <motion.div className={styles.libraryGrid} layout>
                {library.map((cat) => {
                    const isExpanded = expandedCategory === cat.key;
                    return (
                        <motion.div
                            layout
                            key={cat.key}
                            className={styles.libraryCardWrapper}
                            style={{
                                flexBasis: isExpanded ? '100%' : 'calc(33.333% - 24px)',
                                zIndex: isExpanded ? 2 : 1
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            <motion.div
                                className={styles.libraryCard}
                                onClick={() => toggleCategory(cat.key)}
                                layout
                            >
                                <motion.div className={styles.libraryCardHeader} layout="position">
                                    <div className={styles.libraryIcon} style={{ background: cat.color }}>{cat.icon}</div>
                                    <div className={styles.libraryContent}>
                                        <h3 className={styles.libraryTitle}>{cat.title}</h3>
                                        <p className={styles.libraryCount}>
                                            {cat.articles.length > 0 ? `${cat.count} articles` : 'Coming soon'}
                                        </p>
                                    </div>
                                    {isExpanded && <X size={20} style={{ marginLeft: 'auto', color: '#999' }} />}
                                </motion.div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={styles.expandedContent}
                                        >
                                            {cat.articles.length > 0 ? cat.articles.map((article, idx) => (
                                                <a
                                                    key={idx}
                                                    className={styles.article}
                                                    href={article.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className={styles.articleLeft}>
                                                        <h4 className={styles.articleTitle}>{article.title}</h4>
                                                        <p className={styles.articleSummary}>{article.summary}</p>
                                                    </div>
                                                    <ExternalLink size={16} className={styles.articleLink} />
                                                </a>
                                            )) : (
                                                <p style={{ color: '#888', textAlign: 'center' }}>Coming soon...</p>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
