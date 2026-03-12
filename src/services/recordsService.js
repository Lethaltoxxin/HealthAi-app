/**
 * Records Service — localStorage-based scan record management
 * Stores scan results with date/time and unique IDs
 */

const STORAGE_KEY = 'healthai_scan_records';

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Get all saved records, sorted newest-first
 */
export function getRecords() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const records = JSON.parse(raw);
        return records.sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
    } catch (err) {
        console.error('Failed to read records:', err);
        return [];
    }
}

/**
 * Get a single record by ID
 */
export function getRecord(id) {
    const records = getRecords();
    return records.find(r => r.id === id) || null;
}

/**
 * Save a new scan record
 * @param {Object} record - { title, type, documentType, analysisText, confidence, extractedTextPreview, filename }
 * @returns {Object} The saved record with id and scannedAt
 */
export function saveRecord(record) {
    const records = getRecords();
    const newRecord = {
        id: generateId(),
        ...record,
        scannedAt: new Date().toISOString(),
    };
    records.unshift(newRecord);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
        console.error('Failed to save record:', err);
    }
    return newRecord;
}

/**
 * Delete a record by ID
 */
export function deleteRecord(id) {
    const records = getRecords();
    const filtered = records.filter(r => r.id !== id);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
        console.error('Failed to delete record:', err);
    }
}

/**
 * Get recent records (up to N)
 */
export function getRecentRecords(count = 5) {
    return getRecords().slice(0, count);
}

/**
 * Group records by date label ("Today", "Yesterday", or "MMM DD, YYYY")
 */
export function getRecordsGroupedByDate() {
    const records = getRecords();
    const groups = {};

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    for (const record of records) {
        const recordDate = new Date(record.scannedAt);
        const recordDay = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());

        let label;
        if (recordDay.getTime() === today.getTime()) {
            label = 'Today';
        } else if (recordDay.getTime() === yesterday.getTime()) {
            label = 'Yesterday';
        } else {
            label = recordDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: recordDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
            });
        }

        if (!groups[label]) groups[label] = [];
        groups[label].push(record);
    }

    return groups;
}

/**
 * Format a scannedAt ISO string to a time string like "2:30 PM"
 */
export function formatTime(isoString) {
    return new Date(isoString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Format a scannedAt ISO string to a full datetime string
 */
export function formatDateTime(isoString) {
    return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
