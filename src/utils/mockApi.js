// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
    parseReport: async (file) => {
        await delay(1500); // Simulate processing time
        return {
            reportId: 'rep_' + Math.random().toString(36).substr(2, 9),
            parsed: [
                { test: 'Glucose', value: '98 mg/dL', range: '70-100', note: 'Normal' },
                { test: 'Total Cholesterol', value: '185 mg/dL', range: '<200', note: 'Normal' },
                { test: 'Hemoglobin A1c', value: '5.4%', range: '<5.7%', note: 'Normal' },
                { test: 'Vitamin D', value: '25 ng/mL', range: '30-100', note: 'Low' }
            ]
        };
    },

    scanPrescription: async (file) => {
        await delay(2000); // Simulate OCR
        return {
            meds: [
                { name: 'Metformin', dose: '500 mg', frequency: 'Twice daily', notes: 'Take with food' },
                { name: 'Lisinopril', dose: '10 mg', frequency: 'Once daily', notes: 'For blood pressure' }
            ]
        };
    },

    getArticles: async (category) => {
        await delay(500);
        return [
            { id: 1, title: 'Understanding your results', summary: 'How to read a lab report.' },
            { id: 2, title: 'Next steps', summary: 'What to do if values are out of range.' }
        ];
    }
};
