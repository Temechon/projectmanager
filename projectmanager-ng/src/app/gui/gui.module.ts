import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { ActionButtonComponent } from './button/action-button.component';
import { EditableAreaComponent } from './editable-area/editable-area.component';
import { EditableTextComponent } from './editable-text/editable-text.component';
import { SelectListComponent } from './select-list/select-list.component';



@NgModule({
  declarations: [
    ActionButtonComponent,
    EditableTextComponent,
    EditableAreaComponent,
    SelectListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AutosizeModule
  ],
  exports: [
    ActionButtonComponent,
    EditableTextComponent,
    EditableAreaComponent,
    SelectListComponent
  ]
})
export class GuiModule { }
