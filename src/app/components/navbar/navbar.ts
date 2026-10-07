import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  searchQuery: string = '';

  siteSearch() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return;

    // Előző kiemelések eltávolítása
    document.querySelectorAll('mark').forEach(m => {
      const parent = m.parentNode!;
      parent.replaceChild(document.createTextNode(m.textContent || ''), m);
      parent.normalize();
    });

    // Teljes dokumentumban szöveg keresése
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let found = 0;

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const text = node.nodeValue?.toLowerCase() || '';

      if (text.includes(query)) {
        found++;

        const span = document.createElement('span');
        span.innerHTML = (node.nodeValue || '').replace(
          new RegExp(query, 'gi'),
          match => `<mark style="background: yellow;">${match}</mark>`
        );
        node.parentNode?.replaceChild(span, node);
      }
    }

    if (found === 0) {
      alert('Nincs találat.');
    }
  }

}
