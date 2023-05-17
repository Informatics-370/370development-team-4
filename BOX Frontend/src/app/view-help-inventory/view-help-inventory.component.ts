import { Component } from '@angular/core';

@Component({
  selector: 'app-view-help-inventory',
  templateUrl: './view-help-inventory.component.html',
  styleUrls: ['./view-help-inventory.component.css']
})
export class ViewHelpInventoryComponent {
  search(): void {
    // Get the search input value
    const searchTerm: string = (<HTMLInputElement>document.getElementById("searchInput")).value;
   
    // Clear any existing highlighting
    this.clearHighlight();

    // Perform the search and highlight the instances of the word
    const content: HTMLElement | null = document.getElementById("content");
    if (content) {
      const text: string = content.innerHTML;
      const highlightedText: string = text.replace(new RegExp(searchTerm, "gi"), function(match: string) {
        return '<span style="background-color: pink;">' + match + '</span>';
      });
      content.innerHTML = highlightedText;

      // Scroll to the highlighted instances
      const highlightElements: NodeListOf<Element> = document.querySelectorAll("span[style='background-color: pink;']");
      if (highlightElements.length > 0) {
        this.scrollToElement(highlightElements[0]);
      }
    }
  }

  clearHighlight(): void {
    // Remove any existing highlighting
    const highlighted: NodeListOf<Element> = document.querySelectorAll("span[style='background-color: pink;']");
    for (let i = 0; i < highlighted.length; i++) {
      highlighted[i].outerHTML = highlighted[i].innerHTML;
    }
  }

  scrollToElement(element: Element): void {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
