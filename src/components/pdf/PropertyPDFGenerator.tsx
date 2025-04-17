import { jsPDF } from 'jspdf';
import { Property } from '../../types/property';
import { formatPrice } from '../../utils/formatters';
import { amenities } from '../../data/amenities';
 
// Function to get the server base URL
const getServerBaseUrl = (): string => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  return apiUrl.replace(/\/+$/, ''); // Remove trailing slashes
};
 
// Get full URL for an image with proper handling for local uploads
const getFullImageUrl = (url: string): string => {
  if (!url) return '';
 
  // For data URLs, use directly
  if (url.startsWith('data:')) return url;
 
  // For local uploads from our server, use the proxy script
  if (url.startsWith('/uploads/')) {
    return `${getServerBaseUrl()}/pdf-image-proxy.php?path=${encodeURIComponent(url)}`;
  }
 
  // For external URLs, use them directly
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
 
  // For local URLs without slash
  return `${getServerBaseUrl()}/${url}`;
};
 
// Enhanced image fetching function
const fetchImageAsBase64 = async (url: string): Promise<string> => {
  console.log(`Fetching image: ${url}`);
 
  try {
    const fullUrl = getFullImageUrl(url);
    console.log(`Full URL (via proxy if needed): ${fullUrl}`);
   
    // Create a simple Image() element to handle loading
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Important for CORS
     
      img.onload = () => {
        console.log(`Image loaded successfully: ${url}`);
       
        // Convert to canvas to handle image format compatibility
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
       
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
       
        // White background to eliminate transparency issues
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
       
        // Draw the image
        ctx.drawImage(img, 0, 0);
       
        // Convert to JPEG format (most compatible with PDF)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve(dataUrl);
      };
     
      img.onerror = (e) => {
        console.error(`Error loading image from ${fullUrl}:`, e);
        reject(new Error(`Failed to load image: ${url}`));
      };
     
      // Start loading the image
      img.src = fullUrl;
    });
  } catch (error) {
    console.error(`Error fetching image from ${url}:`, error);
   
    // Create a simple placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
   
    if (ctx) {
      // Gray background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
     
      // Error message
      ctx.fillStyle = '#999';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Image Unavailable', canvas.width/2, canvas.height/2);
      ctx.fillStyle = '#666';
      ctx.font = '14px Arial';
      ctx.fillText(url.substring(0, 30) + '...', canvas.width/2, canvas.height/2 + 30);
    }
   
    return canvas.toDataURL('image/jpeg');
  }
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
    // Collect image URLs
    const imageUrls: string[] = [];
   
    // Add main image if available
    if (property.image_url && typeof property.image_url === 'string') {
      imageUrls.push(property.image_url);
    }
   
    // Add additional images if available
    if (property.images && Array.isArray(property.images)) {
      for (const img of property.images) {
        const url = typeof img === 'string' ? img : img?.image_url;
        if (url && !imageUrls.includes(url)) {
          imageUrls.push(url);
          if (imageUrls.length >= 5) break; // Limit to 5 images
        }
      }
    }
   
    // Show loading message
    doc.setFontSize(12);
    doc.text("Loading images, please wait...", margin, yPosition);
   
    // Process images directly
    let imagesAdded = false;
   
    // Process main image
    if (imageUrls.length > 0) {
      try {
        console.log(`Processing main image: ${imageUrls[0]}`);
        const mainImageBase64 = await fetchImageAsBase64(imageUrls[0]);
       
        // Clear loading message
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, yPosition - 5, 170, 10, 'F');
       
        // Add "Main Property Image" subtitle
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Main Property Image", margin, yPosition);
        yPosition += 8;
       
        try {
          // Use simpler parameters for addImage - reduce potential issues
          console.log('Adding main image to PDF');
          doc.addImage(
            mainImageBase64,
            'JPEG',
            margin,
            yPosition,
            170, // width
            120  // height
          );
         
          yPosition += 120 + 15; // image height + spacing
          imagesAdded = true;
          console.log('Main image added successfully');
         
          // Add separator
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, yPosition - 10, margin + 170, yPosition - 10);
        } catch (imgErr) {
          console.error('Error adding main image to PDF:', imgErr);
        }
       
        // Process additional images if main was successful
        if (imagesAdded && imageUrls.length > 1) {
          doc.setFontSize(12);
          doc.text("Additional Property Images", margin, yPosition);
          yPosition += 10;
         
          const smallImgWidth = 80;
          const smallImgHeight = 60;
          let xPosition = margin;
          let imagesInRow = 0;
         
          for (let i = 1; i < imageUrls.length; i++) {
            try {
              console.log(`Processing additional image ${i}: ${imageUrls[i]}`);
              const imgBase64 = await fetchImageAsBase64(imageUrls[i]);
             
              // Check if we need to move to next page
              if (yPosition + smallImgHeight > doc.internal.pageSize.height - margin) {
                doc.addPage();
                yPosition = margin;
                xPosition = margin;
                imagesInRow = 0;
              }
             
              // Add image to PDF (with simplified parameters)
              console.log(`Adding additional image ${i} to PDF`);
              doc.addImage(
                imgBase64,
                'JPEG',
                xPosition,
                yPosition,
                smallImgWidth,
                smallImgHeight
              );
              console.log(`Additional image ${i} added successfully`);
             
              xPosition += smallImgWidth + 10;
              imagesInRow++;
             
              if (imagesInRow === 2) {
                xPosition = margin;
                yPosition += smallImgHeight + 10;
                imagesInRow = 0;
              }
            } catch (error) {
              console.error(`Failed to add additional image ${i}:`, error);
              continue;
            }
          }
         
          if (imagesInRow > 0) {
            yPosition += smallImgHeight + 10;
          }
        }
      } catch (error) {
        console.error('Failed to process main image:', error);
      }
    }
   
    // Add note if no images were added
    if (!imagesAdded) {
      // Clear loading message
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, yPosition - 5, 170, 10, 'F');
     
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text("No property images available to display.", margin, yPosition);
      yPosition += 10;
      doc.setTextColor(0);
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