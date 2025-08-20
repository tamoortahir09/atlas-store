'use client';

import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = onStepClick && stepNumber <= currentStep;

          return (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200 font-orbitron
                  ${isActive
                    ? 'bg-[#E60000] text-white shadow-lg shadow-[#E60000]/25'
                    : isCompleted
                    ? 'bg-[#E60000] text-white'
                    : 'bg-[#2a2a2a] text-[#666666] border border-[#444444]'
                  }
                  ${isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                `}
              >
                {isCompleted ? (
                  <Check size={16} />
                ) : (
                  stepNumber
                )}
              </button>

              {/* Step Label */}
              <div className="ml-3 hidden md:block">
                <div className={`text-sm font-medium transition-colors font-orbitron ${
                  isActive ? 'text-white' : isCompleted ? 'text-[#E60000]' : 'text-[#666666]'
                }`}>
                  {step}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 transition-colors ${
                  stepNumber < currentStep ? 'bg-[#E60000]' : 'bg-[#444444]'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}