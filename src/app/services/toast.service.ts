import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector, Type } from '@angular/core';
import { ToastComponent } from '../gui/toast/toast.component';
import { ToastRef } from '../model/toast.model';

@Injectable({
    providedIn: 'root'
})
export class ToastService {


    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector) {
    }

    toast(data: {
        content: string,
        icon: string
    }): ToastRef<ToastComponent> {

        const componentRef = this.componentFactoryResolver.resolveComponentFactory(ToastComponent).create(this.injector);
        this.appRef.attachView(componentRef.hostView);

        // Get DOM element from component
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        // Append DOM element to the body
        document.body.appendChild(domElem);
        componentRef.instance.data = data;

        const toastRef = new ToastRef<ToastComponent>(this.appRef);
        toastRef.componentRef = componentRef;
        componentRef.instance.toastRef = toastRef;

        return toastRef;
    }


}
