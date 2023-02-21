import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconModule } from '@visurel/iconify-angular';
import { AggregateService, ColumnChooserService, CommandColumnService, DetailRowService, EditService, FilterService, GridModule, GroupService, PageService, ReorderService, ResizeService, RowDDService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { CommonModule } from '@angular/common';
import { ToolbarService as RichTextToolbarService, HtmlEditorService, LinkService, RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http'
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconModule,
    GridModule,
    RichTextEditorModule,
    CommonModule,
    DropDownButtonModule,
    ToolbarModule,
    MatInputModule,
    FormsModule,
    BrowserAnimationsModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCheckboxModule
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService,
    EditService,
    ToolbarService,
    CommandColumnService,
    ReorderService,
    ResizeService,
    ColumnChooserService,
    RowDDService,
    LinkService,
    HtmlEditorService,
    RichTextToolbarService,
    AggregateService,
    DetailRowService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
