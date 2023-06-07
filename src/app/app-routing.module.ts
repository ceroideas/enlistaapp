import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { OffersService } from './services/offers.service';
import { ReservesService } from './services/reserves.service';

const role:any = localStorage.getItem('role');

const routes: Routes = [
  {
    path: '',
    redirectTo: role == 2 ? 'home-c' : 'home-l',
    pathMatch: 'full'
  },
  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'home-l',
    loadChildren: () => import('./local/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'home-c',
    loadChildren: () => import('./client/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'reserves',
    loadChildren: () => import('./client/reserves/reserves.module').then( m => m.ReservesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./client/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then( m => m.ContactPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'qr-ok',
    loadChildren: () => import('./client/qr-ok/qr-ok.module').then( m => m.QrOkPageModule)
  },
  {
    path: 'qr-c',
    loadChildren: () => import('./client/qr-c/qr-c.module').then( m => m.QrCPageModule)
  },
  {
    path: 'register2',
    loadChildren: () => import('./register2/register2.module').then( m => m.Register2PageModule)
  },
  {
    path: 'spaces',
    canActivate: [ReservesService],
    loadChildren: () => import('./local/spaces/spaces.module').then( m => m.SpacesPageModule)
  },
  {
    path: 'reserves-l',
    canActivate: [ReservesService],
    loadChildren: () => import('./local/reserves-l/reserves-l.module').then( m => m.ReservesLPageModule)
  },
  {
    path: 'customers',
    loadChildren: () => import('./local/customers/customers.module').then( m => m.CustomersPageModule)
  },
  {
    path: 'policy',
    loadChildren: () => import('./policy/policy.module').then( m => m.PolicyPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule)
  },
  {
    path: 'qr',
    loadChildren: () => import('./qr/qr.module').then( m => m.QrPageModule)
  },
  {
    path: 'view',
    loadChildren: () => import('./view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'recover',
    loadChildren: () => import('./recover/recover.module').then( m => m.RecoverPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'offers',
    canActivate: [OffersService],
    loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
  },
  {
    path: 'admin-notifications',
    canActivate: [OffersService],
    loadChildren: () => import('./admin-notifications/admin-notifications.module').then( m => m.AdminNotificationsPageModule)
  },
  {
    path: 'mysubscriptions',
    loadChildren: () => import('./mysubscriptions/mysubscriptions.module').then( m => m.MysubscriptionsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuard, OffersService, ReservesService]
})
export class AppRoutingModule {
  constructor() {

  }
}
