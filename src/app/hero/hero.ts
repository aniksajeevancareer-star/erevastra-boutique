import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface HeroCard {
  name: string;
  price: number | null;
  image: string | null;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent implements OnInit {
  sareeCard: HeroCard = {
    name: 'Banarasi Silk Saree',
    price: 6999,
    image: null
  };

  cropCard: HeroCard = {
    name: 'Crop Top',
    price: 1299,
    image: null
  };

  nightCard: HeroCard = {
    name: 'Night Wear Set',
    price: 1899,
    image: null
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('HeroComponent: ngOnInit started');
    fetch('collections-metadata.json')
      .then(res => {
        console.log('HeroComponent: fetch response status =', res.status);
        if (!res.ok) throw new Error('Failed to load collections metadata');
        return res.json();
      })
      .then(data => {
        console.log('HeroComponent: fetched data =', data);
        if (!data) return;

        // 1. Default: Load first image from each product category
        if (data.categories) {
          console.log('HeroComponent: processing categories');
          const sareeCat = data.categories.find((c: any) => c.key.toLowerCase() === 'saree');
          if (sareeCat && sareeCat.images && sareeCat.images.length > 0) {
            const img = sareeCat.images[0];
            console.log('HeroComponent: Saree category default image =', img.imagePath);
            this.sareeCard = {
              name: img.name,
              price: img.price,
              image: img.imagePath
            };
          } else {
            console.log('HeroComponent: Saree category not found or has no images');
          }

          const cropCat = data.categories.find((c: any) => c.key.toLowerCase() === 'croptops');
          if (cropCat && cropCat.images && cropCat.images.length > 0) {
            const img = cropCat.images[0];
            console.log('HeroComponent: CropTop category default image =', img.imagePath);
            this.cropCard = {
              name: img.name,
              price: img.price,
              image: img.imagePath
            };
          }

          const nightCat = data.categories.find((c: any) => c.key.toLowerCase() === 'nightwear');
          if (nightCat && nightCat.images && nightCat.images.length > 0) {
            const img = nightCat.images[0];
            console.log('HeroComponent: Nightwear category default image =', img.imagePath);
            this.nightCard = {
              name: img.name,
              price: img.price,
              image: img.imagePath
            };
          }
        }

        // 2. Specific top-section images: override if files exist in the 'hero' folder
        if (data.hero && data.hero.images && data.hero.images.length > 0) {
          console.log('HeroComponent: processing hero specific images =', data.hero.images);
          const heroImages = data.hero.images;

          const findImage = (keywords: string[], fallbackIdx: number) => {
            const found = heroImages.find((img: any) => 
              keywords.some(kw => img.filename.toLowerCase().includes(kw) || img.name.toLowerCase().includes(kw))
            );
            return found || heroImages[fallbackIdx] || null;
          };

          const sareeImg = findImage(['saree', 'silk'], 0);
          if (sareeImg) {
            console.log('HeroComponent: matched Saree hero image =', sareeImg.imagePath);
            this.sareeCard = {
              name: sareeImg.name,
              price: sareeImg.price,
              image: sareeImg.imagePath
            };
          }

          const cropImg = findImage(['crop', 'top'], 1);
          if (cropImg) {
            console.log('HeroComponent: matched CropTop hero image =', cropImg.imagePath);
            this.cropCard = {
              name: cropImg.name,
              price: cropImg.price,
              image: cropImg.imagePath
            };
          }

          const nightImg = findImage(['night', 'pajama', 'wear'], 2);
          if (nightImg) {
            console.log('HeroComponent: matched Nightwear hero image =', nightImg.imagePath);
            this.nightCard = {
              name: nightImg.name,
              price: nightImg.price,
              image: nightImg.imagePath
            };
          }
        }

        // Force change detection so images show up immediately
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('HeroComponent: Error loading collections metadata for hero:', err);
      });
  }

  formatPrice(p: number | null) {
    if (p === null) return 'Enquire for Price';
    return '₹' + p.toLocaleString('en-IN');
  }
}
