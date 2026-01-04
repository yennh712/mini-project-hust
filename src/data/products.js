// Import images - Vite requires explicit imports for assets
import mockupTshirtWhite from '../assets/mockup_tshirt_white.png';
import mockupTshirtBlack from '../assets/mockup_tshirt_black.png';
import mockupTshirtRed from '../assets/mockup_tshirt_red.png';
import mockupTshirtBlue from '../assets/mockup_tshirt_blue.png';
import mockupTshirtYellow from '../assets/mockup_tshirt_yellow.png';
import mockupTshirtBrown from '../assets/mockup_tshirt_brown.png';

import mockupPoloWhite from '../assets/mockup_polo_white.png';
import mockupPoloBlack from '../assets/mockup_polo_black.png';
import mockupPoloNavy from '../assets/mockup_polo_navy.png';
import mockupPoloGray from '../assets/mockup_polo_gray.png';
import mockupPoloGreen from '../assets/mockup_polo_green.png';

// Import all other mockup images from assets
import mockupHoodie from '../assets/mockup_hoodie.jpg';
import mockupHoodieBlack from '../assets/mockup_hoodie_black.png';
import mockupHoodieGray from '../assets/mockup_hoodie_gray.png';
import mockupHoodieNavy from '../assets/mockup_hoodie_navy.png';
import mockupHoodieRed from '../assets/mockup_hoodie_red.png';
import mockupHoodieWhite from '../assets/mockup_hoodie_white.jpg';

import mockupTank from '../assets/mockup_tank.jpg';
import mockupTankWhite from '../assets/mockup_tank_white.jpg';
import mockupTankBlack from '../assets/mockup_tank_black.jpg';
import mockupTankPink from '../assets/mockup_tank_pink.jpg';
import mockupTankBlue from '../assets/mockup_tank_blue.png';
import mockupTankYellow from '../assets/mockup_tank_yellow.jpg';

// Use first variant as default for product image
const defaultTshirt = mockupTshirtWhite;
const defaultPolo = mockupPoloWhite;

