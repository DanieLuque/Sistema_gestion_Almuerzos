import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem, CartItem } from '@database/models';

export { MenuItem, CartItem };

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private cart = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cart.asObservable();

  private cartTotal = new BehaviorSubject<number>(0);
  cartTotal$ = this.cartTotal.asObservable();

  private menuItems = new BehaviorSubject<MenuItem[]>([]);
  menuItems$ = this.menuItems.asObservable();

  constructor(private firestore: Firestore) {
    this.initializeMenu();
  }

  /**
   * Cargar items del menú desde Firestore
   */
  private initializeMenu(): void {
    const itemsRef = collection(this.firestore, 'menus');
    const q = query(itemsRef, where('disponible', '==', true));
    
    collectionData(q, { idField: 'id' }).subscribe(
      (items: any[]) => {
        const menuItems = items.map(item => ({
          ...item,
          category: item.category || 'carnes'
        })) as MenuItem[];
        this.menuItems.next(menuItems);
      },
      error => console.error('Error cargando menús:', error)
    );
  }

  /**
   * Obtener todos los items del menú
   */
  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItems$;
  }

  /**
   * Obtener items por categoría
   */
  getItemsByCategory(category: string): Observable<MenuItem[]> {
    return this.menuItems$.pipe(
      map(items => items.filter(item => item.category === category))
    );
  }

  /**
   * Añadir item al carrito
   */
  addToCart(item: MenuItem): void {
    const currentCart = this.cart.value;
    const existingItem = currentCart.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      const cartItem: CartItem = {
        ...item,
        quantity: 1
      };
      currentCart.push(cartItem);
    }

    this.cart.next([...currentCart]);
    this.updateCartTotal();
  }

  /**
   * Remover item del carrito
   */
  removeFromCart(itemId: string): void {
    const currentCart = this.cart.value.filter(i => i.id !== itemId);
    this.cart.next(currentCart);
    this.updateCartTotal();
  }

  /**
   * Actualizar cantidad de item
   */
  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const item = this.cart.value.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.cart.next([...this.cart.value]);
      this.updateCartTotal();
    }
  }

  /**
   * Actualizar total del carrito
   */
  private updateCartTotal(): void {
    const total = this.cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cartTotal.next(parseFloat(total.toFixed(2)));
  }

  /**
   * Vaciar carrito
   */
  clearCart(): void {
    this.cart.next([]);
    this.cartTotal.next(0);
  }

  /**
   * Obtener carrito actual
   */
  getCart(): CartItem[] {
    return this.cart.value;
  }

  /**
   * Obtener total del carrito
   */
  getCartTotal(): number {
    return this.cartTotal.value;
  }
}
