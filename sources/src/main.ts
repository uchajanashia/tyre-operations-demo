import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AdminDemoPage } from './admin-demo.page';
bootstrapApplication(AdminDemoPage, { providers: [provideZonelessChangeDetection()] }).catch(console.error);
