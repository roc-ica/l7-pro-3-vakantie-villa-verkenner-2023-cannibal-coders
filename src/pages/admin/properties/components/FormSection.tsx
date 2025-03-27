import React, { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold text-custom-dark mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div className="grid grid-cols-6 gap-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
