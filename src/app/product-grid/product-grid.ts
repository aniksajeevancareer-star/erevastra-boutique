import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number | null;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  image: string;
  wishlist: boolean;
}

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss'
})
export class ProductGridComponent implements OnInit {
  activeFilter = 'All';
  filters = ['All'];
  allProducts: Product[] = [];
  
  // Enquiry state
  isEnquiryModalOpen = false;
  selectedProduct: Product | null = null;
  enquiryForm = { name: '', phone: '', email: '', message: '' };
  enquirySubmitted = false;

  // Boutique WhatsApp number (configured)
  boutiqueWhatsApp = '917760068642'; 

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    fetch('collections-metadata.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load collections metadata');
        return res.json();
      })
      .then(data => {
        const productsList: Product[] = [];
        const loadedFilters = ['All'];

        data.categories.forEach((cat: any) => {
          // If the category has images, add it to filters
          if (cat.images && cat.images.length > 0) {
            loadedFilters.push(cat.name);
            cat.images.forEach((img: any) => {
              productsList.push({
                id: img.id,
                name: img.name,
                category: cat.name,
                price: img.price,
                originalPrice: img.originalPrice,
                image: img.imagePath,
                rating: img.rating || 5,
                reviews: img.reviews || 0,
                wishlist: img.wishlist || false
              });
            });
          }
        });

        this.filters = loadedFilters;
        this.allProducts = productsList;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Error loading collections metadata:', err);
        // Clean fallback
        this.filters = ['All', 'Sarees', 'Crop Tops', 'Night Wear', 'Innerwear'];
        this.allProducts = [];
        this.cdr.detectChanges();
      });
  }

  get filteredProducts(): Product[] {
    if (this.activeFilter === 'All') return this.allProducts;
    return this.allProducts.filter(p => p.category === this.activeFilter);
  }

  setFilter(f: string) {
    this.activeFilter = f;
  }

  toggleWishlist(p: Product) {
    p.wishlist = !p.wishlist;
  }

  getStars(rating: number) {
    return Array(5).fill(0).map((_, i) => i < rating);
  }

  formatPrice(p: number | null) {
    if (p === null) return 'Enquire for Price';
    return '₹' + p.toLocaleString('en-IN');
  }

  // Enquiry Modal logic
  openEnquiryModal(product: Product) {
    this.selectedProduct = product;
    this.enquiryForm.message = `Hi! I am interested in the "${product.name}" (${product.category}). Please share details about availability and custom sizes.`;
    this.enquirySubmitted = false;
    this.isEnquiryModalOpen = true;
  }

  closeEnquiryModal() {
    this.isEnquiryModalOpen = false;
    this.selectedProduct = null;
    this.enquiryForm = { name: '', phone: '', email: '', message: '' };
  }

  getWhatsAppLink(product: Product, userMessage?: string): string {
    let msg = `Hi! I'm interested in the following product from your collection:\n\n*Product:* ${product.name}\n*Category:* ${product.category}`;
    
    if (product.price) {
      msg += `\n*Price:* ${this.formatPrice(product.price)}`;
    }
    
    if (userMessage) {
      msg += `\n\n*Customer Message:* ${userMessage}`;
    }
    
    return `https://wa.me/${this.boutiqueWhatsApp}?text=${encodeURIComponent(msg)}`;
  }

  submitEnquiry() {
    if (!this.selectedProduct) return;
    
    // Construct dynamic message with customer name and details
    const fullMsg = `Name: ${this.enquiryForm.name}\nPhone: ${this.enquiryForm.phone}\nEmail: ${this.enquiryForm.email}\nMessage: ${this.enquiryForm.message}`;
    const waLink = this.getWhatsAppLink(this.selectedProduct, fullMsg);
    
    // Set submitted state for success visual
    this.enquirySubmitted = true;
    
    // Redirect to WhatsApp after short delay
    setTimeout(() => {
      window.open(waLink, '_blank');
      this.closeEnquiryModal();
    }, 1500);
  }
}
