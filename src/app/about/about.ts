import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutComponent {
  pillars = [
    { icon: '🌿', title: 'Ethically Sourced', desc: 'We work with trusted weavers and sustainable fabric suppliers across India.' },
    { icon: '💎', title: 'Premium Quality', desc: 'Every piece undergoes rigorous quality checks before reaching you.' },
    { icon: '♡', title: 'Made for You', desc: 'Sizes, styles, and fits for every body — because beauty has no single shape.' },
  ];
}
