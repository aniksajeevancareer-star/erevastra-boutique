const fs = require('fs');
const path = require('path');

const collectionsDir = path.join(__dirname, 'public', 'collections');
const outputFile = path.join(__dirname, 'public', 'collections-metadata.json');

// Default descriptions and subtitles for the preset categories
const categoryMeta = {
  saree: {
    name: 'Saree Collection',
    subtitle: 'Timeless Drapes',
    desc: 'From Kanjivaram silks to lightweight georgettes — every saree tells a story of heritage and grace.',
    icon: '🥻',
    tag: 'Bestseller'
  },
  croptops: {
    name: 'Crop Tops',
    subtitle: 'Contemporary Chic',
    desc: "Bold prints, soft fabrics, and silhouettes that celebrate the modern woman's confidence.",
    icon: '👚',
    tag: 'Trending'
  },
  nightwear: {
    name: 'Night Wear',
    subtitle: 'Dreamy Comfort',
    desc: 'Luxuriously soft sets that wrap you in comfort — because your nights deserve elegance too.',
    icon: '🌙',
    tag: 'New In'
  },
  innerwear: {
    name: 'Innerwear',
    subtitle: 'Premium Basics',
    desc: 'Crafted for comfort and confidence — premium innerwear in breathable, skin-friendly fabrics.',
    icon: '✨',
    tag: 'Essentials'
  }
};

try {
  if (!fs.existsSync(collectionsDir)) {
    fs.mkdirSync(collectionsDir, { recursive: true });
    console.log('Created collections directory.');
  }

  const dirs = fs.readdirSync(collectionsDir).filter(f => {
    return fs.statSync(path.join(collectionsDir, f)).isDirectory();
  });

  const categories = [];

  dirs.forEach(dirKey => {
    const dirPath = path.join(collectionsDir, dirKey);
    const files = fs.readdirSync(dirPath).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext);
    });

    const meta = categoryMeta[dirKey.toLowerCase()] || {
      name: dirKey.charAt(0).toUpperCase() + dirKey.slice(1).replace(/([A-Z])/g, ' $1').trim(),
      subtitle: 'Premium Range',
      desc: `Exclusive selection of ${dirKey.toLowerCase()} for all occasions.`,
      icon: '✦',
      tag: 'New Collection'
    };

    const images = files.map((file, idx) => {
      // Expecting formats: "Product Name_Price.jpg" or "Product Name_Price_OriginalPrice.jpg" or just "saree1.jpg"
      const baseName = path.basename(file, path.extname(file));
      const parts = baseName.split('_');
      
      let name = parts[0].replace(/[-_]/g, ' ').trim();
      // Capitalize first letter of each word
      name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      let price = null;
      let originalPrice = null;

      if (parts[1]) {
        price = parseFloat(parts[1]);
      }
      if (parts[2]) {
        originalPrice = parseFloat(parts[2]);
      }

      // If price parsing fails, just leave it as null
      if (isNaN(price)) price = null;
      if (isNaN(originalPrice)) originalPrice = null;

      return {
        id: `${dirKey}-${idx + 1}`,
        filename: file,
        imagePath: `collections/${dirKey}/${file}`,
        name: name,
        price: price,
        originalPrice: originalPrice,
        rating: 5,
        reviews: Math.floor(Math.random() * 40) + 15,
        wishlist: false
      };
    });

    categories.push({
      key: dirKey,
      name: meta.name,
      subtitle: meta.subtitle,
      desc: meta.desc,
      icon: meta.icon,
      tag: meta.tag,
      count: images.length,
      images: images
    });
  });

  fs.writeFileSync(outputFile, JSON.stringify({ categories }, null, 2));
  console.log('Successfully generated collections-metadata.json with', categories.length, 'categories.');
} catch (err) {
  console.error('Error generating metadata:', err);
}
