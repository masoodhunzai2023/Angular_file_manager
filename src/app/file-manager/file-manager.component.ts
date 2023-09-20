import { Component, OnInit } from '@angular/core';

interface FileItem {
  name: string;
  isFolder: boolean;
  expanded?: boolean;
  contents?: FileItem[];
}

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {
  currentPath: string = '/';
  files: FileItem[] = [
    {
      name: 'Root',
      isFolder: true,
      expanded: true,
      contents: [
        { name: 'Folder 1', isFolder: true },
        { name: 'Folder 2', isFolder: true }
      ]
    }
  ];
  selectedFolder: FileItem | null = null;
  showNavigationPane: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleItem(item: FileItem): void {
    if (item.isFolder) {
      item.expanded = !item.expanded;

      if (item.expanded && !item.contents) {
        item.contents = [
          { name: 'File 1.txt', isFolder: false },
          { name: 'File 2.png', isFolder: false }
        ];
      }
    }
  }

  navigateToItem(item: FileItem): void {
    const parent = this.findParentForItem(this.files, item);

    if (parent !== null) {
      const pathSegments: string[] = [];
      this.buildPathFromItem(item, pathSegments);
      this.currentPath = '/' + pathSegments.join('/');
      this.collapseAllFolders(this.files);
      this.expandToItem(this.files, item);
    }
  }

  buildPathFromItem(item: FileItem, pathSegments: string[]): void {
    if (item.name !== 'Root') {
      const parent = this.findParentForItem(this.files, item);
      if (parent !== null) {
        this.buildPathFromItem(parent, pathSegments);
        pathSegments.push(item.name);
      }
    }
  }

  findParentForItem(items: FileItem[], target: FileItem): FileItem | null {
    for (const item of items) {
      if (item.contents?.includes(target)) {
        return item;
      } else if (item.contents && item.contents.length > 0) {
        const parent = this.findParentForItem(item.contents, target);
        if (parent) {
          return parent;
        }
      }
    }
    return null;
  }

  collapseAllFolders(items: FileItem[]): void {
    for (const item of items) {
      item.expanded = false;
      if (item.contents && item.contents.length > 0) {
        this.collapseAllFolders(item.contents);
      }
    }
  }

  expandToItem(items: FileItem[], target: FileItem): void {
    for (const item of items) {
      if (item === target) {
        item.expanded = true;
        return;
      } else if (item.contents && item.contents.length > 0) {
        this.expandToItem(item.contents, target);
      }
    }
  }
}