// Mock database for products
export const products = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    price: 150000,
    currency: "VNĐ",
    description: "Premium quality cotton t-shirt perfect for custom designs. Soft, comfortable, and durable.",
    colors: ["White", "Black", "Red", "Blue", "Yellow", "Brown"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: defaultTshirt,
    mockupImage: defaultTshirt,
    // Mockup images for each color variant
    mockupVariants: {
      "White": mockupTshirtWhite,
      "Black": mockupTshirtBlack,
      "Red": mockupTshirtRed,
      "Blue": mockupTshirtBlue,
      "Yellow": mockupTshirtYellow,
      "Brown": mockupTshirtBrown
    }
  },
  {
    id: 2,
    name: "Premium Polo Shirt",
    price: 250000,
    currency: "VNĐ",
    description: "High-quality polo shirt with a professional look. Perfect for business casual or custom branding.",
    colors: ["White", "Black", "Navy", "Gray", "Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: defaultPolo,
    mockupImage: defaultPolo,
    mockupVariants: {
      "White": mockupPoloWhite,
      "Black": mockupPoloBlack,
      "Navy": mockupPoloNavy,
      "Gray": mockupPoloGray,
      "Green": mockupPoloGreen
    }
  },
  {
    id: 3,
    name: "Hoodie with Zipper",
    price: 350000,
    currency: "VNĐ",
    description: "Comfortable hoodie with front zipper. Great for casual wear and custom designs.",
    colors: ["Black", "Gray", "Navy", "Red"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/src/assets/mockup_hoodie_white.jpg",
    mockupImage: "/src/assets/mockup_hoodie_white.jpg",
    mockupVariants: {
      "Black": "/src/assets/mockup_hoodie_black.png",
      "Gray": "/src/assets/mockup_hoodie_gray.png",
      "Navy": "/src/assets/mockup_hoodie_navy.png",
      "Red": "/src/assets/mockup_hoodie_red.png"
    }
  },
  {
    id: 4,
    name: "Tank Top",
    price: 120000,
    currency: "VNĐ",
    description: "Lightweight tank top perfect for summer. Ideal for custom designs and active wear.",
    colors: ["White", "Black", "Pink", "Blue", "Yellow"],
    sizes: ["S", "M", "L", "XL"],
    image: "/src/assets/mockup_tank.jpg",
    mockupImage: "/src/assets/mockup_tank.jpg",
    mockupVariants: {
      "White": "/src/assets/mockup_tank_white.jpg",
      "Black": "/src/assets/mockup_tank_black.jpg",
      "Pink": "/src/assets/mockup_tank_pink.jpg",
      "Blue": "/src/assets/mockup_tank_blue.png",
      "Yellow": "/src/assets/mockup_tank_yellow.jpg"
    }
  }
];

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

// Function to get mockup image based on product name (for future use)
export const getMockupImageByProductName = (productName) => {
  const name = productName.toLowerCase();
  
  if (name.includes('t-shirt') || name.includes('tshirt')) {
    return defaultTshirt;
  } else if (name.includes('polo')) {
    return defaultPolo;
  } else if (name.includes('hoodie')) {
    // For hoodie, we'll use the first variant or need to import
    return '/src/assets/mockup_hoodie_white.jpg'; // Keep as string for now, can import later
  } else if (name.includes('tank')) {
    return '/src/assets/mockup_tank.jpg'; // Keep as string for now, can import later
  } else {
    // Default fallback
    return defaultTshirt;
  }
};

// Function to get mockup image for a specific color variant
export const getMockupImageByVariant = (product, color) => {
  if (!product || !color) {
    return product?.mockupImage || product?.image || null;
  }
  
  // Check if product has mockupVariants
  if (product.mockupVariants && product.mockupVariants[color]) {
    return product.mockupVariants[color];
  }
  
  // Fallback to default mockup image
  return product?.mockupImage || product?.image || null;
};

// Export all available mockup images for library selection
export const allAvailableMockups = [
  // T-Shirt variants
  { id: 'tshirt_white', name: 'T-Shirt White', image: mockupTshirtWhite },
  { id: 'tshirt_black', name: 'T-Shirt Black', image: mockupTshirtBlack },
  { id: 'tshirt_red', name: 'T-Shirt Red', image: mockupTshirtRed },
  { id: 'tshirt_blue', name: 'T-Shirt Blue', image: mockupTshirtBlue },
  { id: 'tshirt_yellow', name: 'T-Shirt Yellow', image: mockupTshirtYellow },
  { id: 'tshirt_brown', name: 'T-Shirt Brown', image: mockupTshirtBrown },
  
  // Polo variants
  { id: 'polo_white', name: 'Polo White', image: mockupPoloWhite },
  { id: 'polo_black', name: 'Polo Black', image: mockupPoloBlack },
  { id: 'polo_navy', name: 'Polo Navy', image: mockupPoloNavy },
  { id: 'polo_gray', name: 'Polo Gray', image: mockupPoloGray },
  { id: 'polo_green', name: 'Polo Green', image: mockupPoloGreen },
  
  // Hoodie variants
  { id: 'hoodie', name: 'Hoodie', image: mockupHoodie },
  { id: 'hoodie_black', name: 'Hoodie Black', image: mockupHoodieBlack },
  { id: 'hoodie_gray', name: 'Hoodie Gray', image: mockupHoodieGray },
  { id: 'hoodie_navy', name: 'Hoodie Navy', image: mockupHoodieNavy },
  { id: 'hoodie_red', name: 'Hoodie Red', image: mockupHoodieRed },
  { id: 'hoodie_white', name: 'Hoodie White', image: mockupHoodieWhite },
  
  // Tank Top variants
  { id: 'tank', name: 'Tank Top', image: mockupTank },
  { id: 'tank_white', name: 'Tank Top White', image: mockupTankWhite },
  { id: 'tank_black', name: 'Tank Top Black', image: mockupTankBlack },
  { id: 'tank_pink', name: 'Tank Top Pink', image: mockupTankPink },
  { id: 'tank_blue', name: 'Tank Top Blue', image: mockupTankBlue },
  { id: 'tank_yellow', name: 'Tank Top Yellow', image: mockupTankYellow },
];
