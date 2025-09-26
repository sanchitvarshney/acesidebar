import React from "react";

const RightSidePanel = ({ steps, currentStep }: any) => {
  return (
    <div className="p-6 h-[calc(100vh-80px] overflow-hidden">
      <h2 className="text-lg font-semibold mb-6">Setup Progress</h2>

      {/* Timeline UI */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-400"></div>

        {steps.map((step: any, index: number) => (
          <div key={step.id} className="relative mb-8 last:mb-0">
            {/* Timeline Node */}
            <div className="flex items-start space-x-4">
              {/* Step Number & Icon */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                    index === currentStep
                      ? "bg-blue-500 border-blue-300 shadow-lg shadow-blue-500/50"
                      : index < currentStep
                      ? "bg-green-500 border-green-300"
                      : "bg-gray-600 border-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Step Icon */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-4 h-4 object-contain"
                  />
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`py-2 px-4 rounded-lg transition-all duration-300 ${
                    index === currentStep
                      ? "bg-blue-500/20 border border-blue-300"
                      : index < currentStep
                      ? "bg-green-500/20 border border-green-300"
                      : "bg-gray-600/20 border border-gray-400"
                  }`}
                >
                  <h3
                    className={`font-semibold text-[11px] mb-1 ${
                      index === currentStep
                        ? "text-blue-100"
                        : index < currentStep
                        ? "text-green-100"
                        : "text-gray-300"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-[10px] ${
                      index === currentStep
                        ? "text-blue-200"
                        : index < currentStep
                        ? "text-green-200"
                        : "text-gray-400"
                    }`}
                  >
                    {index === currentStep
                      ? "In Progress"
                      : index < currentStep
                      ? "Completed"
                      : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidePanel;
