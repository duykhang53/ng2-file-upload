import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { FileUploader, FilterFunction } from './file-uploader.class';

@Directive({ selector: '[ng2FileSelect]' })
export class FileSelectDirective {
  @Input() public uploader: FileUploader;
  // tslint:disable-next-line:no-input-rename
  @Input('ng2FileFilter') public filter: FilterFunction['fn'];
  @Output() public onFileSelected: EventEmitter<File[]> = new EventEmitter<File[]>();

  protected element: ElementRef;

  public constructor(element: ElementRef) {
    this.element = element;
  }

  public getOptions(): any {
    return this.uploader.options;
  }

  public getFilters(): any {
    return {};
  }

  public isEmptyAfterSelection(): boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  @HostListener('change')
  public onChange(): any {
    let files = this.element.nativeElement.files;
    let options = this.getOptions();
    let filters = typeof this.filter === 'function' ? [{
      name: 'ng2FileSelectDirectiveFilter',
      fn: this.filter
    }, ...options.filters] : this.getFilters();

    this.uploader.addToQueue(files, options, filters);
    this.onFileSelected.emit(files);

    if (this.isEmptyAfterSelection()) {
      this.element.nativeElement.value = '';
    }
  }
}
