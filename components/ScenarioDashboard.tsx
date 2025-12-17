import React, { useState, useEffect } from 'react';
import { Scenario, ChartDataPoint } from '../types';
import { CapitalStackBuilderIcon, CheckCircleIcon, TrashIcon } from './icons';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import CapitalStackChart from './CapitalStackChart';

interface ScenarioDashboardProps {
    scenarios: Scenario[];
    onUpdateScenario: (scenarioId: number, updates: Partial<Scenario>) => void;
    onDeleteScenario: (scenarioId: number) => void;
    onSetPrimaryScenario: (scenarioId: number) => void;
    onRunNewScenario: () => void;
}

const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return <span className="text-gray-500">N/A</span>;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatDSCR = (value: number | null) => {
    if (value === null || value === undefined) return <span className="text-gray-500">N/A</span>;
    return `${value.toFixed(2)}x`;
};

const EditableField: React.FC<{ value: string; onSave: (newValue: string) => void; type?: 'input' | 'textarea' }> = ({ value, onSave, type = 'input' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    useEffect(() => {
        setText(value);
    }, [value]);

    const handleSave = () => {
        onSave(text);
        setIsEditing(false);
    };

    if (isEditing) {
        const commonProps = {
            value: text,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setText(e.target.value),
            onBlur: handleSave,
            onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSave(); },
            autoFocus: true,
            className: "w-full bg-white dark:bg-gray-900 border border-brand-blue-500 rounded-md p-1 -m-1 focus:outline-none"
        };
        return type === 'textarea'
            ? <textarea {...commonProps} rows={3} />
            : <input {...commonProps} type="text" />;
    }

    return (
        <div onClick={() => setIsEditing(true)} className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer p-1 -m-1 rounded-md min-h-[24px]">
            {value || <span className="text-gray-400">Click to add notes...</span>}
        </div>
    );
};

const parseCapitalStack = (fullOutput: string): ChartDataPoint[] => {
    const sourcesSection = fullOutput.match(/\*\*Sources:\*\*\n([\s\S]*?)(\n\n|\*\*Uses:\*\*|\*\*KEY_METRICS_START\*\*)/);
    if (!sourcesSection || !sourcesSection[1]) {
        return [];
    }

    const lines = sourcesSection[1].split('\n').filter(line => line.trim().startsWith('-'));
    
    const colorMap: { [key: string]: string } = {
        'sba 7(a) loan': '#3b82f6', // brand-blue-500
        'seller note': '#14b8a6',   // teal-500
        'borrower equity': '#10b981', // emerald-500
        'gift funds': '#8b5cf6',      // violet-500
        'rollover equity': '#ec4899', // pink-500
    };
    const fallbackColors = ['#f97316', '#d97706', '#64748b']; // orange, amber, slate
    let colorIndex = 0;

    const data: ChartDataPoint[] = [];

    for (const line of lines) {
        const match = line.match(/- (.*?):\s*\$([\d,]+)/);
        if (match) {
            const name = match[1].trim();
            const value = parseInt(match[2].replace(/,/g, ''), 10);
            
            const normalizedName = name.toLowerCase();
            const color = colorMap[normalizedName] || fallbackColors[colorIndex++ % fallbackColors.length];

            data.push({ name, value, color });
        }
    }

    return data;
};


