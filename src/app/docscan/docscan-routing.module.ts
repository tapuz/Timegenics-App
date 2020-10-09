import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocscanPage } from './docscan.page';

const routes: Routes = [
  {
    path: '',
    component: DocscanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocscanPageRoutingModule {}
