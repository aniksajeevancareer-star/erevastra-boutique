import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-collections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-collections.html',
  styleUrl: './featured-collections.scss'
})
export class FeaturedCollectionsComponent implements OnInit {
  collections: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    fetch('collections-metadata.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load collections metadata');
        return res.json();
      })
      .then(data => {
        this.collections = data.categories.map((cat: any) => ({
          ...cat,
          countText: cat.count === 1 ? '1 Style' : `${cat.count} Styles`,
          previewImage: cat.images && cat.images.length > 0 ? cat.images[0].imagePath : null
        }));
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error loading collections metadata:', err);
        // Fallback static list in case of errors
        this.collections = [
          {
            key: 'saree',
            name: 'Saree Collection',
            subtitle: 'Timeless Drapes',
            desc: 'From Kanjivaram silks to lightweight georgettes — every saree tells a story of heritage and grace.',
            countText: '0 Styles',
            icon: '🥻',
            tag: 'Bestseller'
          },
          {
            key: 'croptops',
            name: 'Crop Tops',
            subtitle: 'Contemporary Chic',
            desc: "Bold prints, soft fabrics, and silhouettes that celebrate the modern woman's confidence.",
            countText: '0 Styles',
            icon: '👗',
            tag: 'Trending'
          },
          {
            key: 'nightwear',
            name: 'Night Wear',
            subtitle: 'Dreamy Comfort',
            desc: 'Luxuriously soft sets that wrap you in comfort — because your nights deserve elegance too.',
            countText: '0 Styles',
            icon: '🌙',
            tag: 'New In'
          },
          {
            key: 'innerwear',
            name: 'Innerwear',
            subtitle: 'Premium Basics',
            desc: 'Crafted for comfort and confidence — premium innerwear in breathable, skin-friendly fabrics.',
            countText: '0 Styles',
            icon: '✨',
            tag: 'Essentials'
          }
        ];
        this.cdr.detectChanges();
      });
  }
}
