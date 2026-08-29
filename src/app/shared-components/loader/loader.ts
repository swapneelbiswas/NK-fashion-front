import { Component, Input } from '@angular/core';

/**
 *
 */
@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class LoaderComponent {
  @Input() visible: boolean = false;
  @Input() message?: string;
}
