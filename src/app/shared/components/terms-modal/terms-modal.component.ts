import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-terms-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" @modalAnimation class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl max-h-screen overflow-hidden flex flex-col animate-scale-in">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <h2 class="text-white text-xl font-bold">Términos y Condiciones</h2>
          <button (click)="close()" class="text-white hover:bg-blue-600 p-2 rounded-lg transition-colors">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-6 text-gray-700 text-sm space-y-4">
          <section>
            <h3 class="font-bold text-lg text-gray-900 mb-2">1. Aceptación de Términos</h3>
            <p>Al utilizar nuestro servicio, aceptas nuestros términos y condiciones. Si no estás de acuerdo con estos términos, por favor no utilices nuestro servicio.</p>
          </section>

          <section>
            <h3 class="font-bold text-lg text-gray-900 mb-2">2. Uso del Servicio</h3>
            <p>Aceptas utilizar nuestro servicio solo para propósitos legales y de una manera que no infrinja los derechos de otros o restrinja su uso y disfrute de este servicio.</p>
          </section>

          <section>
            <h3 class="font-bold text-lg text-gray-900 mb-2">3. Privacidad de Datos</h3>
            <p>Tu privacidad es importante para nosotros. Prometemos proteger tus datos personales según nuestras políticas de privacidad. No compartiremos tu información sin tu consentimiento.</p>
          </section>

          <section>
            <h3 class="font-bold text-lg text-gray-900 mb-2">4. Responsabilidades del Usuario</h3>
            <p>Como usuario, eres responsable de mantener la confidencialidad de tu contraseña y de asumir toda la responsabilidad por las actividades que ocurran bajo tu cuenta.</p>
          </section>

          <section>
            <h3 class="font-bold text-lg text-gray-900 mb-2">5. Limitación de Responsabilidad</h3>
            <p>En la medida permitida por la ley, no seremos responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos que resulten del uso o la imposibilidad de usar nuestro servicio.</p>
          </section>

          <section>
            <h3 class="font-bold text-lg text-gray-900 mb-2">6. Cambios en los Términos</h3>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación en nuestro sitio web.</p>
          </section>

          <section>
            <h3 class="font-bold text-lg text-gray-900 mb-2">7. Contacto</h3>
            <p>Si tienes preguntas sobre estos términos, por favor contáctanos a través de nuestro formulario de contacto o envia un correo a info&#64;almuerzos.com</p>
          </section>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-between gap-3 border-t border-gray-200">
          <button 
            (click)="close()"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors">
            Rechazar
          </button>
          <button 
            (click)="accept()"
            class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-lg transition-all">
            <i class="fas fa-check mr-2"></i>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class TermsModalComponent {
  @Input() isOpen = false;
  @Output() onAccept = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  accept() {
    this.onAccept.emit();
  }

  close() {
    this.onClose.emit();
  }
}
