import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import PropertyList from '../../components/property/PropertyList';
import PropertySearch from '../../components/property/search/PropertySearch';
import { setProperties, setLoading } from './propertySlice';
import { propertyService } from '../../api/api';
import { PropertyFilter, Property } from '../../types/property';
import { generatePropertyPDF } from '../../components/pdf/PropertyPDFGenerator';
 
const PropertyPagePDFGenerator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { properties, loading } = useAppSelector((state) => state.properties);
  const [error, setError] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
 
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
 
  const handleGeneratePDF = async () => {
    if (!selectedProperty) {
      setError('Please select a property first');
      return;
    }
   
    try {
      setGeneratingPDF(true);
      setError(null);
     
      // Generate PDF for the selected property
      await generatePropertyPDF(selectedProperty);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.');
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };
 
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Properties with PDF Download</h1>
      </div>
     
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Generate Property PDF</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <select
            className="p-2 border rounded-md flex-grow"
            value={selectedProperty ? String(selectedProperty.id) : ''}
            onChange={(e) => {
              const propertyId = e.target.value;
              const property = properties.find(p => String(p.id) === propertyId);
              setSelectedProperty(property || null);
            }}
          >
            <option value="">Select a property</option>
            {properties.map(property => (
              <option key={property.id} value={String(property.id)}>
                {property.name} - {property.location}
              </option>
            ))}
          </select>
          <button
            onClick={handleGeneratePDF}
            disabled={!selectedProperty || generatingPDF}
            className={`px-4 py-2 rounded-md ${
              !selectedProperty || generatingPDF
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {generatingPDF ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
        {error && (
          <div className="mt-2 text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
     
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <PropertySearch onSearch={handleSearch} />
        </div>
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <PropertyList
              properties={properties}
              view="grid"
            />
          )}
        </div>
      </div>
    </div>
  );
};
 
export default PropertyPagePDFGenerator;