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

    // Make sure main property image is first in the set
    const imagesToShow = Array.from(imageUrlsSet);
    
    // Re-order: If property.image_url exists, make it the first image
    if (
      property.image_url &&
      typeof property.image_url === 'string' &&
      property.image_url.trim() !== ''
    ) {
      // Remove it from current position (if exists in array)
      const mainImageIndex = imagesToShow.indexOf(property.image_url);
      if (mainImageIndex > 0) {
        imagesToShow.splice(mainImageIndex, 1);
      }
      // Add it as the first image
      imagesToShow.unshift(property.image_url);
    }
    
    if (imagesToShow.length > 0) {
      // Display first image as hero image (large, full width)
      try {
        const heroImage = await loadImage(imagesToShow[0]);
        const heroJpegDataUrl = imageToJpegDataUrl(heroImage);
        
        // Calculate aspect ratio for proper scaling
        const aspectRatio = heroImage.width / heroImage.height;
        
        // Make hero image much larger (nearly full width)
        const heroImageWidth = 170; // Almost full width of the page
        const heroImageHeight = heroImageWidth / aspectRatio; // Maintain aspect ratio
        
        // Add "Main Property Image" subtitle
        doc.setFontSize(12);
        doc.text("Main Property Image", margin, yPosition);
        yPosition += 6;
        
        doc.addImage(
          heroJpegDataUrl,
          'JPEG',
          margin,
          yPosition,
          heroImageWidth,
          heroImageHeight,
          undefined,
          'MEDIUM'
        );
        
        yPosition += heroImageHeight + 15; // More space after hero image
        
        // Add a separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition - 10, margin + 170, yPosition - 10);
        
        // If there are additional images, add a subtitle for them
        if (imagesToShow.length > 1) {
          doc.setFontSize(12);
          doc.text("Additional Property Images", margin, yPosition);
          yPosition += 10;
        }
      } catch (heroImgErr) {
        console.error('Failed to load hero image:', heroImgErr);
      }
      
      // Display remaining images in a grid (2 per row)
      if (imagesToShow.length > 1) {
        const imageWidth = 80;
        const imageHeight = 60;
        let xPosition = margin;
        let imagesInRow = 0;
        
        // Start from second image (index 1)
        for (let i = 1; i < imagesToShow.length; i++) {
          try {
            const image = await loadImage(imagesToShow[i]);
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
      }
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
