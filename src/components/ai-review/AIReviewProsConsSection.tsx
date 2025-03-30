
import React from 'react';
import { Check, X } from 'lucide-react';

interface AIReviewProsConsSectionProps {
  pros: string[];
  cons: string[];
}

const AIReviewProsConsSection: React.FC<AIReviewProsConsSectionProps> = ({ pros, cons }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="space-y-3">
        <h4 className="text-lg font-medium flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          Pros
        </h4>
        <ul className="space-y-2">
          {pros && pros.map((pro, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
              <span className="text-white/80">{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-medium flex items-center gap-2">
          <X className="h-5 w-5 text-red-500" />
          Cons
        </h4>
        <ul className="space-y-2">
          {cons && cons.map((con, index) => (
            <li key={index} className="flex items-start gap-2">
              <X className="h-4 w-4 text-red-500 mt-1 shrink-0" />
              <span className="text-white/80">{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AIReviewProsConsSection;
