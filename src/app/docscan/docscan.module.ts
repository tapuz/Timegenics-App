import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocscanPageRoutingModule } from './docscan-routing.module';

import { DocscanPage } from './docscan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocscanPageRoutingModule
  ],
  declarations: [DocscanPage]
})
export class DocscanPageModule {}
