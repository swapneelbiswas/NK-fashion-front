import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * Header component responsible for rendering the
 * application’s top navigation or header section.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {}
