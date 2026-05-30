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

function parseFileName(file) {
  const baseName = path.basename(file, path.extname(file));
  const parts = baseName.split('_');
  
  let name = '';
  let price = null;
  let originalPrice = null;

  const isNum = (str) => str && !isNaN(str) && !isNaN(parseFloat(str));

  if (parts.length === 1) {
    name = parts[0].replace(/[-_]/g, ' ').trim();
  } else {
    const lastPart = parts[parts.length - 1];
    const secondLastPart = parts[parts.length - 2];

    if (isNum(lastPart)) {
      if (secondLastPart && isNum(secondLastPart)) {
        originalPrice = parseFloat(lastPart);
        price = parseFloat(secondLastPart);
        name = parts.slice(0, parts.length - 2).join(' ').replace(/[-_]/g, ' ').trim();
      } else {
        price = parseFloat(lastPart);
        name = parts.slice(0, parts.length - 1).join(' ').replace(/[-_]/g, ' ').trim();
      }
    } else {
      name = baseName.replace(/[-_]/g, ' ').trim();
    }
  }

  // Capitalize first letter of each word
  name = name.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return { name, price, originalPrice };
}

try {
  if (!fs.existsSync(collectionsDir)) {
    fs.mkdirSync(collectionsDir, { recursive: true });
    console.log('Created collections directory.');
  }

  // Ensure hero folder exists
  const heroDir = path.join(collectionsDir, 'hero');
  if (!fs.existsSync(heroDir)) {
    fs.mkdirSync(heroDir, { recursive: true });
    console.log('Created hero directory.');
  }

  // Filter out the 'hero' folder from normal categories
  const dirs = fs.readdirSync(collectionsDir).filter(f => {
    return fs.statSync(path.join(collectionsDir, f)).isDirectory() && f.toLowerCase() !== 'hero';
  });

  const order = Object.keys(categoryMeta);
  dirs.sort((a, b) => {
    const indexA = order.indexOf(a.toLowerCase());
    const indexB = order.indexOf(b.toLowerCase());
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
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
      const { name, price, originalPrice } = parseFileName(file);
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

  // Process hero directory separately
  let heroData = null;
  if (fs.existsSync(heroDir)) {
    const files = fs.readdirSync(heroDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext);
    });

    const images = files.map((file, idx) => {
      const { name, price, originalPrice } = parseFileName(file);
      return {
        id: `hero-${idx + 1}`,
        filename: file,
        imagePath: `collections/hero/${file}`,
        name: name,
        price: price,
        originalPrice: originalPrice,
        rating: 5,
        reviews: 0,
        wishlist: false
      };
    });

    heroData = {
      key: 'hero',
      count: images.length,
      images: images
    };
  }

  fs.writeFileSync(outputFile, JSON.stringify({ categories, hero: heroData }, null, 2));
  console.log('Successfully generated collections-metadata.json with', categories.length, 'categories and hero images.');
} catch (err) {
  console.error('Error generating metadata:', err);
}
