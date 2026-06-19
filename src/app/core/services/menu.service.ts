import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  icon: string;
  category: 'carnes' | 'vegetarianos' | 'pescados' | 'bajo-calorias';
}

export interface CartItem extends MenuItem {
  quantity: number;
}

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

  constructor() {
    this.initializeMenu();
  }

  private initializeMenu() {
    const items: MenuItem[] = [];
    this.menuItems.next(items);
  }

  addToCart(item: MenuItem): void {
    const currentCart = this.cart.value;
    const existingItem = currentCart.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentCart.push({ ...item, quantity: 1 });
    }

    this.cart.next([...currentCart]);
    this.updateCartTotal();
  }

  removeFromCart(itemId: number): void {
    const currentCart = this.cart.value.filter(i => i.id !== itemId);
    this.cart.next(currentCart);
    this.updateCartTotal();
  }

  updateQuantity(itemId: number, quantity: number): void {
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

  private updateCartTotal(): void {
    const total = this.cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cartTotal.next(parseFloat(total.toFixed(2)));
  }

  clearCart(): void {
    this.cart.next([]);
    this.cartTotal.next(0);
  }

  getCart(): CartItem[] {
    return this.cart.value;
  }

  getCartTotal(): number {
    return this.cartTotal.value;
  }
}
