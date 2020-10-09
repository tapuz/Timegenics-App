import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PictureproofPage } from './pictureproof.page';

const routes: Routes = [
  {
    path: '',
    component: PictureproofPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PictureproofPageRoutingModule {}