const ScenarioDashboard: React.FC<ScenarioDashboardProps> = ({ scenarios, onUpdateScenario, onDeleteScenario, onSetPrimaryScenario, onRunNewScenario }) => {
    const [expandedScenarioId, setExpandedScenarioId] = useState<number | null>(null);
    const primaryScenario = scenarios.find(s => s.isPrimary);
    const chartData = primaryScenario ? parseCapitalStack(primaryScenario.fullOutput) : [];

    if (scenarios.length === 0) {
        return (
            <div className="text-center bg-white dark:bg-gray-900 p-12 rounded-lg shadow-md">
                <CapitalStackBuilderIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">No Scenarios Saved Yet</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Run the "Capital Stack Builder" agent to create and save your first financial scenario.</p>
                <button
                    onClick={onRunNewScenario}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
                >
                    Run New Scenario
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {primaryScenario && chartData.length > 0 && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Primary Scenario Breakdown</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">A visual breakdown of the capital stack for your primary scenario, "{primaryScenario.name}".</p>
                    <CapitalStackChart data={chartData} />
                </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Scenario Comparison</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Compare financial models to find the optimal structure.</p>
                    </div>
                    <button
                        onClick={onRunNewScenario}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500"
                    >
                        Run Another Scenario
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="w-1/5 text-left p-4 font-semibold text-gray-600 dark:text-gray-300">Metric</th>
                                {scenarios.map(scenario => (
                                    <th key={scenario.id} className="text-left p-4 font-semibold text-gray-800 dark:text-white border-l dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <EditableField value={scenario.name} onSave={(name) => onUpdateScenario(scenario.id, { name })} />
                                            {scenario.isPrimary && <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900 px-2 py-0.5 rounded-full">Primary</span>}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b dark:border-gray-700">
                                <td className="p-4 align-top">Total Equity Needed</td>
                                {scenarios.map(s => <td key={s.id} className="p-4 align-top font-semibold text-lg border-l dark:border-gray-700">{formatCurrency(s.metrics.totalEquityNeeded)}</td>)}
                            </tr>
                            <tr className="border-b dark:border-gray-700">
                                <td className="p-4 align-top">DSCR Estimate</td>
                                {scenarios.map(s => <td key={s.id} className="p-4 align-top border-l dark:border-gray-700">{formatDSCR(s.metrics.dscrEstimate)}</td>)}
                            </tr>
                            <tr className="border-b dark:border-gray-700">
                                <td className="p-4 align-top">Post-Close Liquidity</td>
                                {scenarios.map(s => <td key={s.id} className="p-4 align-top border-l dark:border-gray-700">{formatCurrency(s.metrics.postCloseLiquidity)}</td>)}
                            </tr>
                            <tr className="border-b dark:border-gray-700">
                                <td className="p-4 align-top">Notes</td>
                                {scenarios.map(s => (
                                    <td key={s.id} className="p-4 align-top border-l dark:border-gray-700">
                                        <EditableField value={s.notes} onSave={(notes) => onUpdateScenario(s.id, { notes })} type="textarea"/>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 align-top">Actions</td>
                                {scenarios.map(s => (
                                    <td key={s.id} className="p-4 align-top border-l dark:border-gray-700 space-y-2">
                                        <button
                                            onClick={() => onSetPrimaryScenario(s.id)}
                                            disabled={s.isPrimary}
                                            className="w-full flex items-center justify-center text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircleIcon className="w-4 h-4 mr-1.5"/> Set as Primary
                                        </button>
                                        <button
                                            onClick={() => setExpandedScenarioId(expandedScenarioId === s.id ? null : s.id)}
                                            className="w-full text-sm font-medium text-brand-blue-600 dark:text-brand-blue-400 hover:underline"
                                        >
                                            {expandedScenarioId === s.id ? 'Hide Full Report' : 'Show Full Report'}
                                        </button>
                                        <button
                                            onClick={() => onDeleteScenario(s.id)}
                                            className="w-full flex items-center justify-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-1.5" /> Delete
                                        </button>
                                    </td>
                                ))}
                            </tr>
                            {expandedScenarioId && (
                                <tr>
                                    <td colSpan={scenarios.length + 1} className="p-0">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800">
                                            <h4 className="font-semibold text-lg mb-2">Full Report for "{scenarios.find(s=>s.id === expandedScenarioId)?.name}"</h4>
                                            <div
                                                className="prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-gray-900 p-4 rounded-md border dark:border-gray-700"
                                                dangerouslySetInnerHTML={{ __html: marked.parse(scenarios.find(s => s.id === expandedScenarioId)?.fullOutput || '') }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ScenarioDashboard;