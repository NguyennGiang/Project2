package com.hust.ecommerce.service;

import com.hust.ecommerce.dto.Purchase;
import com.hust.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
