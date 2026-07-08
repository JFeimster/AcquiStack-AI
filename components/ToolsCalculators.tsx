
import React from 'react';
import { CalculatorIcon } from './icons';
import DSCRCalculator from './calculators/DSCRCalculator';
import PandLAdjuster from './calculators/PandLAdjuster';
import SBAForm413 from './calculators/SBAForm413';
import QoEAnalyzer from './calculators/QoEAnalyzer';
import BusinessValuationCalculator from './calculators/BusinessValuationCalculator';
import SDECalculator from './calculators/SDECalculator';
import SBAEligibilityChecklist from './calculators/SBAEligibilityChecklist';
import { Deal } from '../types';

interface ToolsCalculatorsProps {
  currentDeal?: Deal | null;
}

const ToolsCalculators: React.FC<ToolsCalculatorsProps> = ({ currentDeal = null }) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center mb-1">
          <CalculatorIcon className="w-8 h-8 text-brand-blue-600 dark:text-brand-blue-400 mr-3" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Financial Tools & SBA Compliance Suite</h2>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 ml-11">Perform essential calculations, audit discretionary add-backs, and screen deals against active SBA eligibility SOPs.</p>
      </div>

      {/* SBA SOP 50 10 Eligibility Checklist */}
      <div className="pt-2">
        <SBAEligibilityChecklist currentDeal={currentDeal} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <DSCRCalculator />
        <PandLAdjuster />
      </div>

      <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
        <SDECalculator currentDeal={currentDeal} />
      </div>

      <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
        <BusinessValuationCalculator />
      </div>

      <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
        <QoEAnalyzer />
      </div>

      <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
        <SBAForm413 />
      </div>
    </div>
  );
};

export default ToolsCalculators;
