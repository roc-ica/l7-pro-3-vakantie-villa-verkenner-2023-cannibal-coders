import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PropertyList from '../../components/property/PropertyList';
import PropertySearch from '../../components/property/search/PropertySearch';
import { setProperties, setLoading } from './propertySlice';
import { propertyService } from '../../services/api';
import { PropertyFilter } from '../../types/property';
import { jsPDF } from 'jspdf';

const PropertyPagePDFGenerator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { properties, loading } = useAppSelector((state) => state.properties);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (filters: PropertyFilter) => {
    try {
      setError(null);
      dispatch(setLoading(true));
      const data = await propertyService.getProperties(filters);
      
      if (Array.isArray(data)) {
        dispatch(setProperties(data));
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch properties. Please try again.');
      console.error('Error fetching properties:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    handleSearch({});
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Property List', 10, 10);
    properties.forEach((property, index) => {
      doc.text(`${index + 1}. ${property.name} - ${property.location}`, 10, 20 + (index * 10));
    });
    doc.save('property-list.pdf');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Properties with PDF Download</h1>
        <button onClick={generatePDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Download PDF
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <PropertySearch onSearch={handleSearch} />
        </div>
        <div className="lg:w-3/4">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <PropertyList properties={properties} view="grid" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyPagePDFGenerator;
