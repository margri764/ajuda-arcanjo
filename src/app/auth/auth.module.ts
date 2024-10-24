import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutes } from './auth.routing.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    // ReactiveFormsModule,
    // MatIconModule,
    // MatCardModule,
    // MatInputModule,
    // MatCheckboxModule,
    // MatButtonModule,
    // FormsModule,
    // TablerIconsModule.pick(TablerIcons),
    // AppErrorComponent,
    // AppMaintenanceComponent,
  ],
})
export class AuthModule {}