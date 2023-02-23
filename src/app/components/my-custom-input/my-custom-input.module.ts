import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCustomInputComponent } from './my-custom-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [MyCustomInputComponent],
  imports: [
    CommonModule,
    BrowserModule,        
    MatInputModule,
    FormsModule,
    BrowserAnimationsModule,    
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,        
  ],
  exports: [MyCustomInputComponent]
})
export class MyCustomInputModule { }
