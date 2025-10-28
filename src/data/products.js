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
    image: "/src/assets/mockup_tshirt.png",
    mockupImage: "/src/assets/mockup_tshirt.png"
  },
  {
    id: 2,
    name: "Premium Polo Shirt",
    price: 250000,
    currency: "VNĐ",
    description: "High-quality polo shirt with a professional look. Perfect for business casual or custom branding.",
    colors: ["White", "Black", "Navy", "Gray", "Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/src/assets/mockup_polo.png",
    mockupImage: "/src/assets/mockup_polo.png"
  },
  {
    id: 3,
    name: "Hoodie with Zipper",
    price: 350000,
    currency: "VNĐ",
    description: "Comfortable hoodie with front zipper. Great for casual wear and custom designs.",
    colors: ["Black", "Gray", "Navy", "Red"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/src/assets/mockup_hoodie.jpg",
    mockupImage: "/src/assets/mockup_hoodie.jpg"
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
    mockupImage: "/src/assets/mockup_tank.jpg"
  }
];

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

// Function to get mockup image based on product name (for future use)
export const getMockupImageByProductName = (productName) => {
  const name = productName.toLowerCase();
  
  if (name.includes('t-shirt') || name.includes('tshirt')) {
    return '/src/assets/mockup_tshirt.png';
  } else if (name.includes('polo')) {
    return '/src/assets/mockup_polo.png';
  } else if (name.includes('hoodie')) {
    return '/src/assets/mockup_hoodie.jpg';
  } else if (name.includes('tank')) {
    return '/src/assets/mockup_tank.jpg';
  } else {
    // Default fallback
    return '/src/assets/mockup_tshirt.png';
  }
};
