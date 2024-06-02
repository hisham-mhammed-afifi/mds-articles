import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [MarkdownComponent],
  templateUrl: './articles.component.html',
  styles: [],
})
export class ArticlesComponent {
  filePath = '';
  params = inject(ActivatedRoute).params;

  constructor() {
    this.params.subscribe((params) => {
      this.filePath = `assets/markdown/${params['title']}.md`;
    });
  }
}
