import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {MemberListComponent} from "./members/member-list/member-list.component";
import {ListsComponent} from "./lists/lists.component";
import {MessagesComponent} from "./messages/messages.component";
import {authGuard} from "./_guards/auth.guard";
import {TestErrorComponent} from "./_errors/test-error/test-error.component";
import {NotFoundComponent} from "./_errors/not-found/not-found.component";
import {ServerErrorComponent} from "./_errors/server-error/server-error.component";

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
    path: 'test-error',
    component: TestErrorComponent,
    title: 'Test Error'
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    title: 'Not Found'
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
    title: 'Server Error'
  },
  {
    path: '**',
    component: HomeComponent,
    pathMatch: 'full'
  },
];
