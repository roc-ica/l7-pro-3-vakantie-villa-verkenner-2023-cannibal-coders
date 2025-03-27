import { jsPDF } from 'jspdf';
import { Property } from '../../types/property';
import { formatPrice } from '../../utils/formatters';
import { amenities } from '../../data/amenities';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';  // Handle CORS
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

export const generatePropertyPDF = async (property: Property) => {
  const doc = new jsPDF();
  const margin = 20;
  let yPosition = margin;

  // Add title
  doc.setFontSize(20);
  doc.text(property.name, margin, yPosition);
  yPosition += 15;

  try {
    // Add main property image
    if (property.image_url) {
      const mainImage = await loadImage(property.image_url);
      const aspectRatio = mainImage.width / mainImage.height;
      const imageWidth = 170; // Max width for A4 page with margins
      const imageHeight = imageWidth / aspectRatio;
      
      doc.addImage(
        mainImage,
        'JPEG',
        margin,
        yPosition,
        imageWidth,
        imageHeight,
        undefined,
        'MEDIUM'
      );
      yPosition += imageHeight + 10;
    }

    // Add property details
    doc.setFontSize(12);
    doc.text(`Location: ${property.location}, ${property.country}`, margin, yPosition += 10);
    doc.text(`Address: ${property.address}`, margin, yPosition += 10);
    doc.text(`Price: ${formatPrice(property.price)}`, margin, yPosition += 10);
    doc.text(`Bedrooms: ${property.bedrooms}`, margin, yPosition += 10);
    doc.text(`Capacity: ${property.capacity} persons`, margin, yPosition += 10);

    // Add description
    yPosition += 10;
    doc.setFontSize(14);
    doc.text('Description:', margin, yPosition);
    yPosition += 10;
    doc.setFontSize(12);

    const splitDescription = doc.splitTextToSize(property.description || '', 170);
    doc.text(splitDescription, margin, yPosition);

    // Add amenities
    if (property.amenities) {
      yPosition += splitDescription.length * 7 + 10;
      doc.setFontSize(14);
      doc.text('Amenities:', margin, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      const propertyAmenities = getPropertyAmenities(property.amenities);
      propertyAmenities.forEach(amenity => {
        doc.text(`• ${amenity.label}`, margin, yPosition);
        yPosition += 7;
      });
    }

    // Add additional images if available
    if (property.images && property.images.length > 0) {
      yPosition += 10;
      doc.setFontSize(14);
      doc.text('Additional Images:', margin, yPosition);
      yPosition += 10;

      // Create a grid of images, 2 per row
      const imageWidth = 80;
      let xPosition = margin;
      
      for (const img of property.images) {
        const image = await loadImage(img.image_url);
        const aspectRatio = image.width / image.height;
        const imageHeight = imageWidth / aspectRatio;

        // Check if we need to move to next page
        if (yPosition + imageHeight > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPosition = margin;
          xPosition = margin;
        }

        doc.addImage(
          image,
          'JPEG',
          xPosition,
          yPosition,
          imageWidth,
          imageHeight,
          undefined,
          'MEDIUM'
        );

        // Move to next position
        if (xPosition === margin) {
          xPosition = margin + imageWidth + 10;
        } else {
          xPosition = margin;
          yPosition += imageHeight + 10;
        }
      }
    }

    // Save the PDF
    doc.save(`${property.name}-details.pdf`);
  } catch (error) {
    console.error('Error generating PDF with images:', error);
    // Fallback to generate PDF without images if there's an error
    generatePDFWithoutImages(property);
  }
};

// Fallback function if images fail to load
const generatePDFWithoutImages = (property: Property) => {
  const doc = new jsPDF();
  const margin = 20;
  let yPosition = margin;

  // Add title
  doc.setFontSize(20);
  doc.text(property.name, margin, yPosition);
  yPosition += 10;

  // Add property details
  doc.setFontSize(12);
  doc.text(`Location: ${property.location}, ${property.country}`, margin, yPosition += 10);
  doc.text(`Address: ${property.address}`, margin, yPosition += 10);
  doc.text(`Price: ${formatPrice(property.price)}`, margin, yPosition += 10);
  doc.text(`Bedrooms: ${property.bedrooms}`, margin, yPosition += 10);
  doc.text(`Capacity: ${property.capacity} persons`, margin, yPosition += 10);

  // Add description
  yPosition += 10;
  doc.setFontSize(14);
  doc.text('Description:', margin, yPosition);
  yPosition += 10;
  doc.setFontSize(12);

  const splitDescription = doc.splitTextToSize(property.description || '', 170);
  doc.text(splitDescription, margin, yPosition);

  // Add amenities
  if (property.amenities) {
    yPosition += splitDescription.length * 7 + 10;
    doc.setFontSize(14);
    doc.text('Amenities:', margin, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    const propertyAmenities = getPropertyAmenities(property.amenities);
    propertyAmenities.forEach(amenity => {
      doc.text(`• ${amenity.label}`, margin, yPosition);
      yPosition += 7;
    });
  }

  // Save the PDF
  doc.save(`${property.name}-details.pdf`);
};

const getPropertyAmenities = (amenitiesString: string) => {
  const amenityIds = amenitiesString.split(',').map(id => id.trim());
  return amenities.filter(amenity => amenityIds.includes(amenity.id));
};
