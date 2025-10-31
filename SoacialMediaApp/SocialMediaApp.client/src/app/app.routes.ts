import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {MemberListComponent} from "./members/member-list/member-list.component";
import {ListsComponent} from "./lists/lists.component";
import {MessagesComponent} from "./messages/messages.component";
import {authGuard} from "./_guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'members',
        component: MemberListComponent,
        title: 'Members',
      },
      {
        path: 'members/:id',
        component: MemberListComponent,
        title: `Member Details`
      },
      {
        path: 'lists',
        component: ListsComponent,
        title: 'Lists'
      },
      {
        path: 'messages',
        component: MessagesComponent,
        title: 'Messages'
      },
    ]
  },
  {
    path: '**',
    component: HomeComponent,
    pathMatch: 'full'
  },
];
