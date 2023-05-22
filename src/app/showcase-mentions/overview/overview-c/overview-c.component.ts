import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ChoiceWithIndices } from '@albert/mentions';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-overview-c',
  templateUrl: './overview-c.component.html',
  styleUrls: ['./overview-c.component.scss']
})
export class OverviewCComponent implements AfterViewInit {
  text = `Hello \n@Amelia \n@John J. Doe \n`;
  loading = false;
  choices: User[] = [];
  mentions: ChoiceWithIndices[] = [];
  selectedIndex = 0;
  @ViewChild('listTemplate', {static: false}) listTemplate: ElementRef;
  @ViewChild('textareaRef', {static: false}) textareaRef: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    this.textareaRef.nativeElement.addEventListener('keydown', event => {
      if (
        this.listTemplate &&
        this.listTemplate.nativeElement.getElementsByTagName('li')
      ) {
        if (event.code == 'ArrowDown') {
          console.log("arrow downed");
          event.preventDefault();
          this.triggerMouseLeave(this.selectedIndex);
          if (this.choices.length > this.selectedIndex + 1) {
            this.selectedIndex++;
          } else {
            this.selectedIndex = 0;
          }
          this.triggerMouseEnter(this.selectedIndex);
        } else if (event.code == 'ArrowUp') {
          event.preventDefault();
          this.triggerMouseLeave(this.selectedIndex);
          if (this.selectedIndex == 0) {
            this.selectedIndex = this.choices.length - 1;
          } else {
            this.selectedIndex--;
          }
          this.triggerMouseEnter(this.selectedIndex);
        } else if (event.code == 'Enter') {
          event.preventDefault();
          this.triggerKeyboardEnter();
        }
      }
    });
  }

  async loadChoices(searchTerm: string): Promise<User[]> {
    this.triggerMouseLeave(this.selectedIndex);
    const users = await this.getUsers();

    this.choices = users.filter(user => {
      const alreadyExists = this.mentions.some(
        m => m.choice.name === user.name
      );
      return (
        !alreadyExists &&
        user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
    });

    setTimeout(() => {
      this.triggerMouseEnter(0);
      this.selectedIndex = 0;
    }, 10);

    return this.choices;
  }

  choiceRemoved(ev) {}

  getChoiceLabel = (user: User): string => {
    return `@${user.name}`;
  };

  onSelectedChoicesChange(choices: ChoiceWithIndices[]): void {
    this.mentions = choices;
  }

  onMenuShow(): void {
    setTimeout(() => {
      this.triggerMouseEnter(0);
    }, 1000);
  }

  onMenuHide(): void {
    this.choices = [];
  }

  getSelectedChoices(): User[] {
    if (this.mentions.length) {
      return this.mentions.map(m => m.choice);
    } else {
      return [
        {
          id: 1,
          name: 'Amelia'
        },
        {
          id: 4,
          name: 'John J. Doe'
        }
      ];
    }
  }
  onHighlightTagMouseLeave(event) {
    console.log("mouse left off tag");
  }
  onHighlightTagMouseEnter(event) {

  }
  onChoiceSelected(event) {
    console.log(this.getSelectedChoices(), "selected choices");
  }

  async getUsers(): Promise<User[]> {
    this.loading = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.loading = false;
        resolve([
          {
            id: 1,
            name: 'Amelia'
          },
          {
            id: 2,
            name: 'Doe'
          },
          {
            id: 3,
            name: 'John Doe'
          },
          {
            id: 4,
            name: 'John J. Doe'
          },
          {
            id: 5,
            name: 'John & Doe'
          },
          {
            id: 6,
            name: 'Fredericka Wilkie'
          },
          {
            id: 7,
            name: 'Collin Warden'
          },
          {
            id: 8,
            name: 'Hyacinth Hurla'
          },
          {
            id: 9,
            name: 'Paul Bud Mazzei'
          },
          {
            id: 10,
            name: 'Mamie Xander Blais'
          },
          {
            id: 11,
            name: 'Sacha Murawski'
          },
          {
            id: 12,
            name: 'Marcellus Van Cheney'
          },
          {
            id: 12,
            name: 'Lamar Kowalski'
          },
          {
            id: 13,
            name: 'Queena Gauss'
          }
        ]);
      }, 600);
    });
  }

  onMouseenter(event, i) {
    event.style.background = '#ccc';
    if (this.selectedIndex != i) {
      this.triggerMouseLeave(this.selectedIndex);
      this.selectedIndex = i;
    }
  }

  onMouseleave(event, i) {
    event.style.background = '#fff';
    if (this.selectedIndex != i) {
      this.triggerMouseLeave(this.selectedIndex);
      this.selectedIndex = i;
    }
  }

  triggerMouseLeave(i) {
    try {
      const mouseleave = new Event('mouseleave');
      this.listTemplate.nativeElement
        .getElementsByTagName('li')
        [i].dispatchEvent(mouseleave);
    } catch {}
  }

  triggerMouseEnter(i) {
    try {
      const mouseenter = new Event('mouseenter');
      this.listTemplate.nativeElement
        .getElementsByTagName('li')
        [i].dispatchEvent(mouseenter);
    } catch {}
  }

  triggerKeyboardEnter() {
    try {
      console.log(this.selectedIndex, "selected index")
      const clickEvent = new Event('click');
      this.listTemplate.nativeElement
        .getElementsByTagName('li')
        [this.selectedIndex].dispatchEvent(clickEvent);
    } catch {
      console.log("is error???")
    }
  }
}
