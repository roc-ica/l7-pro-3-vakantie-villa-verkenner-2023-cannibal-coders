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

// Helper to flatten transparent images to white background and get JPEG data URL
const imageToJpegDataUrl = (img: HTMLImageElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.92);
  }
  // fallback: return original src
  return img.src;
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
    // Collect all unique image URLs (main + additional)
    const imageUrlsSet = new Set<string>();
    // Add all property.images first (to avoid main image duplication)
    if (property.images && Array.isArray(property.images)) {
      for (const img of property.images) {
        // Support both string and object with image_url
        const url = typeof img === 'string' ? img : img?.image_url;
        if (url && typeof url === 'string' && url.trim() !== '') {
          imageUrlsSet.add(url);
        }
        if (imageUrlsSet.size >= 5) break;
      }
    }
    // Add main image if not already included
    if (
      property.image_url &&
      typeof property.image_url === 'string' &&
      property.image_url.trim() !== '' &&
      !imageUrlsSet.has(property.image_url)
    ) {
      imageUrlsSet.add(property.image_url);
    }
    const imagesToShow = Array.from(imageUrlsSet).slice(0, 5);

    // Display images in a grid (2 per row)
    const imageWidth = 80;
    const imageHeight = 60;
    let xPosition = margin;
    let imagesInRow = 0;

    for (const imgUrl of imagesToShow) {
      try {
        const image = await loadImage(imgUrl);
        const jpegDataUrl = imageToJpegDataUrl(image);
        // Check if we need to move to next page
        if (yPosition + imageHeight > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPosition = margin;
          xPosition = margin;
          imagesInRow = 0;
        }
        doc.addImage(
          jpegDataUrl,
          'JPEG',
          xPosition,
          yPosition,
          imageWidth,
          imageHeight,
          undefined,
          'MEDIUM'
        );
        xPosition += imageWidth + 10;
        imagesInRow++;
        if (imagesInRow === 2) {
          xPosition = margin;
          yPosition += imageHeight + 10;
          imagesInRow = 0;
        }
      } catch (imgErr) {
        // Ignore failed images, continue with others
        continue;
      }
    }
    if (imagesInRow > 0) {
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

    // Save the PDF
    doc.save(`${property.name}-details.pdf`);
  } catch (error) {
    console.error('Error generating PDF with images:', error);
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
